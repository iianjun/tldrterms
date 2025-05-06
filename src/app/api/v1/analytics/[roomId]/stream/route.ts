import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import {
  AnalysisResultRes,
  OpenAIAnalayzedResponse,
  OpenAIValidationResponse,
} from "@/types/openai";
import { calculateScore } from "@/utils/calculate-score";
import { extractTextFromUrl } from "@/utils/website";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Extract text from the website
async function performFetching(url: string) {
  try {
    const text = await extractTextFromUrl(url);
    if (!text) {
      throw new Error("Error while fetching the website content.");
    }
    return {
      isSuccess: true,
      message: "success",
      result: { text },
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error while fetching the website content.",
    };
  }
}

export async function performValidation(text: string) {
  try {
    //Language/content detection
    const validation = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `
  You are an AI classifier. Given some website text, return a JSON object with:
  - 'language': one of 'EN' (English), 'KO' (Korean), or 'ETC' (any other)
  - 'document_type': 'terms' if the text appears to be a Terms of Service, 'privacy' if the text appears to be a Privacy Policy, 'unknown' otherwise.

  Respond only with a compact JSON object like:
  { "language": "EN", "document_type": terms }
          `,
        },
        {
          role: "user",
          content: text.slice(0, 2000),
        },
      ],
    });
    const validationRaw = JSON.parse(
      validation.choices[0].message.content ?? "{}"
    ) as unknown as OpenAIValidationResponse;
    const { language, document_type } = validationRaw;
    if (!["EN", "KO"].includes(language ?? "")) {
      return {
        isSuccess: false,
        message: "We currently only support English and Korean content.",
      };
    }
    if (document_type === "unknown") {
      return {
        isSuccess: false,
        message:
          "This page does not appear to be a Terms of Service or Privacy Policy. Please provide a direct link to such a page.",
      };
    }
    return {
      isSuccess: true,
      message: "success",
      result: { document_type },
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error while fetching the website content.",
    };
  }
}
//common
async function getChatResponse({
  text,
  prompt,
  document_type,
}: { text: string; prompt: string; document_type: "terms" | "privacy" }) {
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "user",
        content: text,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
  });
  const content = chatResponse.choices[0].message.content;
  const data = JSON.parse(content || "{}") as OpenAIAnalayzedResponse;
  const assessment = calculateScore({ points: data.points, document_type });
  data["score"] = assessment.score;
  data["score_category"] = assessment.category;
  return data;
}

//Analyze T&C
async function performTermsAnalyzing(
  text: string
): Promise<AnalysisResultRes<OpenAIAnalayzedResponse>> {
  try {
    const data = await getChatResponse({
      text,
      prompt: `
# ROLE:
You are an AI assistant specialized in analyzing legal documents, specifically Terms and Conditions (T&C), from a strict **user-centric perspective**. Your task is to identify and score clauses based on their potential impact on a user's rights, clarity, fairness, and control.

# CONTEXT:
This analysis is for a project named "TL;DR terms". The goal is to evaluate T&C documents and alert users to potentially concerning clauses. Your analysis must be based **SOLELY** on the raw text provided in the user message. Do not infer visual formatting (like bolding, layout) unless explicitly indicated by textual markers (e.g., \`SECTION 1\`, \`1.\`, \`A.\`, \`ALL CAPS lines\`, \`*\`, \`-\`). Ignore Privacy Policy details unless they directly grant rights or impose service conditions (like content licenses).

# TASK:
First, evaluate the text provided in the user message against the user-centric scoring matrix criteria (case_id 1.1 through 7.3) summarized below. For each criterion found within that text, generate a finding. **Remember to conduct your entire analysis strictly from the perspective of a typical end-user**, focusing on fairness, clarity, rights, and potential risks or disadvantages imposed upon the user.
Second, after performing the main scoring analysis, specifically scan the entire **provided Terms and Conditions text** for any explicit mentions or strong implications that user data is **stored in**, **processed in**, or **shared with entities located in China**.

**CRITICAL Instructions for Evaluation:**
1.  You **MUST** evaluate and provide an entry in the 'points' array for **EVERY** case_id listed in the SCORING MATRIX below (from 1.1 to 7.3). Do **NOT** invent new case_id values or omit any listed case_id.
2.  For each case_id, assign a Score from -2 to +2 based on relevant text found. Use the scale:
  * \`+2\`: Very Positive / Protective for User
  * \`+1\`: Generally Positive / Fair / Clear for User
  * \`0\`: Neutral / Standard Practice / Ambiguous but not necessarily negative
  * \`-1\`: Potentially Problematic / Vague / Slightly Unfair for User
  * \`-2\`: Clearly Disadvantageous / Unfair / Restrictive for User
3.  **If the provided Terms and Conditions text does not contain relevant information to score a specific criterion (case_id):** You **MUST** still include its entry in the 'points' array. In such cases:
  * Assign \`score: 0\`.
  * Use the **exact phrase** "No specific text found in the analyzed section corresponding to this criterion." for the \`description\`.
  * Set the new \`text_found\` field to \`false\`.
4.  **If relevant text IS found:**
  * The \`description\` field MUST contain your justification AND the specific quote(s) from the provided Terms and Conditions text that support the assigned score.
  * Set the new \`text_found\` field to \`true\`.

**SCORING MATRIX PHILOSOPHY & KEY AREAS (Apply to relevant text found):**

* **Category 1: Clarity & Accessibility (category ID: 'tc_clarity')**
  * *Criterion 1.1:* Language Complexity (+2 clear, -2 obscure)
  * *Criterion 1.2:* Textual Organization Markers (+2 clear markers, -2 wall of text)
  * *Criterion 1.3:* Definition of Key Terms (+1 defined, -1 undefined)
* **Category 2: User Rights & Obligations (category ID: 'user_rights')**
  * *Criterion 2.1:* Scope of Service (+1 clear, -1 vague)
  * *Criterion 2.2:* User Conduct Restrictions (+1 specific/reasonable, -2 vague/overly restrictive)
* **Category 3: User-Generated Content (UGC) (category ID: 'ugc')**
  * *Criterion 3.1:* Ownership (+2 user retains, -2 company claims)
  * *Criterion 3.2:* License Grant (+2 limited/necessary, -2 overly broad/perpetual/any purpose)
* **Category 4: Fees, Payment, & Cancellation (category ID: 'payment')**
  * *Criterion 4.1:* Fee Transparency (+2 fully transparent, -2 hidden/ambiguous)
  * *Criterion 4.2:* Auto-Renewal (+1 clear/easy opt-out, -2 hidden/hard to stop)
  * *Criterion 4.3:* Refund Policy (+2 generous/fair, -2 no refunds/restrictive)
  * *Criterion 4.4:* User Cancellation Rights (+2 easy/clear, -2 difficult/penalties)
* **Category 5: Changes to Terms & Termination (category ID: 'tc_changes')**
  * *Criterion 5.1:* Modification of Terms (+2 notice+consent/opt-out, -2 no notice/unilateral)
  * *Criterion 5.2:* Termination by Company (+1 specific grounds/notice, -2 arbitrary/no notice)
  * *Criterion 5.3:* Data/Content Handling After Termination (+1 retrieval possible, -1 immediate deletion / -2 company retains/uses)
* **Category 6: Dispute Resolution (category ID: 'disputes')**
  * *Criterion 6.1:* Mandatory Arbitration (+1 optional/allows small claims, -2 mandatory/unfavorable terms)
  * *Criterion 6.2:* Class Action Waiver (+2 permitted, -2 waived)
  * *Criterion 6.3:* Governing Law/Venue (+1 user's location/convenient, -1 inconvenient/unexpected)
* **Category 7: Liability & Disclaimers (category ID: 'liability')**
  * *Criterion 7.1:* Warranty Disclaimers (0 standard, +1 some warranty, -1 overly broad)
  * *Criterion 7.2:* Limitation of Liability (LoL) (+1 reasonable cap/excludes gross negligence, -2 very low cap/covers negligence)
  * *Criterion 7.3:* User Indemnification (+1 limited to user breach, -2 overly broad/covers company fault)

# OUTPUT FORMAT:
Provide your final response as a single, valid JSON object adhering EXACTLY to the following structure. Output ONLY the JSON object and nothing else.

The JSON object MUST contain ONLY the following keys at the top level:

\`\`\`json
{
  "title": "string | null",
  "summary": "string",
  "china_data_processing_details": "string | null",
  "points": [
    {
      "category": "string",
      "case_id": "number",
      "score": "number",
      "description": "string",
      "text_found": "boolean"
    }
  ]
}
}
\`\`\`

**Instructions for JSON field values:**
1.  \`title\`: A **string | null**. Determine the title based on the following priority, using *only* the provided text content:
    * **Priority 1: Service Name:** If a specific service name (e.g., 'Facebook', 'Acme Service', 'TL;DR terms') is clearly and prominently identified as the subject of the Terms, return that service name.
    * **Priority 2: Company Name:** If a specific service name is not clearly identifiable from the text, but a primary company name governing the service *is* clearly identifiable, return that company name. **Preference:** If both a common brand name (e.g., 'Meta', 'Google') and a full legal entity name (e.g., 'Meta Platforms, Inc.', 'Google LLC') are present and clearly refer to the same entity governing the service, **prefer the shorter, common brand name** (e.g., return 'Meta' instead of 'Meta Platforms, Inc.').
    * **Priority 3: Null:** If neither a clear service name nor a clear company name can be identified from the text, set this field to **\`null\`**.
2. \`summary\`: A **string**. **CRITICAL CONDITIONAL LOGIC:**
    * **IF** the result of the China data check (which populates \`china_data_processing_details\`) is **NOT null**: The summary MUST focus exclusively on reporting this China-related finding. **Examples:** "The terms indicate user data may be stored in or processed by entities located in China." **OR** "The terms indicate user data may be shared with third-party companies based in China."
    * **ELSE IF** the result of the China data check is **null**: The summary MUST provide a concise (2-4 sentence) user-centric overview of the main Terms & Conditions analysis (based on the 'points' array). Highlight major pros (e.g., criterion with score +2) and cons (e.g., criterion with score -2, high number of negative points, significant low coverage indicated by many 'text_found: false' entries).
3. \`china_data_processing_details\`:
  * IF the **provided T&C text** mentions data storage/processing/sharing involving China or Chinese entities, set this field to a **string** that **must begin with** the phrase \`"The terms state that "\` and explicitly indicate **where** the reference appears (e.g., a section number, heading, or paragraph).  
    *Example:* *The terms state that user data may be processed and stored in China, and may be subject to access by Chinese authorities without notice. **Section 8.3** mentions that the company partners with Chinese entities for data processing and storage.*
  * OTHERWISE (if no such mention is found), set this field to \`null\`.
4. \`points\`:
  * This MUST be an array of objects.
  * Each object in the array represents a scored criterion from the main analysis (Categories 1-7).
  * For each object:
      * \`category\`: A short string identifier for the category, using ONLY the IDs specified in parentheses in the 'SCORING MATRIX PHILOSOPHY & KEY AREAS' section above (e.g., 'clarity', 'ugc', 'liability').
      * \`case_id\`: The numeric identifier (e.g., 1.1, 3.2, 7.1) corresponding to the Criterion number from the scoring matrix section. This **MUST be a number** (e.g., 1.1, 3.2, 7.1).
      * \`score\`: The integer score assigned (-2, -1, 0, 1, or 2). If no relevant text was found for this case_id, the score MUST be 0.
      * \`description\`: A string containing the justification. If relevant text *was* found (\`text_found\` is \`true\`), this MUST include the specific quote supporting the score. If no relevant text was found (\`text_found\` is \`false\`), this MUST be the exact phrase "No specific text found in the analyzed section corresponding to this criterion.".
      * \`text_found\`: A **boolean**. Set to \`true\` if relevant text for this \`case_id\` was found and analyzed. Set to \`false\` if the \`description\` is exactly "No specific text found in the analyzed section corresponding to this criterion.".    
`,
      document_type: "terms",
    });
    return {
      isSuccess: true,
      message: "success",
      result: data,
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error analyzing Terms and Condition content.",
    };
  }
}

//Analyze Privacy Policy
async function performPrivacyAnalyzing(
  text: string
): Promise<AnalysisResultRes<OpenAIAnalayzedResponse>> {
  try {
    const data = await getChatResponse({
      text,
      prompt: `
# ROLE:
You are an AI assistant specialized in analyzing legal documents, specifically **Privacy Policies (PP)**, from a strict **user-centric perspective**. Your primary task is to critically evaluate the substance and clarity of the policy's text, identifying and scoring clauses based on their potential impact on a user's privacy rights, transparency, fairness, and control over their personal data. You must prioritize substance over mere mention of keywords and **strictly penalize vagueness or ambiguity that harms user understanding or creates uncertainty about key practices.**

# CONTEXT:
This analysis is for a project named "TL;DR terms". The goal is to evaluate **Privacy Policy** documents and alert users to potentially concerning clauses regarding their data. Your analysis must be based **SOLELY** on the raw text provided in the user message. Do not infer visual formatting (like bolding, layout) unless explicitly indicated by textual markers (e.g., \`SECTION 1\`, \`1.\`, \`A.\`, \`ALL CAPS lines\`, \`*\`, \`-\`).

# TASK:
First, meticulously evaluate the **substance and clarity** of the text provided in the user message against the detailed user-centric privacy scoring matrix criteria (case_id 1.1 through 8.1) provided below. For each criterion, generate a finding based *only* on relevant text present in the policy. **Remember to conduct your entire analysis strictly from the perspective of a typical end-user**, focusing on genuine transparency, data minimization, meaningful user control, data security, overall fairness, and potential risks related to their personal information. **Do not give positive scores for simply mentioning a topic; the text must provide clear, substantive information beneficial to the user. Crucially, vagueness, ambiguity, or lack of actionable detail that leaves the user uncertain about key practices or how to exercise rights MUST result in a negative score, typically -1.**
Second, after performing the main scoring analysis, specifically scan the entire **provided Privacy Policy text** for any explicit mentions or strong implications that user data is **stored in**, **processed in**, or **shared with entities located in China**.

**CRITICAL Instructions for Evaluation:**
1.  You **MUST** provide an entry in the \`points\` array for **EVERY** \`case_id\` listed in the SCORING MATRIX below (1.1 - 8.1). Do **NOT** invent new \`case_id\` values or omit any listed \`case_id\`.

2.  For each \`case_id\`, choose a score **strictly** according to the GLOBAL SCORE SCALE **and make sure the language of your \`description\` matches that score**.

   **GLOBAL SCORE SCALE**

   * **+2 (Excellent / Highly Protective)**  Unambiguously positive for users: clear, specific, easy to exercise, with strong privacy protections or rights.
   * **+1 (Good / Positive)**  Clearly positive and fair, though a bit less robust than +2. **No negative or ambiguous wording may appear in the description.**
   * **0 (Neutral / Standard Boilerplate)**  Clear enough but offers minimal detail or benefit; standard legal text; neither helpful nor harmful.
   * **-1 (Weak / Problematic)**  Contains vagueness, ambiguity, missing detail, or minor barriers that could hinder user understanding or rights. **If your description uses any negative qualifier (e.g., “somewhat vague”, “may hinder usability”, “unclear”), the score MUST be -1 or -2.**
   * **-2 (Harmful / Clearly Disadvantageous)**  Deceptive, removes or severely limits user rights, enables invasive practices, or is intentionally obscure.

3.  **Consistency Rule:** Positive scores (+1 or +2) require an entirely positive description. If the description contains any negative, uncertain, or critical language, the score must be -1 or -2. Neutral wording warrants a 0.

4.  If the Privacy Policy text does **NOT** contain relevant information for a criterion:  
    • Assign \`score: 0\`.  
    • Use the exact phrase “No specific text found in the analyzed section corresponding to this criterion.” in \`description\`.  
    • Set \`text_found\` to \`false\`.

5.  If relevant text **IS** found:  
    • The \`description\` must justify the score **and** include exact quote(s) from the policy.  
    • Set \`text_found\` to \`true\`.
**SCORING MATRIX & DETAILED CRITERIA (Apply rigorously):**

**Guiding Principle:** When in doubt, err on the side of the user.  
* Vague, ambiguous, or boilerplate language that leaves users uncertain about data practices **always warrants a negative score (-1 at minimum)**.  
* Positive scores (+1 or +2) require both clarity **and** substantive protections or rights. Merely mentioning a topic without meaningful, actionable detail is never enough for a positive score.

* **Category 1: Clarity & Accessibility (category ID: 'pp_clarity')**
    * *Criterion 1.1:* Language Clarity & Simplicity
        * +2: Exceptionally clear, plain language.
        * +1: Generally understandable; avoids/explains jargon well.
        * 0: Standard legalese; meaning discernible with effort, not actively misleading.
        * -1: Heavy jargon/complexity; **significantly difficult to be reasonably certain of meaning.** Creates uncertainty.
        * -2: Intentionally obscure/confusing/contradictory.
    * *Criterion 1.2:* Structural Organization & Readability
        * +2: Excellent structure, clear headings, easy navigation.
        * +1: Decent structure, functional headings, reasonably easy to follow.
        * 0: Basic structure (e.g., paragraphs only), lacks clear thematic headings, but information *can* be found with significant scanning/effort. **Does not actively prevent finding info.**
        * -1: Poorly structured; long paragraphs cover multiple topics, hard to find specific info; lack of clear divisions **significantly hinders understanding or locating key information.** (Matches user example 1)
        * -2: Appears intentionally disorganized, "wall of text" making comprehension unreasonably difficult.
    * *Criterion 1.3:* Accessibility of Privacy Contact Information
        * +2: Dedicated, easily findable, clearly labeled contact method(s).
        * +1: General contact info explicitly stated as usable for privacy matters. Reasonably accessible.
        * 0: General contact info provided, requires user inference OR contact info present but buried/somewhat hard to find. Minimally acceptable.
        * -1: Contact info extremely hard to locate, method seems ineffective, OR **vague mention without specific methods/guidance, creating significant barrier/uncertainty for user.** (Matches user example 2)
        * -2: No discernible contact info found, or contact explicitly restricted.
* **Category 2: Data Collection Practices (category ID: 'collection')**
    * *Criterion 2.1:* Transparency on Data Collected
        * +2: Highly specific, seemingly exhaustive list. High transparency.
        * +1: Multiple specific, understandable categories listed. Reasonably transparent.
        * 0: Mentions collection using only very general functional descriptions OR lists some categories but relies heavily on vague terms/qualifiers. Provides minimal *actual* transparency, standard boilerplate.
        * -1: Extremely vague, omits obvious necessary types, uses minimal examples, OR **uses ambiguous language leaving user uncertain about the scope of collection.** Seems evasive.
        * -2: No specific mention despite obvious collection, implies sensitive data collection without justification, OR actively misleading.
    * *Criterion 2.2:* Principle of Data Minimization
        * +2: Explicit minimization commitment AND data listed seems strictly essential.
        * +1: Data listed seems generally relevant and proportionate. No obviously excessive types.
        * 0: Standard data collection; relevance not explicitly justified or clear. Ambiguous proportionality but not clearly excessive.
        * -1: Collects data that **seems peripheral/unnecessary without clear justification/opt-in, creating user concern.**
        * -2: Appears to collect **clearly excessive** data with weak/no justification.
    * *Criterion 2.3:* Clarity on Collection Methods
        * +2: Clearly details multiple distinct methods. High transparency.
        * +1: Mentions primary methods clearly with basic context. Reasonably clear.
        * 0: Vague mention of methods OR standard cookie mention without detail on types/purpose. Minimally informative boilerplate.
        * -1: Fails to mention common methods where expected OR is **unclear/evasive about methods/sources (esp. third parties), leaving user uncertain.** (Matches user example 3)
        * -2: Suggests hidden/non-obvious methods without clear disclosure.
* **Category 3: Data Usage Practices (category ID: 'usage')**
    * *Criterion 3.1:* Clarity and Specificity of Purpose
        * +2: Specific purposes directly linked to data categories/types. High transparency.
        * +1: Multiple distinct, understandable purposes listed for core functions. Reasonably clear.
        * 0: Mentions purposes using very broad functional categories OR generic catch-alls ("business purposes"). Minimally informative boilerplate.
        * -1: Purposes extremely vague, seem unrelated/excessive, OR **ambiguity/lack of specifics leaves user uncertain about how their data will actually be used.** (Matches user example 4)
        * -2: No clear purpose stated for significant data collection, or purpose is overly broad/catch-all.
    * *Criterion 3.2:* Use for Secondary Purposes (Marketing, Advertising)
        * +2: Explicitly states NO use OR requires affirmative opt-in / prominent pre-use opt-out. Highly protective.
        * +1: Discloses use *only* for first-party marketing/ads AND provides clear, easy opt-out. Fair practice.
        * 0: Mentions potential use for *first-party* marketing/ads only, relies on standard opt-out, mechanism is reasonably functional. Basic, minimally acceptable.
        * -1: **Vague mention** of marketing/ads use (first or third party) **leaving scope/practice unclear**; **fails to clearly state** if data is used for these purposes when expected; opt-out unclear, difficult, narrow, buried, or ineffective. **Creates significant user uncertainty.** (Matches user example 5)
        * -2: Uses data extensively for third-party targeted ads/marketing with no clear disclosure or difficult/illusory opt-out. Likely selling/sharing widely. Actively harmful.
* **Category 4: Data Sharing & Third Parties (category ID: 'sharing')**
    * *Criterion 4.1:* Sharing with Third Parties (General)
        * +2: Explicitly states NO sharing except essential providers (named categories/purpose ideal). Highly protective.
        * +1: Names specific categories of necessary third parties AND links to plausible, necessary purposes. Reasonably transparent.
        * 0: Mentions sharing with vague categories OR lists categories but purpose is overly broad/unclear. Minimally informative boilerplate.
        * -1: Grants very broad permissions OR lists concerning categories ("marketing partners") **without clear user control mentioned nearby, creating uncertainty about the extent of sharing.** Seems evasive.
        * -2: Explicitly states broad rights to share widely without meaningful user control. Implies selling/widespread sharing. Actively harmful.
    * *Criterion 4.2:* Sharing/Selling Data for Commercial Gain (Third-Party Use)
        * +2: Explicitly states NEVER sold/shared for third-party commercial purposes. Highly protective.
        * +1: States data shared only in aggregated/de-identified form, clearly distinguished. Fair practice.
        * 0: Silent on the specific issue of selling/sharing for third-party commercial use. Ambiguous by omission.
        * -1: Uses ambiguous language *potentially* covering selling/sharing ("share business data," "share with partners for offers") **leaving the user uncertain**; suggests sharing with marketing partners/ad networks without clear limits/opt-outs. Concerning vagueness. (Score 0 if truly silent, -1 if ambiguously worded). (Likely matches user example 6, depending on exact wording - silence is 0, ambiguous wording is -1)
        * -2: Explicitly states data may be sold/shared for *their own* commercial purposes, or reserves broad rights suggesting this. Actively harmful.
    * *Criterion 4.3:* International Data Transfers
        * +2: Clearly states locations AND specifies robust protection mechanisms. High transparency.
        * +1: Mentions transfers AND states recognized protective measures are used. Reasonable assurance.
        * 0: General statement data *may* be processed globally. Standard boilerplate, silent on specifics. Minimally informative.
        * -1: Mentions transfers but provides **no info on safeguards** OR states transfers to weaker regions **without reassurance of specific safeguards, creating user uncertainty/risk.** (Matches user example 7)
        * -2: No mention despite likelihood OR implies transfers without adequate protection. Harmful lack of transparency.
* **Category 5: User Control & Rights (category ID: 'user_control')** (General: Unclear/vague process descriptions that create uncertainty or difficulty MUST score -1)
    * *Criterion 5.1:* Right to Access & Portability
        * +2: Clear right, simple/direct mechanism, mentions portability. Excellent usability.
        * +1: States right, reasonable process described. Good usability.
        * 0: Mentions right, process description minimal/slightly unclear but likely functional. Standard legal mention.
        * -1: Process appears difficult/costly/restricted OR **description is too vague or lacks clear instructions, making it difficult for user to understand how to exercise the right.** Poor usability/barrier. (Matches user example 8)
        * -2: No mention of right, or explicitly denies it.
    * *Criterion 5.2:* Right to Correction (Rectification)
        * +2: Clear right, simple/direct mechanism. Excellent usability.
        * +1: States right, reasonable process described. Good usability.
        * 0: Mentions right, process description minimal/slightly unclear. Standard legal mention.
        * -1: Process appears difficult/restricted OR **description lacks clear definition/instructions, leaving user uncertain how to rectify.** Poor usability/barrier. (Matches user example 9)
        * -2: No mention of right, or explicitly denies it.
    * *Criterion 5.3:* Right to Deletion (Erasure / "To Be Forgotten")
        * +2: Clear right, simple mechanism, only necessary/narrow exceptions listed. Excellent usability & limitation.
        * +1: States right, reasonable process, plausible exceptions categorized. Good usability & limitation.
        * 0: Mentions right, process minimal/slightly unclear OR lists broad/vague exceptions ("business reasons"). Standard mention, practical effect uncertain.
        * -1: Process appears cumbersome, exceptions overly broad, description lacks clear mechanism/instructions, OR implies only anonymization. **User left uncertain or facing difficulty.** Poor usability/concerning limitations. (Matches user example 10)
        * -2: No mention of right, explicitly denies it, or states indefinite retention.
    * *Criterion 5.4:* Opt-Out Mechanisms (Marketing, Non-Essential Processing)
        * +2: Easy, granular controls, respected promptly, covers various types. Excellent control.
        * +1: Clear, functional opt-out for major uses (e.g., marketing emails). Good control.
        * 0: Mentions opt-out, process unclear/effortful/limited (e.g., only cookie banner). Standard, potentially ineffective.
        * -1: Opt-out process difficult/hidden/complex OR **vagueness/lack of clear instructions/mechanisms leaves user uncertain about what can be opted out of or how.** Poor control/barrier. (Matches user example 11)
        * -2: No clear way to opt-out of significant non-essential processing/marketing.
* **Category 6: Data Security & Retention (category ID: 'security')**
    * *Criterion 6.1:* Transparency on Security Measures
        * +2: Describes multiple specific measures. Gives confidence.
        * +1: Mentions at least one specific category OR elaborates slightly on standard phrases. Shows some effort.
        * 0: Generic statement ("reasonable security") with no specifics/elaboration. Pure boilerplate.
        * -1: Extremely vague mention OR focuses heavily on user responsibility **while minimizing/omitting company measures, creating uncertainty about actual protection.**
        * -2: No mention, or disclaimers suggesting no real security.
    * *Criterion 6.2:* Data Retention Policy Clarity
        * +2: Specifies clear, finite periods or clear, objective criteria. High predictability.
        * +1: Links "as long as necessary" to specific, understandable criteria. Reasonable transparency.
        * 0: Vague statement ("as long as necessary," "business needs") with **no clarifying criteria or context**. Minimally informative boilerplate.
        * -1: Suggests potentially long/indefinite retention without clear justification OR criteria are excessively broad **leaving the user uncertain about when (or if) data will be deleted.** Concerning lack of clarity. (Matches user example 12)
        * -2: No mention of limits, implies indefinite retention, or states excessively long periods.
* **Category 7: Policy Changes & Notification (category ID: 'pp_changes')**
    * *Criterion 7.1:* Notification of Policy Changes
        * +2: Proactive notification of material changes in advance. User actively informed.
        * +1: Passive notice (posting update), clear effective date guidance. Transparent.
        * 0: Implies posting is sufficient notice. Standard practice, minimal user consideration.
        * -1: States right to change **without specifying *any* notice method**, or implies immediate effect without review time. **Creates uncertainty for user about being informed.** (Matches user example 13)
        * -2: Explicitly states no notice, or reserves right to change retroactively.
* **Category 8: Children's Privacy (category ID: 'children')**
    * *Criterion 8.1:* Handling of Children's Data (e.g., COPPA/GDPR-K Compliance)
        * +2: Highly compliant (VPC or clear exclusion + deletion mechanism).
        * +1: Reasonably compliant (states not intended, basic compliance statement/contact).
        * 0: Silent BUT service clearly not targeted at children OR mentions briefly without compliance detail.
        * -1: Might appeal to children, but policy **vague on limits or lacks required compliance specifics, creating compliance risk/uncertainty.**
        * -2: Targets children but fails legal requirements OR knowingly collects non-compliantly.

# OUTPUT FORMAT:
Provide your final response as a single, valid JSON object adhering EXACTLY to the following structure. Output ONLY the JSON object and nothing else.

The JSON object MUST contain ONLY the following keys at the top level:

\`\`\`json
{
  "title": "string | null",
  "summary": "string",
  "china_data_processing_details": "string | null",
  "points": [
    {
      "category": "string",
      "case_id": "number",
      "score": "number",
      "description": "string",
      "text_found": "boolean"
    }
  ]
}
\`\`\`

# Instructions for JSON field values:

1.  \`title\`: A **string | null**. Determine the title based on the following priority, using *only* the provided text content:
    * **Priority 1: Service Name:** If a specific service name (e.g., 'Facebook', 'Acme Service', 'TL;DR terms') is clearly and prominently identified as the subject of the Privacy Policy, return that service name.
    * **Priority 2: Company Name:** If a specific service name is not clearly identifiable from the text, but a primary company name governing the service *is* clearly identifiable, return that company name. **Preference:** If both a common brand name (e.g., 'Meta', 'Google') and a full legal entity name (e.g., 'Meta Platforms, Inc.', 'Google LLC') are present and clearly refer to the same entity governing the service, **prefer the shorter, common brand name** (e.g., return 'Meta' instead of 'Meta Platforms, Inc.').
    * **Priority 3: Null:** If neither a clear service name nor a clear company name can be identified from the text, set this field to **\`null\`**.
2. \`summary\`: A **string**. **CRITICAL CONDITIONAL LOGIC:**
    * **IF** the result of the China data check (which populates \`china_data_processing_details\`) is **NOT null**: The summary MUST focus exclusively on reporting this China-related finding. **Examples:** "The terms indicate user data may be stored in or processed by entities located in China." **OR** "The terms indicate user data may be shared with third-party companies based in China."
    * **ELSE IF** the result of the China data check is **null**: The summary MUST provide a concise (2-4 sentence) user-centric overview of the main Terms & Conditions analysis (based on the 'points' array). Highlight major pros (e.g., criterion with score +2) and cons (e.g., criterion with score -2, high number of negative points, significant low coverage indicated by many 'text_found: false' entries).
3.  \`china_data_processing_details\`:
    * IF the **provided Privacy Policy text** mentions data storage/processing/sharing involving China or Chinese entities, set this field to a **string** that **must begin with** the phrase \`"The privacy policy states that "\` and should explicitly indicate **where** the reference appears (e.g., quoting a section number/heading if available, or describing the paragraph location). Include a brief summary of the finding.
        *Example:* \`"The privacy policy states that (in Section 8.3 'International Transfers') user data may be processed and stored by partners in China, subject to local laws."\`
    * OTHERWISE (if no such mention is found), set this field to \`null\`.
4.  \`points\`:
    * This MUST be an array of objects.
    * Each object in the array represents a scored criterion from the main analysis (Categories 1-8).
    * For each object:
        * \`category\`: A short string identifier for the category, using ONLY the IDs specified (e.g., 'pp_clarity', 'collection', 'usage').
        * \`case_id\`: The numeric identifier (e.g., 1.1, 3.2, 7.1). This **MUST be a number**.
        * \`score\`: The integer score assigned (-2, -1, 0, 1, or 2) based **strictly on the detailed definitions in the SCORING MATRIX**. If no relevant text was found for this \`case_id\` (per Critical Instruction #3), the score **MUST be 0**.
        * \`description\`: A string containing the justification.
            * If \`text_found\` is \`true\`: This MUST contain the justification explaining *why* the text meets the specific score definition, AND include the specific quote(s) supporting the score.
            * If \`text_found\` is \`false\`: This MUST be the exact phrase \`"No specific text found in the analyzed section corresponding to this criterion."\`.
        * \`text_found\`: A **boolean**. Set to \`true\` if relevant text for this \`case_id\` was found and analyzed. Set to \`false\` if no relevant text was found.
`,
      document_type: "privacy",
    });
    return {
      isSuccess: true,
      message: "success",
      result: data,
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error analyzing Privacy Policy content.",
    };
  }
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params;
  const supabase = await createClient();
  const { userId, isInvalid } = await getAuthentication();
  if (isInvalid) {
    return CustomResponse.error({
      errorCode: "UNAUTHORIZED",
      status: 401,
    });
  }
  const { data: roomData } = await supabase
    .from("analytic_rooms")
    .select("url, manual_text")
    .eq("id", Number(roomId))
    .eq("user_id", userId)
    .single();
  if (!roomData) {
    return CustomResponse.error({
      errorCode: "ROOM_NOT_FOUND",
      status: 404,
    });
  }
  const { url, manual_text } = roomData;
  if (!url && !manual_text) {
    return CustomResponse.error({
      errorCode: "URL_BAD_REQUEST",
      status: 400,
    });
  }
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: {
        success: boolean;
        error?: string;
        data: any;
      }) => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ ...data, statusCode: data.success ? 200 : 400 })}\n\n`
          )
        );
      };
      try {
        console.info(`Start fetching for ${url}...`);
        send({ success: true, data: { status: "fetching" } });
        let text;
        if (!manual_text) {
          const fetchingResult = await performFetching(url);
          if (!fetchingResult.isSuccess || !fetchingResult.result)
            throw new Error("Error while fetching the website content.");
          text = fetchingResult.result.text;
        } else {
          text = manual_text;
        }
        console.info(`Start analyzing for ${url}...`);
        send({ success: true, data: { status: "analyzing" } });
        const validationResult = await performValidation(text);
        if (!validationResult.isSuccess || !validationResult.result)
          throw new Error(validationResult.message);

        let analysisResult;
        if (validationResult.result.document_type === "terms") {
          analysisResult = await performTermsAnalyzing(text);
        } else {
          analysisResult = await performPrivacyAnalyzing(text);
        }
        if (
          !analysisResult ||
          !analysisResult.isSuccess ||
          !analysisResult.result
        ) {
          throw new Error(analysisResult.message);
        }
        const {
          score,
          summary,
          score_category,
          china_data_processing_details,
          points,
          title,
        } = analysisResult.result;
        console.info(`Start saving for ${url}...`);
        await supabase
          .from("analytic_rooms")
          .update({
            title,
          })
          .eq("id", Number(roomId));
        const { data: analytic, error: analyticError } = await supabase
          .from("analytics")
          .insert({
            score,
            score_category,
            summary,
            document_type: validationResult.result.document_type,
            user_id: userId,
            room_id: Number(roomId),
            china_data_processing_details,
          })
          .select("*")
          .single();

        if (!analytic || analyticError) {
          console.error(`analyticError: `, analyticError);
          throw new Error("Error analyzing the content.");
        }
        const { data: analytic_points, error: analyticPointError } =
          await supabase
            .from("analytic_points")
            .insert(
              points.map((point) => ({
                analytic_id: analytic.id,
                category: point.category,
                case_id: point.case_id,
                description: point.description,
                score: point.score,
                text_found: point.text_found,
              }))
            )
            .select("*");
        if (analyticPointError) {
          console.error(`analyticPointError`, analyticPointError);
          throw new Error("Error analyzing the content.");
        }
        const { data: room } = await supabase
          .from("analytic_rooms")
          .update({
            analytic_status: "completed",
          })
          .eq("id", Number(roomId))
          .select("*")
          .single();
        if (!room) {
          throw new Error("Room not found");
        }
        send({
          success: true,
          data: {
            status: "done",
            analytic: {
              ...analytic,
              analytic_points: analytic_points,
            },
            room,
          },
        });
      } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : "Unknown";
        await supabase
          .from("analytic_rooms")
          .update({
            analytic_status: "error",
            error_msg: message,
          })
          .eq("id", Number(roomId));
        send({ success: false, error: message, data: { status: "error" } });
        controller.enqueue(encoder.encode);
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

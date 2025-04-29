import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import {
  AnalysisResultRes,
  OpenAIAnalayzedResponse,
  OpenAIValidationResponse,
} from "@/types/openai";
import { calculateScore } from "@/utils/calculate-score";
import {
  getWebsiteTextUndici,
  getWebsiteTextWithPuppeteer,
} from "@/utils/get-website";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

//Extract text from the website
async function performFetching(url: string) {
  try {
    let text = "";
    const { isSuccess, result } = await getWebsiteTextUndici(url);
    if (isSuccess && result) {
      text = result;
    }
    if (!isSuccess) {
      console.info("Retrying with puppeteer...");
      const res = await getWebsiteTextWithPuppeteer(url);
      if (res.isSuccess && res.result) {
        text = res.result;
      }
    }
    if (!text) {
      return {
        isSuccess: false,
        message:
          "We couldn't load the content from given URL. Please check the URL and try again.",
      };
    }
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
      result: { text, document_type },
    };
  } catch (e) {
    console.error(e);
    return { isSuccess: false, message: "Error fetching the website content." };
  }
}

//common
async function getChatResponse({
  text,
  prompt,
}: { text: string; prompt: string }) {
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
  const assessment = calculateScore(data.points);
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

**Instructions for JSON field values:**

1.  \`china_data_processing_details\`:
  * IF the **provided T&C text** mentions data storage/processing/sharing involving China or Chinese entities, set this field to a **string** briefly explaining the finding (e.g., "Text mentions data transfer to or processing by entities in China.").
  * OTHERWISE (if no such mention is found), set this field to \`null\`.
2.  \`points\`:
  * This MUST be an array of objects.
  * Each object in the array represents a scored criterion from the main analysis (Categories 1-7).
  * For each object:
      * \`category\`: A short string identifier for the category, using ONLY the IDs specified in parentheses in the 'SCORING MATRIX PHILOSOPHY & KEY AREAS' section above (e.g., 'clarity', 'ugc', 'liability').
      * \`case_id\`: The numeric identifier (e.g., 1.1, 3.2, 7.1) corresponding to the Criterion number from the scoring matrix section. This **MUST be a number** (e.g., 1.1, 3.2, 7.1).
      * \`score\`: The integer score assigned (-2, -1, 0, 1, or 2). If no relevant text was found for this case_id, the score MUST be 0.
      * \`description\`: A string containing the justification. If relevant text *was* found (\`text_found\` is \`true\`), this MUST include the specific quote supporting the score. If no relevant text was found (\`text_found\` is \`false\`), this MUST be the exact phrase "No specific text found in the analyzed section corresponding to this criterion.".
      * \`text_found\`: A **boolean**. Set to \`true\` if relevant text for this \`case_id\` was found and analyzed. Set to \`false\` if the \`description\` is exactly "No specific text found in the analyzed section corresponding to this criterion.".    
`,
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
You are an AI assistant specialized in analyzing legal documents, specifically **Privacy Policies (PP)**, from a strict **user-centric perspective**. Your task is to identify and score clauses based on their potential impact on a user's privacy, rights, transparency, fairness, and control over their personal data.

# CONTEXT:
This analysis is for a project named "TL;DR terms". The goal is to evaluate **Privacy Policy** documents and alert users to potentially concerning clauses regarding their data. Your analysis must be based **SOLELY** on the raw text provided in the user message. Do not infer visual formatting (like bolding, layout) unless explicitly indicated by textual markers (e.g., \`SECTION 1\`, \`1.\`, \`A.\`, \`ALL CAPS lines\`, \`*\`, \`-\`).

#TASK:
First, evaluate the text provided in the user message against the user-centric privacy scoring matrix criteria (case_id 1.1 through 8.1) summarized below. For each criterion found within that text, generate a finding. **Remember to conduct your entire analysis strictly from the perspective of a typical end-user**, focusing on data minimization, transparency, user control, data security, fairness, and potential risks related to their personal information.
Second, after performing the main scoring analysis, specifically scan the entire **provided Privacy Policy text** for any explicit mentions or strong implications that user data is **stored in**, **processed in**, or **shared with entities located in China**.

**CRITICAL Instructions for Evaluation:**
1.  You **MUST** evaluate and provide an entry in the 'points' array for **EVERY** case_id listed in the SCORING MATRIX below (from 1.1 to 8.1). Do **NOT** invent new case_id values or omit any listed case_id.
2.  For each case_id, assign a Score from -2 to +2 based on relevant text found. Use the scale:
    * \`+2\`: Very Positive / Protective for User Privacy & Control
    * \`+1\`: Generally Positive / Fair / Clear regarding User Data
    * \`0\`: Neutral / Standard Practice / Ambiguous but not necessarily negative
    * \`-1\`: Potentially Problematic / Vague / Slightly Unfair regarding User Data
    * \`-2\`: Clearly Disadvantageous / Unfair / Invasive / Restrictive for User Privacy
3.  **If the provided Privacy Policy text does not contain relevant information to score a specific criterion (case_id):** You **MUST** still include its entry in the 'points' array. In such cases:
    * Assign \`score: 0\`.
    * Use the **exact phrase** "No specific text found in the analyzed section corresponding to this criterion." for the \`description\`.
    * Set the new \`text_found\` field to \`false\`.
4.  **If relevant text IS found:**
    * The \`description\` field MUST contain your justification AND the specific quote(s) from the provided Privacy Policy text that support the assigned score.
    * Set the new \`text_found\` field to \`true\`. 

**SCORING MATRIX PHILOSOPHY & KEY AREAS (Apply to relevant text found):**

* **Category 1: Clarity & Accessibility (category ID: 'pp_clarity')**
    * *Criterion 1.1:* Language Clarity & Simplicity (+2 clear, -2 obscure)
    * *Criterion 1.2:* Structural Organization & Readability (+2 clear markers, -2 wall of text)
    * *Criterion 1.3:* Accessibility of Privacy Contact Information (+2 easy/dedicated, -2 none)
* **Category 2: Data Collection Practices (category ID: 'collection')**
    * *Criterion 2.1:* Transparency on Data Collected (+2 specific, -2 none/vague)
    * *Criterion 2.2:* Principle of Data Minimization (+2 explicit/clear essential, -2 excessive/unjustified)
    * *Criterion 2.3:* Clarity on Collection Methods (+2 clear/detailed, -2 hidden/unclear)
* **Category 3: Data Usage Practices (category ID: 'usage')**
    * *Criterion 3.1:* Clarity and Specificity of Purpose (+2 specific/linked, -2 vague/overly broad)
    * *Criterion 3.2:* Use for Secondary Purposes (Marketing, Advertising) (+2 no use OR clear opt-out first, -2 extensive use/no opt-out)
* **Category 4: Data Sharing & Third Parties (category ID: 'sharing')**
    * *Criterion 4.1:* Sharing with Third Parties (General) (+2 none OR specific list/purpose, -2 broad sharing/vague)
    * *Criterion 4.2:* Sharing/Selling Data for Commercial Gain (+2 explicitly no, -2 explicit yes or broad rights)
    * *Criterion 4.3:* International Data Transfers (+2 clear locations/safeguards, -2 none/unclear safeguards)
* **Category 5: User Control & Rights (category ID: 'user_control')**
    * *Criterion 5.1:* Right to Access & Portability (+2 easy process/portability, -2 none/denied)
    * *Criterion 5.2:* Right to Correction (Rectification) (+2 easy process, -2 none/denied)
    * *Criterion 5.3:* Right to Deletion (Erasure / "To Be Forgotten") (+2 easy process/minimal exceptions, -2 none/denied/broad exceptions)
    * *Criterion 5.4:* Opt-Out Mechanisms (Marketing, Non-Essential Processing) (+2 easy/granular, -2 none/difficult)
* **Category 6: Data Security & Retention (category ID: 'security')**
    * *Criterion 6.1:* Transparency on Security Measures (+2 specific measures, -2 none/vague)
    * *Criterion 6.2:* Data Retention Policy Clarity (+2 clear periods/criteria, -2 none/indefinite)
* **Category 7: Policy Changes & Notification (category ID: 'pp_changes')**
    * *Criterion 7.1:* Notification of Policy Changes (+2 proactive notice/summary, -1 no notice/immediate effect)
* **Category 8: Children's Privacy (category ID: 'children')**
    * *Criterion 8.1:* Handling of Children's Data (+2 clear compliance/not collected, -2 non-compliant collection)


# OUTPUT FORMAT:
Provide your final response as a single, valid JSON object adhering EXACTLY to the following structure. Output ONLY the JSON object and nothing else.

The JSON object MUST contain ONLY the following keys at the top level:

\`\`\`json
{
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

**Instructions for JSON field values:**

1.  \`china_data_processing_details\`:
  * IF the **provided Privacy Policy text** mentions data storage/processing/sharing involving China or Chinese entities, set this field to a **string** briefly explaining the finding (e.g., "Text mentions data transfer to or processing by entities in China.").
  * OTHERWISE (if no such mention is found), set this field to \`null\`.
2.  \`points\`:
  * This MUST be an array of objects.
  * Each object in the array represents a scored criterion from the main analysis (Categories 1-8).
  * For each object:
      * \`category\`: A short string identifier for the category, using ONLY the IDs specified in parentheses in the 'SCORING MATRIX PHILOSOPHY & KEY AREAS' section above (e.g., 'clarity', 'ugc', 'liability').
      * \`case_id\`: The numeric identifier (e.g., 1.1, 3.2, 7.1) corresponding to the Criterion number from the scoring matrix section. This **MUST be a number** (e.g., 1.1, 3.2, 7.1).
      * \`score\`: The integer score assigned (-2, -1, 0, 1, or 2). If no relevant text was found for this case_id, the score MUST be 0.
      * \`description\`: A string containing the justification. If relevant text *was* found (\`text_found\` is \`true\`), this MUST include the specific quote supporting the score. If no relevant text was found (\`text_found\` is \`false\`), this MUST be the exact phrase "No specific text found in the analyzed section corresponding to this criterion.".
      * \`text_found\`: A **boolean**. Set to \`true\` if relevant text for this \`case_id\` was found and analyzed. Set to \`false\` if the \`description\` is exactly "No specific text found in the analyzed section corresponding to this criterion.".    
`,
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
      message: "Unauthorized",
      status: 401,
    });
  }
  const { data: roomData } = await supabase
    .from("analytic_rooms")
    .select("url")
    .eq("id", Number(roomId))
    .eq("user_id", userId)
    .single();
  if (!roomData) {
    return CustomResponse.error({
      message: "Room not found",
      status: 404,
    });
  }
  const { url } = roomData;
  if (!url) {
    return CustomResponse.error({
      message: "Missing URL",
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
        const fetchingResult = await performFetching(url);
        if (!fetchingResult.isSuccess || !fetchingResult.result)
          throw new Error(fetchingResult.message);

        console.info(`Start analyzing for ${url}...`);
        send({ success: true, data: { status: "analyzing" } });
        let analysisResult;
        if (fetchingResult.result.document_type === "terms") {
          analysisResult = await performTermsAnalyzing(
            fetchingResult.result.text
          );
        } else {
          analysisResult = await performPrivacyAnalyzing(
            fetchingResult.result.text
          );
        }
        if (
          !analysisResult ||
          !analysisResult.isSuccess ||
          !analysisResult.result
        ) {
          throw new Error(analysisResult.message);
        }
        calculateScore;
        const { score, score_category, china_data_processing_details, points } =
          analysisResult.result;
        console.info(`Start saving for ${url}...`);
        const { data: analytic, error: analyticError } = await supabase
          .from("analytics")
          .insert({
            score,
            score_category,
            document_type: fetchingResult.result.document_type,
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
        await supabase
          .from("analytic_rooms")
          .update({
            analytic_status: "completed",
          })
          .eq("id", Number(roomId));

        send({
          success: true,
          data: {
            status: "done",
            ...analytic,
            analytic_points: analytic_points,
          },
        });
      } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : "Unknown";
        await supabase
          .from("analytic_rooms")
          .update({
            analytic_status: "error",
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

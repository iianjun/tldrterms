import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import {
  AnalysisResultRes,
  OpenAIAnalayzedResponse,
  OpenAIValidationResponse,
} from "@/types/openai";
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

//Analyze T&C
async function performTermsAnalyzing(
  text: string
): Promise<AnalysisResultRes<OpenAIAnalayzedResponse>> {
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
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
3.  **If the provided Terms and Conditions text does not contain relevant information to score a specific criterion (case_id):** You **MUST** still include its entry in the 'points' array. In such cases, assign \`score: 0\` and use the **exact phrase** "No specific text found in the analyzed section corresponding to this criterion." for the \`description\`.
4.  **If relevant text IS found:** The \`description\` field MUST contain your justification AND the specific quote(s) from the provided Terms and Conditions text that support the assigned score.

**SCORING MATRIX PHILOSOPHY & KEY AREAS (Apply to relevant text found):**

* **Category 1: Clarity & Accessibility (category ID: 'clarity')**
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
* **Category 5: Changes to Terms & Termination (category ID: 'changes')**
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
      "case_id": "string",
      "score": "number",
      "description": "string",
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
        * \`case_id\`: The numeric identifier (e.g., 1.1, 3.2, 7.1) corresponding to the Criterion number from the scoring matrix section. This **MUST be a string** (e.g., "1.1", "3.2", "7.1").
        * \`score\`: The integer score assigned (-2, -1, 0, 1, or 2). If no relevant text was found for this case_id, the score MUST be 0.
        * \`description\`: A string containing the justification. If relevant text was found, this MUST include the specific quote supporting the score. If no relevant text was found, this MUST be the exact phrase "No specific text found in the analyzed section corresponding to this criterion.".
    * If no scorable criteria (Categories 1-7) are found in the **provided T&C text**, the \`points\` array MUST be empty (\`[]\`).
`,
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
    const score = calculateScore(data);
    data["score"] = score;

    return {
      isSuccess: true,
      message: "success",
      result: data,
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error analyzing the content.",
    };
  }
}

//Analyze Privacy Policy
async function performPrivacyAnalyzing(
  _: string
): Promise<AnalysisResultRes<OpenAIAnalayzedResponse>> {
  return { isSuccess: false, message: "Not implemented yet." };
}
function calculateScore({
  points,
  china_data_processing_details,
}: OpenAIAnalayzedResponse) {
  if (china_data_processing_details) return -999;
  return points.reduce((acc, point) => {
    return acc + point.score;
  }, 0);
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
        const { score, china_data_processing_details, points } =
          analysisResult.result;
        console.dir(analysisResult.result, { depth: 10 });
        console.info(`Start saving for ${url}...`);
        const { data, error: analyticError } = await supabase
          .from("analytics")
          .insert({
            score,
            document_type: fetchingResult.result.document_type,
            user_id: userId,
            room_id: Number(roomId),
            china_data_processing_details,
          })
          .select("id")
          .single();

        if (!data || analyticError) {
          console.error(`analyticError: `, analyticError);
          throw new Error("Error analyzing the content.");
        }
        const { error: analyticPointError } = await supabase
          .from("analytic_points")
          .insert(
            points.map((point) => ({
              analytic_id: data.id,
              category: point.category,
              case_id: point.case_id,
              description: point.description,
              score: point.score,
            }))
          );
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
          data: { status: "done", ...analysisResult.result },
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

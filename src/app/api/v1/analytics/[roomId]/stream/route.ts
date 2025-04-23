import { CustomResponse } from "@/lib/response";
import { getAuthentication } from "@/lib/supabase/authentication";
import { createClient } from "@/lib/supabase/server";
import {
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
      messages: [
        {
          role: "system",
          content: `
  You are an AI classifier. Given some website text, return a JSON object with:
  - 'language': one of 'EN' (English), 'KO' (Korean), or 'ETC' (any other)
  - 'isTermsOrPrivacy': true if the text appears to be a Terms of Service or Privacy Policy, false otherwise.

  Respond only with a compact JSON object like:
  { "language": "EN", "isTermsOrPrivacy": false }
          `,
        },
        {
          role: "user",
          content: text.slice(0, 2000),
        },
      ],
      temperature: 0,
    });
    const validationRaw = (validation.choices[0].message.content ??
      "{}") as unknown as OpenAIValidationResponse;
    const { language, isTermsOrPrivacy } = validationRaw;

    if (!["EN", "KO"].includes(language ?? "")) {
      return {
        isSuccess: false,
        message: "We currently only support English and Korean content.",
      };
    }
    if (!isTermsOrPrivacy) {
      return {
        isSuccess: false,
        message:
          "This page does not appear to be a Terms of Service or Privacy Policy. Please provide a direct link to such a page.",
      };
    }
    return { isSuccess: true, message: "success", result: text };
  } catch (e) {
    console.error(e);
    return { isSuccess: false, message: "Error fetching the website content." };
  }
}

async function performAnalyzing(text: string) {
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an AI legal evaluator for TLDRTerms. Your job is to analyze Terms of Service and Privacy Policy documents and return a structured score using the TLDRTerms matrix system.

---

### 📦 Return a JSON object with the following structure:

- score: total score (sum of all points unless overridden by geopolitical risk)
- triggered_geopolitical_risk: true or false
- points: an array of objects, each representing one evaluated case, structured as:
  - category: one of "privacy", "transparency", "rights", "security", "geopolitical_risk"
  - case_id: number (see matrix below)
  - rating: "good", "bad", or "neutral"
  - importance: "minor", "major", or "critical"
  - description: (required) explain clearly why the rating was assigned and what was found in the document

---

### 🎯 Evaluation Instructions

1. **Match against defined cases**
   Identify passages that match the defined cases in the matrix. Do not invent new cases.

2. **Assign a "rating":**
   - "good" → The service clearly benefits or protects the user on that case
   - "bad" → The service clearly disadvantages the user on that case
   - "neutral" → The service is vague, not applicable, or doesn’t mention the case at all

3. **Assign an "importance"**
   Each case has a fixed importance level in the matrix:
   - "minor" → Not critical but still relevant
   - "major" → Significant impact on users
   - "critical" → Major legal, privacy, or rights concern

4. **Scoring Rules:**
   Combine "rating" and "importance" to calculate the score for each point:

   | Rating   | Minor | Major | Critical |
   |----------|-------|-------|----------|
   | Good     | +1    | +2    | +3       |
   | Bad      | -1    | -2    | -3       |
   | Neutral  | 0     | 0     | 0        |

   > The final "score" field in the JSON response is the sum of all individual point scores.

---

### 🚨 Geopolitical Risk Override

If the document **mentions** any of the following:
- storing user data in China
- sharing user data with Chinese companies or cloud services
- cooperating with Chinese government agencies

Then:
- Add a point with:
  - category: "geopolitical_risk"
  - case_id: 16
  - rating: "bad"
  - importance: "critical"
  - description: "Service stores or shares data with Chinese entities"
- Set:
  - score = -999
  - triggered_geopolitical_risk = true

If this is **not detected**, set "triggered_geopolitical_risk = false" and calculate score normally.

---

### 📚 Case Matrix

#### Category: "privacy"
- 1: Data is collected only for core functionality
- 2: Data is sold to third parties
- 3: You can delete your account and data
- 4: Data is stored indefinitely
- 5: Service complies with GDPR/CCPA

#### Category: "transparency"
- 6: Policy is easy to understand
- 7: Changes to terms are clearly announced
- 8: Terms can change without notification

#### Category: "rights"
- 9: You can access and export your data
- 10: You retain ownership of your content
- 11: Service can remove your account without cause
- 12: Arbitration clause (you can't sue)

#### Category: "security"
- 13: Data is encrypted in transit and at rest
- 14: The service has a bug bounty program
- 15: Weak or no mention of data protection

#### Category: "geopolitical_risk"
- 16: Service stores or shares data with Chinese entities

---

### 📝 Final Rules

- "description" is required for each point and must explain **why** the rating was assigned
- Do **not** include a "grade" — the client will calculate that from score
- Do **not** invent new cases — only use those listed
- Do **not** return anything except valid JSON

`,
        },
        {
          role: "user",
          content: text,
        },
      ],
      temperature: 0.3,
    });
    const content = chatResponse.choices[0].message.content;
    const data = JSON.parse(content || "{}");
    return {
      isSuccess: true,
      message: "success",
      result: data as OpenAIAnalayzedResponse,
    };
  } catch (e) {
    console.error(e);
    return {
      isSuccess: false,
      message: "Error analyzing the content.",
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
        send({ success: true, data: { status: "fetching" } });
        const fetchingResult = await performFetching(url);
        if (!fetchingResult.isSuccess || !fetchingResult.result)
          throw new Error(fetchingResult.message);
        send({ success: true, data: { status: "analyzing" } });
        const analysisResult = await performAnalyzing(fetchingResult.result);
        if (!analysisResult.isSuccess || !analysisResult.result) {
          throw new Error(analysisResult.message);
        }
        const { score, triggered_geopolitical_risk, points } =
          analysisResult.result;

        const { data, error: createError } = await supabase
          .from("analytics")
          .insert({
            score,
            triggered_geopolitical_risk,
            user_id: userId,
            room_id: Number(roomId),
          })
          .select("id")
          .single();

        if (!data || createError) {
          throw new Error("Error analyzing the content.");
        }
        await supabase.from("analytic_points").insert(
          points.map((point) => ({
            analytic_id: data.id,
            category: point.category,
            rating: point.rating,
            importance: point.importance,
            case_id: point.case_id,
            description: point.description,
          }))
        );
        send({
          success: true,
          data: { status: "done", ...analysisResult.result },
        });
      } catch (e) {
        console.error(e);
        const message = e instanceof Error ? e.message : "Unknown";
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

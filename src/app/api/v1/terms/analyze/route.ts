import { CustomResponse } from "@/lib/response";
import { OpenAIValidationResponse } from "@/types/openai";
import * as cheerio from "cheerio";
import { NextRequest } from "next/server";
import OpenAI from "openai";
import puppeteer from "puppeteer";
import { request } from "undici";

type Response = {
  isSuccess: boolean;
  result?: string;
};

function convertHtmlToText(html: string) {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text;
}
async function getWebsiteTextWithPuppeteer(url: string): Promise<Response> {
  try {
    const browser = await puppeteer.launch({
      headless: true, // correct for Puppeteer 24.6.1
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: "networkidle0",
        timeout: 30000,
      });

      const html = await page.evaluate(() => document.body.innerHTML);
      const text = convertHtmlToText(html);

      return {
        isSuccess: true,
        result: text,
      };
    } catch (e) {
      console.error(e);
      return {
        isSuccess: false,
      };
    } finally {
      await browser.close();
    }
  } catch (e) {
    console.error("Puppeteer error:", e);
    return {
      isSuccess: false,
    };
  }
}

async function getWebsiteTextUndici(url: string): Promise<Response> {
  try {
    const { body, statusCode } = await request(url, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        Connection: "keep-alive",
      },
    });

    if (statusCode !== 200) {
      return {
        isSuccess: false,
      };
    }

    const html = await body.text();
    const text = convertHtmlToText(html);
    return {
      isSuccess: true,
      result: text,
    };
  } catch (e) {
    console.error("Undici error:", e);
    return {
      isSuccess: false,
    };
  }
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  if (!url) {
    return CustomResponse.error({
      message: "Missing URL",
      status: 400,
    });
  }

  //Extract text from the website
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
  if (!text)
    return CustomResponse.error({
      message:
        "We couldn't load the content from given URL. Please check the URL and try again.",
      status: 400,
    });

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
        content: text.slice(0, 2000), // don't overload it
      },
    ],
    temperature: 0,
  });
  const validationRaw = (validation.choices[0].message.content ??
    "{}") as unknown as OpenAIValidationResponse;
  const { language, isTermsOrPrivacy } = validationRaw;

  if (!["EN", "KO"].includes(language ?? "")) {
    return CustomResponse.error({
      message: "We currently only support English and Korean content.",
      status: 400,
    });
  }
  if (!isTermsOrPrivacy) {
    return CustomResponse.error({
      message:
        "This page does not appear to be a Terms of Service or Privacy Policy. Please provide a direct link to such a page.",
      status: 400,
    });
  }
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
- triggeredGeopoliticalRisk: true or false
- points: an array of objects, each representing one evaluated case, structured as:
  - category: one of "privacy", "transparency", "rights", "security", "geopolitical_risk"
  - caseId: number (see matrix below)
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
  - caseId: 16
  - rating: "bad"
  - importance: "critical"
  - description: "Service stores or shares data with Chinese entities"
- Set:
  - score = -999
  - triggeredGeopoliticalRisk = true

If this is **not detected**, set "triggeredGeopoliticalRisk = false" and calculate score normally.

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

    return CustomResponse.success({
      data,
    });
  } catch (err) {
    console.error(err);
    return CustomResponse.error({
      message: "Internal server error",
      status: 500,
    });
  }
}

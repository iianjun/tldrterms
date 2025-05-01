import { convertHtmlToText } from "@/utils/html-to-text";
import puppeteer from "puppeteer";
import { request } from "undici";

type Response = {
  isSuccess: boolean;
  result?: string;
};
export async function getWebsiteTextWithPuppeteer(
  url: string
): Promise<Response> {
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

export async function getWebsiteTextUndici(url: string): Promise<Response> {
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

export function normalizeUrl(url: string): string {
  if (!url) return "";
  let normalized = url.trim();

  if (/^http:\/\//i.test(normalized)) {
    normalized = normalized.replace(/^http:\/\//i, "https://");
  } else if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }
  try {
    const parsedUrl = new URL(normalized);
    const hostParts = parsedUrl.hostname.split(".");
    if (hostParts.length === 2) {
      parsedUrl.hostname = "www." + parsedUrl.hostname;
    }

    return parsedUrl.toString();
  } catch (e: any) {
    console.error(`Failed to parse URL '${url}':`, e);
    return url;
  }
}

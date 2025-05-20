import { convertHtmlToText } from "@/utils/html-to-text";
import chromium from "@sparticuz/chromium";
import playwright from "playwright-core";

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

export async function extractTextFromUrl(url: string): Promise<string> {
  const executablePath = await chromium.executablePath();
  const browser = await playwright.chromium.launch({
    headless: true,
    args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
    executablePath:
      process.env.NODE_ENV === "production" ? executablePath : undefined,
  });
  // Create a context with realistic browser fingerprint
  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.5790.171 Safari/537.36",
    locale: "en-US",
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();
  // Emulate typical headers
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });
  await page.goto(url);

  // Pause for 10 seconds, to see what's going on.
  await page.waitForTimeout(3000);
  const html = await page.content();
  const text = convertHtmlToText(html);

  // Turn off the browser to clean up after ourselves.
  await browser.close();
  return text;
}

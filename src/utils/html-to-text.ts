import * as cheerio from "cheerio";
export function convertHtmlToText(html: string) {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, noscript").remove();
  const text = $("body").text().replace(/\s+/g, " ").trim();
  return text;
}

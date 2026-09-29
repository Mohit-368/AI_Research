import * as cheerio from "cheerio";

export async function scrapePage(url, maxChars = 8000) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // 1. Remove obvious non-content clutter tags
  $("script, style, nav, footer, header, aside, form, iframe, noscript").remove();

  const title = $("title").text().trim();

  // 2. Target main content containers if they exist, otherwise fallback to body
  // Most modern websites wrap articles in <article>, main, or specific content divs
  let contentSelectors = $("article").length ? $("article") : $("main").length ? $("main") : $("body");

  // 3. Extract text, clean up excessive whitespaces and newlines
  let text = contentSelectors
    .text()
    .replace(/\s+/g, " ")
    .trim();

  // 4. Truncate text to protect Gemini's context window from massive web pages
  if (text.length > maxChars) {
    text = text.substring(0, maxChars) + "... [Truncated]";
  }

  return {
    url,
    title,
    text
  };
}


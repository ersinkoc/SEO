import { tokenizeWords, splitSentences } from "../nlp/tokenizer";
import { parseHtml } from "../parsers/html.parser";
import { parseStructuredDataFromHtml } from "../parsers/structured-data.parser";
import { parseUrl } from "../parsers/url.parser";
import type { AnalysisContext, SeoInput } from "../types";

export function buildContext(input: SeoInput): AnalysisContext {
  const html = parseHtml(input.content);
  const url = parseUrl(input.url);
  const structuredData =
    input.structuredData && input.structuredData.length > 0
      ? input.structuredData
      : parseStructuredDataFromHtml(input.content);
  const normalizedInput: SeoInput = {
    ...input,
    structuredData
  };
  const tokens = tokenizeWords(html.plainText);
  const sentenceCount = splitSentences(html.plainText).length;
  const titleLength = input.title.length;
  const linkMatches = input.content.match(/<a[^>]+href=["']([^"']+)["']/gi) ?? [];
  let internalLinkCount = 0;
  let externalLinkCount = 0;
  for (const link of linkMatches) {
    if (link.includes("href=\"/") || link.includes("href='/")) {
      internalLinkCount += 1;
    } else {
      externalLinkCount += 1;
    }
  }

  return {
    input: normalizedInput,
    parsed: {
      plainText: html.plainText,
      wordCount: tokens.length,
      sentenceCount,
      titleLength,
      headings: html.headings,
      imageCount: html.imageCount,
      internalLinkCount,
      externalLinkCount,
      hasCanonical: Boolean(input.meta?.canonical),
      hasRobots: Boolean(input.meta?.robots),
      ...url
    },
    tokens
  };
}

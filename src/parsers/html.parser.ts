import { extractPlainText } from "./text.extractor";

export function parseHtml(content: string): {
  plainText: string;
  headings: string[];
  imageCount: number;
  linkCount: number;
} {
  const plainText = extractPlainText(content);
  const headings: string[] = [];
  const headingRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  let match: RegExpExecArray | null = headingRegex.exec(content);
  while (match) {
    headings.push(extractPlainText(match[1] as string));
    match = headingRegex.exec(content);
  }
  const imageCount = (content.match(/<img\b/gi) ?? []).length;
  const linkCount = (content.match(/<a\b/gi) ?? []).length;
  return { plainText, headings, imageCount, linkCount };
}

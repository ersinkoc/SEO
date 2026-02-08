const TAG_PATTERN = /<[^>]+>/g;
const SPACE_PATTERN = /\s+/g;

export function extractPlainText(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ");
  return withoutScripts
    .replace(TAG_PATTERN, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(SPACE_PATTERN, " ")
    .trim();
}


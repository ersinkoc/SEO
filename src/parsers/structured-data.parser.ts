const SCRIPT_JSONLD =
  /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

export function parseStructuredDataFromHtml(
  html: string
): Array<Record<string, unknown>> {
  const items: Array<Record<string, unknown>> = [];
  let match = SCRIPT_JSONLD.exec(html);
  while (match) {
    const raw = String(match[1]).trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          for (const entry of parsed) {
            if (entry && typeof entry === "object") {
              items.push(entry as Record<string, unknown>);
            }
          }
        } else if (parsed && typeof parsed === "object") {
          items.push(parsed as Record<string, unknown>);
        }
      } catch {
        // ignore malformed JSON-LD blocks
      }
    }
    match = SCRIPT_JSONLD.exec(html);
  }
  return items;
}

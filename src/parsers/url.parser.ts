export function parseUrl(url: string): {
  isHttps: boolean;
  depth: number;
  hasQuery: boolean;
} {
  const parsed = new URL(url);
  const pathParts = parsed.pathname.split("/").filter(Boolean);
  return {
    isHttps: parsed.protocol === "https:",
    depth: pathParts.length,
    hasQuery: parsed.search.length > 0
  };
}


export function buildSystemPrompt(locale: "en" | "tr"): string {
  if (locale === "tr") {
    return "Turkce SEO degerlendirmesi yap. Yanit JSON olsun.";
  }
  return "You are an SEO evaluator. Return JSON only.";
}


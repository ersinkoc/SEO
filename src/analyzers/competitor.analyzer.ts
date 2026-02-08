import type { AnalysisContext, SeoSuggestion } from "../types";

export function analyzeCompetitorGap(context: AnalysisContext): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  const secondaryCount = context.input.secondaryKeywords?.length ?? 0;
  if (secondaryCount < 2) {
    suggestions.push({
      id: "competitor.secondary-keywords",
      category: "semantic",
      message:
        "Add more secondary keywords to improve competitor topic coverage.",
      priority: "medium"
    });
  }
  if (context.parsed.wordCount < 700) {
    suggestions.push({
      id: "competitor.content-depth",
      category: "content",
      message: "Increase content depth to compete with long-form pages.",
      priority: "high"
    });
  }
  return suggestions;
}


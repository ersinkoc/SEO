import type { AnalysisContext, SeoSuggestion } from "../types";

export function analyzeLinkStrategy(context: AnalysisContext): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  if (context.parsed.internalLinkCount < 2) {
    suggestions.push({
      id: "links.internal",
      category: "structure",
      message: "Add at least 2 internal links to related pages.",
      priority: "medium"
    });
  }
  if (context.parsed.externalLinkCount === 0) {
    suggestions.push({
      id: "links.external",
      category: "eeat",
      message: "Add at least one high-quality external reference.",
      priority: "low"
    });
  }
  return suggestions;
}


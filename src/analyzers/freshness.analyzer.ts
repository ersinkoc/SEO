import type { AnalysisContext, SeoSuggestion } from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

export function analyzeFreshness(context: AnalysisContext, now = Date.now()): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  const modified = context.input.meta?.modifiedDate;
  if (!modified) {
    suggestions.push({
      id: "freshness.modified-date",
      category: "eeat",
      message: "Set a modifiedDate to communicate freshness.",
      priority: "low"
    });
    return suggestions;
  }

  const timestamp = Date.parse(modified);
  if (Number.isNaN(timestamp)) {
    suggestions.push({
      id: "freshness.invalid-date",
      category: "technical",
      message: "Use ISO date format for modifiedDate.",
      priority: "low"
    });
    return suggestions;
  }

  const ageDays = Math.floor((now - timestamp) / DAY_MS);
  if (ageDays > 365) {
    suggestions.push({
      id: "freshness.update-content",
      category: "content",
      message: "Content appears stale. Refresh key sections and republish.",
      priority: "high"
    });
  }
  return suggestions;
}


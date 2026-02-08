import type { AnalysisContext, SeoSuggestion } from "../types";

export function analyzeSnippetOpportunity(context: AnalysisContext): SeoSuggestion[] {
  const suggestions: SeoSuggestion[] = [];
  const hasList = /<ul|<ol/i.test(context.input.content);
  const hasHowToHeading = context.parsed.headings.some((heading) =>
    /how|nedir|nasil|steps|guide/i.test(heading)
  );
  if (!hasList && hasHowToHeading) {
    suggestions.push({
      id: "snippet.add-list",
      category: "structure",
      message: "Add a concise bullet list for better featured snippet chance.",
      priority: "medium"
    });
  }
  if (context.parsed.sentenceCount > 0 && context.parsed.wordCount / context.parsed.sentenceCount > 25) {
    suggestions.push({
      id: "snippet.short-answer",
      category: "readability",
      message: "Add 40-60 word direct answer paragraph near the top.",
      priority: "medium"
    });
  }
  return suggestions;
}


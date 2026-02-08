import type { AnalysisContext } from "../../types";
import { competitorPrompt } from "../prompts/competitor.prompt";

export function createAiCompetitorTask(context: AnalysisContext) {
  const focusKeyword = context.input.focusKeyword ?? context.input.title;
  const competitorCount = Math.max(1, context.input.secondaryKeywords?.length ?? 1);
  return {
    id: "ai-competitor",
    prompt: competitorPrompt(focusKeyword, competitorCount),
    priority: "medium" as const
  };
}


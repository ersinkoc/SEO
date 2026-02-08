import type { AnalysisContext } from "../../types";
import { contentQualityPrompt } from "../prompts/content-quality.prompt";

export function createAiContentTask(context: AnalysisContext) {
  return {
    id: "ai-content-quality",
    prompt: contentQualityPrompt(context.input.title, context.parsed.wordCount),
    priority: "high" as const
  };
}


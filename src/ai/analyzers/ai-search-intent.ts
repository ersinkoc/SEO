import type { AnalysisContext } from "../../types";
import { searchIntentPrompt } from "../prompts/search-intent.prompt";

export function createAiSearchIntentTask(context: AnalysisContext) {
  return {
    id: "ai-search-intent",
    prompt: searchIntentPrompt(context.input.focusKeyword),
    priority: "high" as const
  };
}


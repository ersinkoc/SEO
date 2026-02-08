import type { AnalysisContext } from "../../types";
import { semanticPrompt } from "../prompts/semantic.prompt";

export function createAiSemanticTask(context: AnalysisContext) {
  return {
    id: "ai-semantic",
    prompt: semanticPrompt(context.input.focusKeyword),
    priority: "medium" as const
  };
}


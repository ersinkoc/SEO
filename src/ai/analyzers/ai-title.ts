import type { AnalysisContext } from "../../types";
import { titlePrompt } from "../prompts/title.prompt";

export function createAiTitleTask(context: AnalysisContext) {
  return {
    id: "ai-title",
    prompt: titlePrompt(context.input.title),
    priority: "high" as const
  };
}


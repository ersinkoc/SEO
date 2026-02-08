import type { AnalysisContext } from "../../types";
import { metaPrompt } from "../prompts/meta.prompt";

export function createAiMetaTask(context: AnalysisContext) {
  return {
    id: "ai-meta",
    prompt: metaPrompt(context.input.meta?.description),
    priority: "high" as const
  };
}


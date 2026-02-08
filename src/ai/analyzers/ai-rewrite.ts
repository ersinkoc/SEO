import type { AnalysisContext } from "../../types";
import { rewritePrompt } from "../prompts/rewrite.prompt";

export function createAiRewriteTask(context: AnalysisContext) {
  return {
    id: "ai-rewrite",
    prompt: rewritePrompt(context.input.title),
    priority: "low" as const
  };
}


import type { AnalysisContext } from "../../types";
import { snippetPrompt } from "../prompts/snippet.prompt";

export function createAiSnippetTask(context: AnalysisContext) {
  return {
    id: "ai-snippet",
    prompt: snippetPrompt(context.parsed.plainText.slice(0, 220)),
    priority: "medium" as const
  };
}


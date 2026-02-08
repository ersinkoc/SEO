import type { AnalysisContext } from "../../types";
import { tonePrompt } from "../prompts/tone.prompt";

export function createAiToneTask(context: AnalysisContext) {
  return {
    id: "ai-tone",
    prompt: tonePrompt("en"),
    priority: "medium" as const
  };
}


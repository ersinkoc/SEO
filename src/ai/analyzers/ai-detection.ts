import type { AnalysisContext } from "../../types";
import { aiDetectionPrompt } from "../prompts/ai-detection.prompt";

export function createAiDetectionTask(context: AnalysisContext) {
  return {
    id: "ai-detection",
    prompt: aiDetectionPrompt(context.parsed.plainText.slice(0, 220)),
    priority: "low" as const
  };
}


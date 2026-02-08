import type { AnalysisContext } from "../../types";
import { topicGapPrompt } from "../prompts/topic-gap.prompt";

export function createAiTopicGapTask(context: AnalysisContext) {
  const focusKeyword = context.input.focusKeyword ?? context.input.title;
  const knownTopics = context.input.secondaryKeywords ?? [];
  return {
    id: "ai-topic-gap",
    prompt: topicGapPrompt(focusKeyword, knownTopics),
    priority: "low" as const
  };
}


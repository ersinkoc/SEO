import type { AnalysisContext } from "../../types";
import { createAiContentTask } from "./ai-content-quality";
import { createAiDetectionTask } from "./ai-detection";
import { createAiCompetitorTask } from "./ai-competitor";
import { createAiMetaTask } from "./ai-meta";
import { createAiRewriteTask } from "./ai-rewrite";
import { createAiSearchIntentTask } from "./ai-search-intent";
import { createAiSemanticTask } from "./ai-semantic";
import { createAiSnippetTask } from "./ai-snippet";
import { createAiTitleTask } from "./ai-title";
import { createAiToneTask } from "./ai-tone";
import { createAiTopicGapTask } from "./ai-topic-gap";

export function createAiTasks(context: AnalysisContext) {
  return [
    createAiContentTask(context),
    createAiSearchIntentTask(context),
    createAiTitleTask(context),
    createAiMetaTask(context),
    createAiSemanticTask(context),
    createAiRewriteTask(context),
    createAiSnippetTask(context),
    createAiToneTask(context),
    createAiCompetitorTask(context),
    createAiTopicGapTask(context),
    createAiDetectionTask(context)
  ];
}

import type { AnalysisContext, AnalyzerConfig } from "../types";
import { orchestrateTasks } from "./orchestrator";
import { runAiEnhancement } from "./client";
import { createAiTasks } from "./analyzers";

export async function runAiSuite(
  config: NonNullable<AnalyzerConfig["ai"]>,
  context: AnalysisContext
): Promise<{ scoreDelta: number }> {
  const tasks = createAiTasks(context);
  const batches = orchestrateTasks(tasks, "priority");
  let total = 0;
  for (const batch of batches) {
    const mergedPrompt = batch.map((task) => task.prompt).join("\n");
    const response = await runAiEnhancement(config, {
      ...context,
      input: {
        ...context.input,
        title: `${context.input.title} :: ${batch.map((task) => task.id).join(",")}`,
        content: `${context.input.content}\n${mergedPrompt}`
      }
    });
    total += response.scoreDelta;
  }
  return { scoreDelta: Math.max(-20, Math.min(20, total)) };
}


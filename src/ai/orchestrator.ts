import { estimateTokens } from "./token-estimator";

export type AiTask = {
  id: string;
  prompt: string;
  priority?: "high" | "medium" | "low";
};

export type OrchestratorMode = "mega" | "grouped" | "priority";

export function orchestrateTasks(
  tasks: AiTask[],
  mode: OrchestratorMode
): Array<Array<AiTask>> {
  if (tasks.length === 0) {
    return [];
  }

  if (mode === "mega") {
    return [tasks];
  }

  if (mode === "priority") {
    const sorted = [...tasks].sort((a, b) => priorityValue(b) - priorityValue(a));
    return sorted.map((task) => [task]);
  }

  const groups: Array<Array<AiTask>> = [];
  let current: AiTask[] = [];
  let currentTokens = 0;
  for (const task of tasks) {
    const tokens = estimateTokens(task.prompt);
    if (current.length > 0 && currentTokens + tokens > 1500) {
      groups.push(current);
      current = [];
      currentTokens = 0;
    }
    current.push(task);
    currentTokens += tokens;
  }
  if (current.length > 0) {
    groups.push(current);
  }
  return groups;
}

function priorityValue(task: AiTask): number {
  if (task.priority === "high") return 3;
  if (task.priority === "medium") return 2;
  return 1;
}


export function mergeScores(
  ruleScore: number,
  aiDelta: number,
  ruleWeight = 0.7,
  aiWeight = 0.3
): number {
  const normalizedAiScore = Math.max(0, Math.min(100, ruleScore + aiDelta));
  return Math.max(
    0,
    Math.min(100, Math.round(ruleScore * ruleWeight + normalizedAiScore * aiWeight))
  );
}


export type TokenPricing = {
  inputPerMillion: number;
  outputPerMillion: number;
};

export function estimateAiCost(
  inputTokens: number,
  outputTokens: number,
  pricing: TokenPricing = { inputPerMillion: 0.15, outputPerMillion: 0.6 }
): number {
  const normalizedInput = Math.max(0, inputTokens);
  const normalizedOutput = Math.max(0, outputTokens);
  const inputCost = (normalizedInput / 1_000_000) * pricing.inputPerMillion;
  const outputCost = (normalizedOutput / 1_000_000) * pricing.outputPerMillion;
  return Number((inputCost + outputCost).toFixed(8));
}


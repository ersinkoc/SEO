export function estimateTokens(text: string): number {
  if (!text.trim()) {
    return 0;
  }
  return Math.ceil(text.length / 4);
}


const positive = ["good", "great", "excellent", "strong", "clear"];
const negative = ["bad", "poor", "weak", "unclear", "broken"];

export function sentimentScore(text: string): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of positive) {
    if (lower.includes(term)) score += 1;
  }
  for (const term of negative) {
    if (lower.includes(term)) score -= 1;
  }
  return score;
}


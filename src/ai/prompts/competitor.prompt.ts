export function competitorPrompt(focusKeyword: string, competitorCount: number): string {
  return `Evaluate competitor landscape for "${focusKeyword}" against ${competitorCount} competitors. Return {"scoreDelta": number}.`;
}


export function contentQualityPrompt(title: string, wordCount: number): string {
  return `Evaluate content quality for "${title}" with wordCount=${wordCount}. Return {"scoreDelta": number}.`;
}


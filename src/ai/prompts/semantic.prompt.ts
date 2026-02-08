export function semanticPrompt(focusKeyword?: string): string {
  return `Evaluate semantic relevance for keyword "${focusKeyword ?? ""}". Return {"scoreDelta": number}.`;
}


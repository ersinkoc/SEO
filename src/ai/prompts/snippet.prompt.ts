export function snippetPrompt(content: string): string {
  return `Evaluate featured snippet opportunity for content preview "${content}". Return {"scoreDelta": number}.`;
}


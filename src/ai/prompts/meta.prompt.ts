export function metaPrompt(description?: string): string {
  return `Evaluate meta description quality for "${description ?? ""}" including relevance and actionability. Return {"scoreDelta": number}.`;
}


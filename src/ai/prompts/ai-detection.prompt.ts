export function aiDetectionPrompt(content: string): string {
  return `Estimate whether content appears over-templated or machine-generated for text sample "${content}". Return {"scoreDelta": number}.`;
}


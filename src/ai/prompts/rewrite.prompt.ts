export function rewritePrompt(title: string): string {
  return `Suggest rewrite opportunities for "${title}". Return {"scoreDelta": number}.`;
}


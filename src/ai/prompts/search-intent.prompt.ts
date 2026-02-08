export function searchIntentPrompt(focusKeyword?: string): string {
  return `Classify search intent for keyword "${focusKeyword ?? ""}" as informational, navigational, transactional, or commercial. Return {"scoreDelta": number}.`;
}


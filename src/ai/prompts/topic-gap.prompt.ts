export function topicGapPrompt(focusKeyword: string, knownTopics: string[]): string {
  return `Find topic gaps for keyword "${focusKeyword}" with known topics [${knownTopics.join(", ")}]. Return {"scoreDelta": number}.`;
}


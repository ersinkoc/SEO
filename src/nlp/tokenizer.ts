export function tokenizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u00c0-\u024f]+/i)
    .filter(Boolean);
}

export function splitSentences(text: string): string[] {
  return text
    .split(/[.!?]+/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}


export function tokenizeSentences(text: string): string[] {
  return text
    .split(/[.!?]+/g)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

export function tokenizeWordsFromSentence(sentence: string): string[] {
  return sentence
    .toLowerCase()
    .split(/[^a-z0-9\u00c0-\u024f]+/i)
    .filter(Boolean);
}


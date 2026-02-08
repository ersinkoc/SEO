export function detectPassiveSentences(text: string): number {
  const sentences = text.split(/[.!?]+/g).map((item) => item.trim()).filter(Boolean);
  let count = 0;
  for (const sentence of sentences) {
    if (/\b(was|were|is|are|been|being)\s+\w+ed\b/i.test(sentence)) {
      count += 1;
    }
  }
  return count;
}


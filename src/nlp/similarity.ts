import { tokenizeWords } from "./tokenizer";

export function cosineSimilarity(a: string, b: string): number {
  const vecA = toVector(tokenizeWords(a));
  const vecB = toVector(tokenizeWords(b));
  const keys = new Set([...vecA.keys(), ...vecB.keys()]);

  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (const key of keys) {
    const av = vecA.get(key) ?? 0;
    const bv = vecB.get(key) ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }
  if (normA === 0 || normB === 0) {
    return 0;
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function toVector(tokens: string[]): Map<string, number> {
  const vector = new Map<string, number>();
  for (const token of tokens) {
    vector.set(token, (vector.get(token) ?? 0) + 1);
  }
  return vector;
}


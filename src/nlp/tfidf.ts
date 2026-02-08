import { getStopwords } from "./stopwords";
import { tokenizeWords } from "./tokenizer";

export type TfIdfTerm = { term: string; score: number };

export function calculateTfIdf(text: string, locale: "en" | "tr"): TfIdfTerm[] {
  const stopwords = getStopwords(locale);
  const docs = text
    .split(/\n+/g)
    .map((chunk) => tokenizeWords(chunk).filter((token) => !stopwords.has(token)))
    .filter((doc) => doc.length > 0);
  if (docs.length === 0) {
    return [];
  }

  const df = new Map<string, number>();
  for (const doc of docs) {
    const unique = new Set(doc);
    for (const term of unique) {
      df.set(term, (df.get(term) ?? 0) + 1);
    }
  }

  const scores = new Map<string, number>();
  for (const doc of docs) {
    const tf = new Map<string, number>();
    for (const term of doc) {
      tf.set(term, (tf.get(term) ?? 0) + 1);
    }
    for (const [term, count] of tf) {
      const idf = Math.log((1 + docs.length) / (1 + df.get(term)!)) + 1;
      scores.set(term, (scores.get(term) ?? 0) + (count / doc.length) * idf);
    }
  }

  return [...scores.entries()]
    .map(([term, score]) => ({ term, score }))
    .sort((a, b) => b.score - a.score);
}

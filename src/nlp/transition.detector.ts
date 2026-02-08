const transitions = [
  "however",
  "therefore",
  "moreover",
  "furthermore",
  "meanwhile",
  "bununla birlikte",
  "dolayisiyla"
];

export function countTransitionWords(text: string): number {
  const lower = text.toLowerCase();
  let count = 0;
  for (const term of transitions) {
    const hits = lower.match(new RegExp(`\\b${term}\\b`, "g")) ?? [];
    count += hits.length;
  }
  return count;
}


export function stemWord(word: string, locale: "en" | "tr"): string {
  const lower = word.toLowerCase();
  if (locale === "en") {
    return lower.replace(/(ing|ed|ly|s)$/i, "");
  }
  return lower.replace(/(lar|ler|lik|ci|ciği|daki|deki)$/i, "");
}


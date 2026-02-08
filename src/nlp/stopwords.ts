const EN = new Set(["the", "a", "an", "and", "or", "to", "for", "of", "in", "is"]);
const TR = new Set(["ve", "bir", "bu", "ile", "icin", "da", "de", "mi", "mu"]);

export function getStopwords(locale: "en" | "tr"): Set<string> {
  return locale === "tr" ? TR : EN;
}


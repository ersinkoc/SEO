export function tonePrompt(locale: "en" | "tr"): string {
  if (locale === "tr") {
    return 'Icerigin tonunu ve akiciligini Turkce acisindan degerlendir. Return {"scoreDelta": number}.';
  }
  return 'Evaluate content tone, consistency, and readability for English audiences. Return {"scoreDelta": number}.';
}


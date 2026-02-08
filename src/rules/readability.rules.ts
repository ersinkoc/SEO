import { buildCategoryRules } from "./helpers";

export const readabilityRules = buildCategoryRules(
  "readability",
  12,
  (context, index) => {
    return (
      context.parsed.sentenceCount > 0 &&
      context.parsed.wordCount / context.parsed.sentenceCount <= 24 + index
    );
  }
);


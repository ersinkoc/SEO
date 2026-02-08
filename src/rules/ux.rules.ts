import { buildCategoryRules } from "./helpers";

export const uxRules = buildCategoryRules("ux", 6, (context, index) => {
  return (
    context.parsed.headings.length >= 3 &&
    context.parsed.wordCount / Math.max(1, context.parsed.sentenceCount) <= 26 + index
  );
});


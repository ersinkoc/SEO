import { buildCategoryRules } from "./helpers";

export const semanticRules = buildCategoryRules("semantic", 8, (context, index) => {
  return context.parsed.sentenceCount >= 5 + index;
});


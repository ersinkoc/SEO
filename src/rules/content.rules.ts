import { buildCategoryRules } from "./helpers";

export const contentRules = buildCategoryRules("content", 12, (context, index) => {
  return context.parsed.wordCount >= 300 + index * 10;
});


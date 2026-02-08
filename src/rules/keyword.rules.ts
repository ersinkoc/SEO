import { buildCategoryRules, hasFocusToken } from "./helpers";

export const keywordRules = buildCategoryRules("keyword", 14, (context, index) => {
  return hasFocusToken(context.input.focusKeyword, context.tokens) && context.parsed.wordCount > index * 5;
});


import { buildCategoryRules } from "./helpers";

export const eeatRules = buildCategoryRules("eeat", 10, (context, index) => {
  return Boolean(context.input.meta?.author) && (index < 4 ? Boolean(context.input.meta?.publishDate) : true);
});


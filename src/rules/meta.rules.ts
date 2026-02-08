import { buildCategoryRules } from "./helpers";

export const metaRules = buildCategoryRules("meta", 15, (context, index) => {
  return (context.input.meta?.description?.length ?? 0) >= Math.max(40, 150 - index);
});


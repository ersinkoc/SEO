import { buildCategoryRules } from "./helpers";

export const technicalRules = buildCategoryRules("technical", 10, (context, index) => {
  return context.parsed.isHttps && (index > 5 ? context.parsed.depth <= 5 : true);
});


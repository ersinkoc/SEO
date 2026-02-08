import { buildCategoryRules } from "./helpers";

export const structuredDataRules = buildCategoryRules(
  "structuredData",
  8,
  (context, index) => {
    return (context.input.structuredData?.length ?? 0) >= (index < 3 ? 1 : 0);
  }
);


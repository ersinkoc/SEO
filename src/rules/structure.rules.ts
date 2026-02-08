import { buildCategoryRules } from "./helpers";

export const structureRules = buildCategoryRules("structure", 12, (context, index) => {
  return (
    context.parsed.headings.length >= 2 &&
    context.parsed.imageCount + context.parsed.internalLinkCount >= index / 2
  );
});


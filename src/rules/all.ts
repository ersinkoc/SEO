import type { RuleDefinition } from "../types";
import { contentRules } from "./content.rules";
import { eeatRules } from "./eeat.rules";
import { keywordRules } from "./keyword.rules";
import { metaRules } from "./meta.rules";
import { readabilityRules } from "./readability.rules";
import { semanticRules } from "./semantic.rules";
import { structureRules } from "./structure.rules";
import { structuredDataRules } from "./structured-data.rules";
import { technicalRules } from "./technical.rules";
import { uxRules } from "./ux.rules";

export function getBuiltInRules(): RuleDefinition[] {
  return [
    ...contentRules,
    ...metaRules,
    ...keywordRules,
    ...semanticRules,
    ...structureRules,
    ...readabilityRules,
    ...technicalRules,
    ...eeatRules,
    ...structuredDataRules,
    ...uxRules
  ];
}


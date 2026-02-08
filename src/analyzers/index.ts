import type { AnalysisContext, CategoryName, RuleDefinition, RuleResult } from "../types";
import { analyzeContent } from "./content.analyzer";
import { analyzeEeat } from "./eeat.analyzer";
import { analyzeKeyword } from "./keyword.analyzer";
import { analyzeMeta } from "./meta.analyzer";
import { analyzeReadability } from "./readability.analyzer";
import { analyzeSemantic } from "./semantic.analyzer";
import { analyzeStructure } from "./structure.analyzer";
import { analyzeStructuredData } from "./structured-data.analyzer";
import { analyzeTechnical } from "./technical.analyzer";
import { analyzeUx } from "./ux.analyzer";

type CategoryAnalyzer = (context: AnalysisContext, rules: RuleDefinition[]) => RuleResult[];

const analyzers: Record<CategoryName, CategoryAnalyzer> = {
  content: analyzeContent,
  meta: analyzeMeta,
  keyword: analyzeKeyword,
  semantic: analyzeSemantic,
  structure: analyzeStructure,
  readability: analyzeReadability,
  technical: analyzeTechnical,
  eeat: analyzeEeat,
  structuredData: analyzeStructuredData,
  ux: analyzeUx
};

export function analyzeByCategories(
  categories: CategoryName[],
  context: AnalysisContext,
  rules: RuleDefinition[]
): RuleResult[] {
  const results: RuleResult[] = [];
  for (const category of categories) {
    results.push(...analyzers[category](context, rules));
  }
  return results;
}


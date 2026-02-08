import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeStructuredData(
  context: AnalysisContext,
  rules: RuleDefinition[]
): RuleResult[] {
  return evaluateCategory("structuredData", context, rules);
}


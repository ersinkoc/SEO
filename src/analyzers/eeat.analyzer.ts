import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeEeat(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("eeat", context, rules);
}


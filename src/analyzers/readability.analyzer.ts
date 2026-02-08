import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeReadability(
  context: AnalysisContext,
  rules: RuleDefinition[]
): RuleResult[] {
  return evaluateCategory("readability", context, rules);
}


import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeTechnical(
  context: AnalysisContext,
  rules: RuleDefinition[]
): RuleResult[] {
  return evaluateCategory("technical", context, rules);
}


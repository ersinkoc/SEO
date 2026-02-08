import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeUx(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("ux", context, rules);
}


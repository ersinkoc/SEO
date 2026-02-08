import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeSemantic(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("semantic", context, rules);
}


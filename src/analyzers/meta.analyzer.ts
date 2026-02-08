import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeMeta(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("meta", context, rules);
}


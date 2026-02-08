import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeContent(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("content", context, rules);
}


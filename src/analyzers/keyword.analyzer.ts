import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeKeyword(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("keyword", context, rules);
}


import type { AnalysisContext, RuleDefinition, RuleResult } from "../types";
import { evaluateCategory } from "./helpers";

export function analyzeStructure(context: AnalysisContext, rules: RuleDefinition[]): RuleResult[] {
  return evaluateCategory("structure", context, rules);
}


import type { AnalysisContext, CategoryName, RuleDefinition, RuleResult } from "../types";

export function evaluateCategory(
  category: CategoryName,
  context: AnalysisContext,
  rules: RuleDefinition[]
): RuleResult[] {
  return rules
    .filter((rule) => rule.category === category)
    .map((rule) => {
      const evaluation = rule.evaluate(context);
      return {
        id: rule.id,
        category: rule.category,
        passed: evaluation.passed,
        score: evaluation.passed ? rule.weight : 0,
        maxScore: rule.weight,
        message: evaluation.message,
        suggestion: evaluation.suggestion
      };
    });
}


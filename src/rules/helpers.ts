import type { AnalysisContext, CategoryName, RuleDefinition } from "../types";

export function buildCategoryRules(
  category: CategoryName,
  count: number,
  check: (context: AnalysisContext, index: number) => boolean
): RuleDefinition[] {
  const rules: RuleDefinition[] = [];
  for (let index = 1; index <= count; index += 1) {
    const id = `${category}.rule.${index}`;
    rules.push({
      id,
      category,
      weight: 1,
      description: `Built-in ${category} rule ${index}`,
      evaluate(context) {
        const passed = check(context, index);
        return {
          passed,
          message: passed ? `${id} passed` : `${id} failed`,
          suggestion: passed
            ? undefined
            : `Improve ${category} quality for rule ${index}.`
        };
      }
    });
  }
  return rules;
}

export function hasFocusToken(
  keyword: string | undefined,
  tokens: string[]
): boolean {
  if (!keyword) return false;
  const focus = keyword.toLowerCase().split(" ").find(Boolean);
  if (!focus) return false;
  return tokens.includes(focus);
}


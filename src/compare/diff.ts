import type { SeoReport } from "../types";

export function diffReports(previous: SeoReport, next: SeoReport): {
  scoreDelta: number;
  gradeFrom: string;
  gradeTo: string;
  improvedRuleCount: number;
  regressedRuleCount: number;
} {
  const previousMap = new Map(previous.rules.map((rule) => [rule.id, rule]));
  let improvedRuleCount = 0;
  let regressedRuleCount = 0;
  for (const nextRule of next.rules) {
    const old = previousMap.get(nextRule.id);
    if (!old) continue;
    if (!old.passed && nextRule.passed) improvedRuleCount += 1;
    if (old.passed && !nextRule.passed) regressedRuleCount += 1;
  }
  return {
    scoreDelta: next.score - previous.score,
    gradeFrom: previous.grade,
    gradeTo: next.grade,
    improvedRuleCount,
    regressedRuleCount
  };
}


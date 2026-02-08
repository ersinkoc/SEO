import { getProfileWeights } from "../profiles";
import type {
  CategoryName,
  CategoryScore,
  ProfileName,
  RuleResult,
  SeoSuggestion
} from "../types";

const categories: CategoryName[] = [
  "content",
  "meta",
  "keyword",
  "semantic",
  "structure",
  "readability",
  "technical",
  "eeat",
  "structuredData",
  "ux"
];

export function gradeFromScore(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

export function scoreRules(
  profile: ProfileName,
  ruleResults: RuleResult[]
): { score: number; grade: string; categoryScores: Record<CategoryName, CategoryScore> } {
  const weights = getProfileWeights(profile);
  const categoryScores = {} as Record<CategoryName, CategoryScore>;

  for (const category of categories) {
    const scoped = ruleResults.filter((rule) => rule.category === category);
    const score = scoped.reduce((sum, rule) => sum + rule.score, 0);
    const maxScore = scoped.reduce((sum, rule) => sum + rule.maxScore, 0);
    categoryScores[category] = { score, maxScore };
  }

  let weightedScore = 0;
  let weightedMax = 0;
  for (const category of categories) {
    const c = categoryScores[category];
    const w = weights[category];
    weightedScore += c.score * w;
    weightedMax += c.maxScore * w;
  }

  const score = weightedMax === 0 ? 0 : Math.round((weightedScore / weightedMax) * 100);
  return {
    score,
    grade: gradeFromScore(score),
    categoryScores
  };
}

export function buildSuggestions(ruleResults: RuleResult[]): SeoSuggestion[] {
  return ruleResults
    .filter((rule) => !rule.passed)
    .slice(0, 12)
    .map((rule) => ({
      id: rule.id,
      category: rule.category,
      message: rule.suggestion ?? rule.message,
      priority: rule.maxScore >= 2 ? "high" : "medium"
    }));
}


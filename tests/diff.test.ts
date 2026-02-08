import { describe, expect, it } from "vitest";
import { diffReports } from "../src/compare/diff";
import type { SeoReport } from "../src/types";

describe("diffReports", () => {
  it("calculates deltas", () => {
    const previous = {
      score: 70,
      grade: "C-",
      categoryScores: {} as SeoReport["categoryScores"],
      rules: [
        { id: "a", category: "content", passed: false, score: 0, maxScore: 1, message: "x" },
        { id: "b", category: "meta", passed: true, score: 1, maxScore: 1, message: "y" }
      ],
      suggestions: [],
      mode: "rule-only"
    } as SeoReport;

    const next = {
      ...previous,
      score: 78,
      grade: "C+",
      rules: [
        { id: "a", category: "content", passed: true, score: 1, maxScore: 1, message: "x" },
        { id: "b", category: "meta", passed: false, score: 0, maxScore: 1, message: "y" },
        { id: "new", category: "ux", passed: true, score: 1, maxScore: 1, message: "z" }
      ]
    } as SeoReport;

    const diff = diffReports(previous, next);
    expect(diff.scoreDelta).toBe(8);
    expect(diff.improvedRuleCount).toBe(1);
    expect(diff.regressedRuleCount).toBe(1);
  });
});

import type { SeoReport } from "../types";

export function benchmarkReport(
  report: SeoReport,
  benchmarkScore = 75
): {
  benchmarkScore: number;
  score: number;
  status: "above" | "below" | "equal";
  gap: number;
} {
  const gap = report.score - benchmarkScore;
  return {
    benchmarkScore,
    score: report.score,
    status: gap > 0 ? "above" : gap < 0 ? "below" : "equal",
    gap
  };
}


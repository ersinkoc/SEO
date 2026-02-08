import type { SeoReport } from "../types";

export function analyzeTrend(reports: SeoReport[]): {
  averageScore: number;
  delta: number;
  direction: "up" | "down" | "flat";
} {
  if (reports.length === 0) {
    return { averageScore: 0, delta: 0, direction: "flat" };
  }
  const first = reports[0]?.score ?? 0;
  const last = reports[reports.length - 1]?.score ?? first;
  const averageScore = Math.round(
    reports.reduce((sum, report) => sum + report.score, 0) / reports.length
  );
  const delta = last - first;
  return {
    averageScore,
    delta,
    direction: delta > 0 ? "up" : delta < 0 ? "down" : "flat"
  };
}


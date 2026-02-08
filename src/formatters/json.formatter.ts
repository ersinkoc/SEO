import type { SeoReport } from "../types";

export function formatAsJson(report: SeoReport): string {
  return JSON.stringify(report, null, 2);
}


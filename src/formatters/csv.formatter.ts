import type { SeoReport } from "../types";

function quoteCsv(value: string | number): string {
  const stringified = String(value).replaceAll('"', '""');
  return `"${stringified}"`;
}

export function formatAsCsv(reports: SeoReport[]): string {
  const header = ["score", "grade", "mode", "suggestionCount"].map(quoteCsv).join(",");
  const rows = reports.map((report) =>
    [
      quoteCsv(report.score),
      quoteCsv(report.grade),
      quoteCsv(report.mode),
      quoteCsv(report.suggestions.length)
    ].join(",")
  );
  return [header, ...rows].join("\n");
}


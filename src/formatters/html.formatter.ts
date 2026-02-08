import type { SeoReport } from "../types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatAsHtml(report: SeoReport): string {
  const items = report.suggestions
    .map(
      (suggestion) =>
        `<li><strong>${escapeHtml(suggestion.priority)}</strong> - ${escapeHtml(
          suggestion.category
        )}: ${escapeHtml(suggestion.message)}</li>`
    )
    .join("");

  return [
    "<!doctype html>",
    "<html><head><meta charset=\"utf-8\"><title>SEO Report</title></head><body>",
    `<h1>SEO Report</h1><p>Score: ${report.score} | Grade: ${escapeHtml(
      report.grade
    )} | Mode: ${escapeHtml(report.mode)}</p>`,
    `<ul>${items || "<li>No suggestions.</li>"}</ul>`,
    "</body></html>"
  ].join("");
}


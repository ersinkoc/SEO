import type { SeoReport } from "../types";

export function formatAsMarkdown(report: SeoReport): string {
  const lines: string[] = [];
  lines.push("# SEO Report");
  lines.push("");
  lines.push(`- Score: **${report.score}**`);
  lines.push(`- Grade: **${report.grade}**`);
  lines.push(`- Mode: **${report.mode}**`);
  lines.push("");
  lines.push("## Suggestions");
  if (report.suggestions.length === 0) {
    lines.push("- No suggestions.");
  } else {
    for (const suggestion of report.suggestions) {
      lines.push(
        `- [${suggestion.priority}] (${suggestion.category}) ${suggestion.message}`
      );
    }
  }
  return lines.join("\n");
}


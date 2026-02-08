import { describe, expect, it } from "vitest";
import { analyzeTrend } from "../src/compare/trend";
import { benchmarkReport } from "../src/compare/benchmark";
import { formatAsCsv } from "../src/formatters/csv.formatter";
import { formatAsHtml } from "../src/formatters/html.formatter";
import { formatAsMarkdown } from "../src/formatters/markdown.formatter";
import type { SeoReport } from "../src/types";

function mockReport(score: number): SeoReport {
  return {
    score,
    grade: "B",
    categoryScores: {} as SeoReport["categoryScores"],
    rules: [],
    suggestions: [],
    mode: "rule-only"
  };
}

describe("trend, benchmark and formatter utils", () => {
  it("analyzes trend for empty/up/down/flat", () => {
    expect(analyzeTrend([]).direction).toBe("flat");
    expect(analyzeTrend([mockReport(70), mockReport(80)]).direction).toBe("up");
    expect(analyzeTrend([mockReport(80), mockReport(70)]).direction).toBe("down");
    expect(analyzeTrend([mockReport(80), mockReport(80)]).direction).toBe("flat");
  });

  it("covers trend fallback branches on sparse arrays", () => {
    const sparse = [] as unknown as SeoReport[];
    sparse[1] = mockReport(60);
    const trend = analyzeTrend(sparse);
    expect(trend.averageScore).toBe(30);
    expect(trend.delta).toBe(60);

    const sparseTail = new Array(1) as unknown as SeoReport[];
    const tailTrend = analyzeTrend(sparseTail);
    expect(tailTrend.averageScore).toBe(0);
    expect(tailTrend.delta).toBe(0);
  });

  it("benchmarks reports", () => {
    expect(benchmarkReport(mockReport(80), 75).status).toBe("above");
    expect(benchmarkReport(mockReport(70), 75).status).toBe("below");
    expect(benchmarkReport(mockReport(75), 75).status).toBe("equal");
  });

  it("formats markdown/html/csv", () => {
    const report = {
      ...mockReport(85),
      suggestions: [
        {
          id: "1",
          category: "content",
          message: "Improve heading",
          priority: "high"
        }
      ]
    } as SeoReport;

    const md = formatAsMarkdown(report);
    const html = formatAsHtml(report);
    const csv = formatAsCsv([report]);

    expect(md).toContain("## Suggestions");
    expect(html).toContain("<li><strong>high</strong>");
    expect(csv.split("\n").length).toBe(2);
  });

  it("formats with empty suggestions and escaping", () => {
    const report = {
      ...mockReport(60),
      grade: "<B&>",
      suggestions: [
        {
          id: "1",
          category: "meta",
          message: "<script>alert(1)</script>",
          priority: "low"
        }
      ]
    } as SeoReport;

    expect(formatAsHtml(report)).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(formatAsCsv([report])).toContain("\"<B&>\"");
  });

  it("covers empty formatter branches", () => {
    const report = mockReport(50);
    expect(formatAsHtml(report)).toContain("No suggestions.");
    expect(formatAsMarkdown(report)).toContain("- No suggestions.");
  });
});

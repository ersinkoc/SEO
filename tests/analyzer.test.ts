import { describe, expect, it, vi } from "vitest";
import { createSeoAnalyzer } from "../src";

describe("createSeoAnalyzer", () => {
  it("analyzes sync and returns 107 rules", () => {
    const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
    const report = analyzer.analyzeSync({
      url: "https://example.com/seo",
      title: "SEO Guide for 2026",
      content:
        "<article><h1>SEO Guide</h1><h2>Checklist</h2><h2>Examples</h2><p>" +
        "seo guide ".repeat(350) +
        "</p><img src='/img.png'/><a href='/internal'>in</a></article>",
      focusKeyword: "seo guide",
      meta: {
        description: "Complete seo guide and checklist for on-page quality.",
        canonical: "https://example.com/seo",
        robots: "index, follow",
        author: "Ersin",
        publishDate: "2026-02-01"
      },
      structuredData: [{ "@type": "Article" }]
    });

    expect(report.rules).toHaveLength(107);
    expect(report.score).toBeGreaterThan(0);
    expect(report.grade.length).toBeGreaterThan(0);
  });

  it("supports custom rules", () => {
    const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
    analyzer.addRule({
      id: "custom.meta.rule",
      category: "meta",
      weight: 2,
      description: "custom",
      evaluate: () => ({ passed: true, message: "ok" })
    });
    const report = analyzer.analyzeSync({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>test test test</p>"
    });
    expect(report.rules.some((rule) => rule.id === "custom.meta.rule")).toBe(true);
  });

  it("supports async analyze with AI merge", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "{\"scoreDelta\":10}" } }]
        })
      }))
    );
    const analyzer = createSeoAnalyzer({
      locale: "en",
      profile: "blog",
      ai: {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      }
    });
    const report = await analyzer.analyze({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>" + "text ".repeat(500) + "</p>"
    });
    expect(report.mode).toBe("hybrid");
  });

  it("throws for missing input", () => {
    const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
    expect(() =>
      analyzer.analyzeSync({ url: "", title: "x", content: "y" })
    ).toThrow();
  });

  it("exposes format/getRules/use APIs", async () => {
    const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
    analyzer.use({
      name: "test",
      afterAnalyze(report) {
        return {
          ...report,
          score: report.score + 1
        };
      }
    });
    const report = analyzer.analyzeSync({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>text text text</p>"
    });
    expect(report.score).toBeGreaterThanOrEqual(1);
    expect(analyzer.getRules().length).toBeGreaterThanOrEqual(107);
    expect(analyzer.format(report).includes("\"score\"")).toBe(true);

    const asyncReport = await analyzer.analyze({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>text text text</p>"
    });
    expect(asyncReport.mode).toBe("rule-only");
  });

  it("supports depth and enabled category filters", () => {
    const analyzerQuick = createSeoAnalyzer({
      locale: "en",
      profile: "blog",
      depth: "quick"
    });
    const categoriesQuick = new Set(analyzerQuick.getRules().map((rule) => rule.category));
    expect(categoriesQuick.has("content")).toBe(true);
    expect(categoriesQuick.has("meta")).toBe(true);
    expect(categoriesQuick.has("semantic")).toBe(false);

    const analyzerFiltered = createSeoAnalyzer({
      locale: "en",
      profile: "blog",
      depth: "full",
      enabledCategories: ["meta"]
    });
    const categoriesFiltered = new Set(
      analyzerFiltered.getRules().map((rule) => rule.category)
    );
    expect(categoriesFiltered.size).toBe(1);
    expect(categoriesFiltered.has("meta")).toBe(true);
  });

  it("supports batch methods and format variants", async () => {
    const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
    const inputs = [
      { url: "https://example.com/a", title: "A", content: "<h1>A</h1><p>a</p>" },
      { url: "https://example.com/b", title: "B", content: "<h1>B</h1><p>b</p>" }
    ];
    const syncReports = analyzer.analyzeBatchSync(inputs);
    const asyncReports = await analyzer.analyzeBatch(inputs);
    expect(syncReports.length).toBe(2);
    expect(asyncReports.length).toBe(2);
    expect(analyzer.formatMarkdown(syncReports[0]!)).toContain("# SEO Report");
    expect(analyzer.formatHtml(syncReports[0]!)).toContain("<!doctype html>");
    expect(analyzer.formatCsv(syncReports)).toContain("\"score\"");
  });
});

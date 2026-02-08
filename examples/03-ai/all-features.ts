import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  ai: {
    enabled: true,
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: "gpt-4o-mini",
    timeoutMs: 20000
  }
});

async function main() {
  const report = await analyzer.analyze({
    url: "https://example.com/seo-guide",
    title: "Complete SEO Guide for 2026",
    content: "<article><h1>SEO Guide</h1><p>...</p></article>",
    focusKeyword: "seo guide",
    secondaryKeywords: ["on-page seo", "content optimization"],
    meta: { description: "A practical SEO guide." }
  });
  console.log(report.mode, report.score, report.grade);
}

void main();


import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "documentation",
  depth: "full",
  enabledCategories: ["content", "semantic", "structure", "readability"]
});

const report = analyzer.analyzeSync({
  url: "https://example.com/docs/sdk",
  title: "SDK Integration Guide",
  content: "<article><h1>SDK Integration</h1><p>...</p></article>",
  focusKeyword: "sdk integration"
});

console.log(report.categoryScores);


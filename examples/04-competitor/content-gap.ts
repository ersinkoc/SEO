import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
const report = analyzer.analyzeSync({
  url: "https://example.com/gap",
  title: "Gap analysis",
  content: "<h1>Gap</h1><h2>Topic A</h2><p>...</p>"
});
console.log(report.suggestions);


import { createSeoAnalyzer, diffReports } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
const first = analyzer.analyzeSync({
  url: "https://example.com",
  title: "First",
  content: "<h1>First</h1><p>small</p>"
});
const second = analyzer.analyzeSync({
  url: "https://example.com",
  title: "Second",
  content: "<h1>Second</h1><p>small small small small</p>"
});
console.log(diffReports(first, second));


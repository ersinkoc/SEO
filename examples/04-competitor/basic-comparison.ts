import { createSeoAnalyzer, diffReports } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
const a = analyzer.analyzeSync({
  url: "https://a.example.com",
  title: "A",
  content: "<h1>A</h1><p>text</p>"
});
const b = analyzer.analyzeSync({
  url: "https://b.example.com",
  title: "B",
  content: "<h1>B</h1><p>text text text text text</p>"
});
console.log(diffReports(a, b));


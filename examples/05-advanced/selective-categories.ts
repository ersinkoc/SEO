import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "documentation" });
const report = analyzer.analyzeSync({
  url: "https://example.com/docs",
  title: "Docs page",
  content: "<h1>Docs</h1><h2>Section</h2><p>guide guide guide</p>"
});
console.log(report.categoryScores.structure, report.categoryScores.readability);


import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
const inputs = [
  { url: "https://example.com/a", title: "A", content: "<h1>A</h1><p>a</p>" },
  { url: "https://example.com/b", title: "B", content: "<h1>B</h1><p>b</p>" }
];
const reports = inputs.map((input) => analyzer.analyzeSync(input));
console.log(reports.map((report) => report.score));


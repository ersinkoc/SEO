import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "tr", profile: "blog" });
const report = analyzer.analyzeSync({
  url: "https://example.com/hizli",
  title: "Hizli SEO Tarama",
  content: "<h1>Hizli SEO Tarama</h1><p>icerik</p>"
});
console.log(report.score, report.grade);


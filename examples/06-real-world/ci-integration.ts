import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
const report = analyzer.analyzeSync({
  url: "https://example.com/release-note",
  title: "Release Note",
  content: "<h1>Release Note</h1><p>content</p>"
});

if (report.score < 70) {
  process.exitCode = 1;
}


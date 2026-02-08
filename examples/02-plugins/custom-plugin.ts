import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
analyzer.use({
  name: "mark-high-score",
  afterAnalyze(report) {
    if (report.score > 90) {
      report.suggestions.unshift({
        id: "plugin.note",
        category: "content",
        message: "Strong performance.",
        priority: "low"
      });
    }
    return report;
  }
});


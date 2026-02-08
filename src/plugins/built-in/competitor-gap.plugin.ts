import type { SeoPlugin } from "../../types";

export function createCompetitorGapPlugin(): SeoPlugin {
  return {
    name: "competitor-gap",
    afterAnalyze(report) {
      if (report.score >= 85) {
        return report;
      }
      return {
        ...report,
        suggestions: [
          ...report.suggestions,
          {
            id: "plugin.competitor-gap.run-analysis",
            category: "semantic",
            message: "Run competitor gap analysis to identify missing subtopics.",
            priority: "medium"
          }
        ]
      };
    }
  };
}


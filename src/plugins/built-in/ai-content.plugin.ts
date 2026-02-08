import type { SeoPlugin } from "../../types";

export function createAiContentPlugin(): SeoPlugin {
  return {
    name: "ai-content",
    afterAnalyze(report) {
      if (report.mode === "hybrid") {
        return report;
      }
      return {
        ...report,
        suggestions: [
          {
            id: "plugin.ai-content.enable-ai",
            category: "content",
            message: "Enable AI mode for deeper semantic and rewrite suggestions.",
            priority: "low"
          },
          ...report.suggestions
        ]
      };
    }
  };
}


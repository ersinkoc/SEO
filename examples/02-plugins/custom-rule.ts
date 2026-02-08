import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
analyzer.addRule({
  id: "custom.content.length",
  category: "content",
  weight: 2,
  description: "Require long content",
  evaluate: (context) => ({
    passed: context.parsed.wordCount >= 500,
    message: "Custom length check"
  })
});


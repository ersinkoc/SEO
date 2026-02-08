import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
analyzer.addRule({
  id: "override.ux.neutral",
  category: "ux",
  weight: 0,
  description: "Neutralize UX weight",
  evaluate: () => ({ passed: true, message: "disabled" })
});


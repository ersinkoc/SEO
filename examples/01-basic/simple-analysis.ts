import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
console.log(
  analyzer.analyzeSync({
    url: "https://example.com",
    title: "Simple SEO analysis",
    content: "<h1>Simple SEO analysis</h1><p>content content content</p>"
  })
);


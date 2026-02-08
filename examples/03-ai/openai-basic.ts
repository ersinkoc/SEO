import { createSeoAnalyzer } from "../../src";

const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  ai: {
    enabled: true,
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: "gpt-4o-mini"
  }
});

void analyzer.analyze({
  url: "https://example.com",
  title: "AI test",
  content: "<h1>AI test</h1><p>content content content</p>"
});


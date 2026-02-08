import { createSeoAnalyzer } from "../../src";

createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  ai: {
    enabled: true,
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY ?? "",
    model: "openai/gpt-4o-mini"
  }
});


import { createSeoAnalyzer } from "../../src";

createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  ai: {
    enabled: true,
    baseUrl: "http://localhost:11434/v1",
    apiKey: "ollama",
    model: "llama3.1"
  }
});


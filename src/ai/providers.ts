import type { AnalyzerConfig } from "../types";

type AiConfig = NonNullable<AnalyzerConfig["ai"]>;

function withDefaults(config: Partial<AiConfig>): AiConfig {
  return {
    enabled: config.enabled ?? true,
    baseUrl: config.baseUrl ?? "",
    apiKey: config.apiKey ?? "",
    model: config.model ?? "gpt-4o-mini",
    timeoutMs: config.timeoutMs ?? 15000,
    ruleWeight: config.ruleWeight ?? 0.7,
    aiWeight: config.aiWeight ?? 0.3
  };
}

export const providerPresets = {
  openai(apiKey: string, model = "gpt-4o-mini"): AiConfig {
    return withDefaults({ baseUrl: "https://api.openai.com/v1", apiKey, model });
  },
  ollama(baseUrl: string, model = "llama3.1"): AiConfig {
    return withDefaults({ baseUrl, apiKey: "ollama", model });
  },
  openrouter(apiKey: string, model = "openai/gpt-4o-mini"): AiConfig {
    return withDefaults({ baseUrl: "https://openrouter.ai/api/v1", apiKey, model });
  },
  custom(config: Partial<AiConfig>): AiConfig {
    return withDefaults(config);
  }
};


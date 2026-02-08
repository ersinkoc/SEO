import type { AnalysisContext, AnalyzerConfig } from "../types";
import { LruCache } from "./cache";
import { RateLimiter } from "./rate-limiter";
import { withRetry } from "./retry";

interface AiResponse {
  scoreDelta: number;
}

type AiRuntimeOptions = {
  cache?: LruCache<string, AiResponse>;
  limiter?: RateLimiter;
  retries?: number;
};

const defaultCache = new LruCache<string, AiResponse>(200);
const defaultLimiter = new RateLimiter(60, 60_000);

export async function runAiEnhancement(
  config: AnalyzerConfig["ai"],
  context: AnalysisContext,
  options?: AiRuntimeOptions
): Promise<AiResponse> {
  if (!config?.enabled) {
    return { scoreDelta: 0 };
  }
  const limiter = options?.limiter ?? defaultLimiter;
  if (!limiter.allow()) {
    return { scoreDelta: 0 };
  }

  const cache = options?.cache ?? defaultCache;
  const cacheKey = `${config.model}:${context.input.title}:${context.parsed.wordCount}:${context.input.focusKeyword ?? ""}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs ?? 15000);
  try {
    const response = await withRetry(
      async () =>
        fetch(`${config.baseUrl}/chat/completions`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${config.apiKey}`
          },
          body: JSON.stringify({
            model: config.model,
            messages: [
              { role: "system", content: "You are an SEO scorer. Return only JSON." },
              {
                role: "user",
                content: JSON.stringify({
                  title: context.input.title,
                  wordCount: context.parsed.wordCount,
                  focusKeyword: context.input.focusKeyword
                })
              }
            ],
            temperature: 0
          })
        }),
      options?.retries ?? 1
    );

    if (!response.ok) {
      clearTimeout(timeoutId);
      return { scoreDelta: 0 };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = readContent(payload);
    const parsed = safeParseScore(content);
    clearTimeout(timeoutId);
    const computed = {
      scoreDelta: clamp(parsed.scoreDelta ?? 0, -20, 20)
    };
    cache.set(cacheKey, computed);
    return computed;
  } catch {
    clearTimeout(timeoutId);
    return { scoreDelta: 0 };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function readContent(payload: {
  choices?: Array<{ message?: { content?: string } }>;
}): string {
  if (!Array.isArray(payload.choices) || payload.choices.length === 0) {
    return "{}";
  }
  const first = payload.choices[0];
  const content = first?.message?.content;
  return typeof content === "string" ? content : "{}";
}

function safeParseScore(content: string): { scoreDelta?: number } {
  try {
    return JSON.parse(content) as { scoreDelta?: number };
  } catch {
    return {};
  }
}

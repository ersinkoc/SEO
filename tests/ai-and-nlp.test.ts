import { describe, expect, it } from "vitest";
import { LruCache } from "../src/ai/cache";
import { orchestrateTasks } from "../src/ai/orchestrator";
import { providerPresets } from "../src/ai/providers";
import { RateLimiter } from "../src/ai/rate-limiter";
import { withRetry } from "../src/ai/retry";
import { estimateTokens } from "../src/ai/token-estimator";
import { extractEntities } from "../src/nlp/entity.extractor";
import { detectPassiveSentences } from "../src/nlp/passive.detector";
import { sentimentScore } from "../src/nlp/sentiment";
import { cosineSimilarity } from "../src/nlp/similarity";
import { countSyllables } from "../src/nlp/syllable.counter";
import { stemWord } from "../src/nlp/stemmer";
import { getStopwords } from "../src/nlp/stopwords";
import { calculateTfIdf } from "../src/nlp/tfidf";
import { countTransitionWords } from "../src/nlp/transition.detector";

describe("ai utilities", () => {
  it("creates provider presets", () => {
    const openai = providerPresets.openai("k");
    expect(openai.baseUrl).toContain("openai.com");
    const ollama = providerPresets.ollama("http://localhost:11434/v1");
    expect(ollama.apiKey).toBe("ollama");
    const openrouter = providerPresets.openrouter("k");
    expect(openrouter.baseUrl).toContain("openrouter.ai");
    const custom = providerPresets.custom({ baseUrl: "x", apiKey: "y", model: "z" });
    expect(custom.timeoutMs).toBe(15000);
    const defaults = providerPresets.custom({});
    expect(defaults.enabled).toBe(true);
    expect(defaults.baseUrl).toBe("");
  });

  it("supports lru cache behavior", () => {
    const cache = new LruCache<string, number>(2);
    expect(cache.get("a")).toBeUndefined();
    cache.set("a", 1);
    cache.set("b", 2);
    expect(cache.get("a")).toBe(1);
    cache.set("a", 10);
    expect(cache.get("a")).toBe(10);
    cache.set("c", 3);
    expect(cache.get("b")).toBeUndefined();
    expect(cache.size()).toBe(2);
  });

  it("supports retry success and failure", async () => {
    let attempts = 0;
    const ok = await withRetry(async () => {
      attempts += 1;
      if (attempts < 2) throw new Error("x");
      return 7;
    }, 2, 1);
    expect(ok).toBe(7);

    await expect(
      withRetry(async () => {
        throw new Error("fail");
      }, 1, 1)
    ).rejects.toThrow("fail");
  });

  it("supports rate limiter windows", () => {
    const limiter = new RateLimiter(2, 100);
    expect(limiter.allow(0)).toBe(true);
    expect(limiter.allow(1)).toBe(true);
    expect(limiter.allow(2)).toBe(false);
    expect(limiter.allow(200)).toBe(true);
  });

  it("estimates tokens and orchestrates tasks", () => {
    expect(estimateTokens("")).toBe(0);
    expect(estimateTokens("1234")).toBe(1);

    const tasks = [
      { id: "a", prompt: "x", priority: "low" as const },
      { id: "b", prompt: "x", priority: "high" as const },
      { id: "c", prompt: "x".repeat(8000), priority: "medium" as const }
    ];
    expect(orchestrateTasks([], "mega")).toEqual([]);
    expect(orchestrateTasks(tasks, "mega")).toHaveLength(1);
    const priority = orchestrateTasks(tasks, "priority");
    expect(priority[0]?.[0]?.id).toBe("b");
    const grouped = orchestrateTasks(tasks, "grouped");
    expect(grouped.length).toBeGreaterThan(1);
  });
});

describe("nlp utilities", () => {
  it("supports stopwords and stemming", () => {
    expect(getStopwords("en").has("the")).toBe(true);
    expect(getStopwords("tr").has("ve")).toBe(true);
    expect(stemWord("running", "en")).toBe("runn");
    expect(stemWord("kitaplar", "tr")).toBe("kitap");
  });

  it("computes tfidf and similarity", () => {
    const terms = calculateTfIdf("seo content\nseo score", "en");
    expect(terms.length).toBeGreaterThan(0);
    expect(calculateTfIdf("", "en")).toEqual([]);

    expect(cosineSimilarity("a b c", "a b c")).toBeCloseTo(1, 6);
    expect(cosineSimilarity("", "a")).toBe(0);
    expect(cosineSimilarity("a", "")).toBe(0);
    expect(cosineSimilarity("a", "b")).toBe(0);
  });

  it("extracts entities and text signals", () => {
    const entities = extractEntities("John at OpenAI Inc on 2026-02-07 has 10 tasks");
    expect(entities.some((entity) => entity.type === "date")).toBe(true);
    expect(entities.some((entity) => entity.type === "number")).toBe(true);
    expect(entities.some((entity) => entity.type === "organization")).toBe(true);
    expect(extractEntities("")).toEqual([]);

    expect(countSyllables("reading")).toBeGreaterThanOrEqual(1);
    expect(countSyllables("")).toBe(0);
    expect(countSyllables("brrr")).toBe(1);

    expect(detectPassiveSentences("The report was generated. We write code.")).toBe(1);
    expect(countTransitionWords("However, this is better. therefore good.")).toBe(2);
    expect(sentimentScore("great and excellent but also weak")).toBe(1);
  });
});

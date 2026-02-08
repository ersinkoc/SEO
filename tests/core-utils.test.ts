import { afterEach, describe, expect, it, vi } from "vitest";
import { LruCache } from "../src/ai/cache";
import { runAiEnhancement } from "../src/ai/client";
import { RateLimiter } from "../src/ai/rate-limiter";
import { mergeScores } from "../src/ai/score-merger";
import { buildContext } from "../src/core/context";
import { buildSuggestions, gradeFromScore, scoreRules } from "../src/core/scorer";
import { InvalidInputError, SeoError } from "../src/errors";
import { formatAsJson } from "../src/formatters/json.formatter";
import { Kernel } from "../src/kernel";
import { getGradeLabel } from "../src/locales";
import { getProfileWeights } from "../src/profiles";

function aiOptions() {
  return {
    cache: new LruCache<string, { scoreDelta: number }>(20),
    limiter: new RateLimiter(100, 60_000)
  };
}

describe("core utilities", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("builds context with internal and external links", () => {
    const context = buildContext({
      url: "https://example.com/a/b?q=1",
      title: "x",
      content:
        "<h1>A</h1><p>hello world</p><a href='/in'>in</a><a href='https://x.com'>out</a>",
      meta: { canonical: "https://example.com/a/b", robots: "index,follow" }
    });
    expect(context.parsed.internalLinkCount).toBe(1);
    expect(context.parsed.externalLinkCount).toBe(1);
    expect(context.parsed.hasCanonical).toBe(true);
    expect(context.parsed.hasRobots).toBe(true);
    expect(context.parsed.isHttps).toBe(true);
    expect(context.parsed.depth).toBe(2);
    expect(context.parsed.hasQuery).toBe(true);
  });

  it("covers grade mapping", () => {
    expect(gradeFromScore(97)).toBe("A+");
    expect(gradeFromScore(93)).toBe("A");
    expect(gradeFromScore(90)).toBe("A-");
    expect(gradeFromScore(87)).toBe("B+");
    expect(gradeFromScore(83)).toBe("B");
    expect(gradeFromScore(80)).toBe("B-");
    expect(gradeFromScore(77)).toBe("C+");
    expect(gradeFromScore(73)).toBe("C");
    expect(gradeFromScore(70)).toBe("C-");
    expect(gradeFromScore(67)).toBe("D+");
    expect(gradeFromScore(63)).toBe("D");
    expect(gradeFromScore(60)).toBe("D-");
    expect(gradeFromScore(59)).toBe("F");
  });

  it("scores and builds suggestions", () => {
    const result = scoreRules("blog", [
      { id: "a", category: "content", passed: true, score: 1, maxScore: 1, message: "ok" },
      { id: "b", category: "meta", passed: false, score: 0, maxScore: 1, message: "bad", suggestion: "fix" }
    ]);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.grade.length).toBeGreaterThan(0);
    const suggestions = buildSuggestions([
      { id: "x", category: "meta", passed: false, score: 0, maxScore: 1, message: "x" },
      { id: "y", category: "content", passed: false, score: 0, maxScore: 2, message: "y" }
    ]);
    expect(suggestions[0]?.priority).toBe("medium");
    expect(suggestions[1]?.priority).toBe("high");
  });

  it("handles zero rules", () => {
    const result = scoreRules("blog", []);
    expect(result.score).toBe(0);
    expect(result.grade).toBe("F");
  });

  it("covers kernel hooks", () => {
    const kernel = new Kernel();
    const before = vi.fn();
    kernel.use({
      name: "p",
      beforeAnalyze: before,
      afterAnalyze: (report) => ({ ...report, score: 99 })
    });
    kernel.use({ name: "p2" });

    const report = kernel.afterAnalyze({
      score: 50,
      grade: "C",
      categoryScores: {} as never,
      rules: [],
      suggestions: [],
      mode: "rule-only"
    });
    kernel.beforeAnalyze({ url: "https://a", title: "t", content: "<p>x</p>" });
    expect(before).toHaveBeenCalledTimes(1);
    expect(report.score).toBe(99);
  });

  it("covers error classes", () => {
    const base = new SeoError("X", "m");
    expect(base.code).toBe("X");
    const invalid = new InvalidInputError("bad");
    expect(invalid.name).toBe("InvalidInputError");
  });

  it("formats json and locale labels", () => {
    const json = formatAsJson({
      score: 10,
      grade: "F",
      categoryScores: {} as never,
      rules: [],
      suggestions: [],
      mode: "rule-only"
    });
    expect(json.includes('"score": 10')).toBe(true);
    expect(getGradeLabel("en", "A+")).toBe("Excellent");
    expect(getGradeLabel("tr", "B")).toBe("Iyi");
    expect(getGradeLabel("en", "Z")).toBe("Z");
  });

  it("returns fallback profile weights", () => {
    const fallback = getProfileWeights("unknown" as never);
    expect(fallback.content).toBe(1);
  });

  it("merges scores with bounds", () => {
    expect(mergeScores(80, 10, 0.7, 0.3)).toBe(83);
    expect(mergeScores(10, -50, 0.7, 0.3)).toBe(7);
    expect(mergeScores(95, 30, 0.7, 0.3)).toBeLessThanOrEqual(100);
  });

  it("covers ai client happy path", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "{\"scoreDelta\":30}" } }]
      })
    }));
    vi.stubGlobal(
      "fetch",
      fetchMock
    );
    const cache = new LruCache<string, { scoreDelta: number }>(10);
    const limiter = new RateLimiter(10, 1_000);
    const ctx = buildContext({
      url: "https://example.com",
      title: "x",
      content: "<p>hello world</p>"
    });
    const result = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      ctx,
      { cache, limiter }
    );
    expect(result.scoreDelta).toBe(20);

    const cached = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      ctx,
      { cache, limiter }
    );
    expect(cached.scoreDelta).toBe(20);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("covers ai client non-ok and catch", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: false,
        json: async () => ({})
      }))
    );
    const nonOk = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(nonOk.scoreDelta).toBe(0);

    vi.stubGlobal("fetch", vi.fn(async () => {
      throw new Error("fail");
    }));
    const failed = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m",
        timeoutMs: 1
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(failed.scoreDelta).toBe(0);
  });

  it("covers ai response defaults and lower clamp", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "{\"scoreDelta\":-30}" } }]
        })
      }))
    );
    const low = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(low.scoreDelta).toBe(-20);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({})
      }))
    );
    const defaults = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(defaults.scoreDelta).toBe(0);

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ choices: [{}] })
      }))
    );
    const missingMessage = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(missingMessage.scoreDelta).toBe(0);
  });

  it("covers ai parse error catch path", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({
          choices: [{ message: { content: "not-json" } }]
        })
      }))
    );
    const result = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      aiOptions()
    );
    expect(result.scoreDelta).toBe(0);
  });

  it("covers ai disabled shortcut", async () => {
    const result = await runAiEnhancement(
      undefined,
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      })
    );
    expect(result.scoreDelta).toBe(0);
  });

  it("covers ai limiter block", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: "{\"scoreDelta\":5}" } }] })
      }))
    );
    const limiter = new RateLimiter(0, 1_000);
    const result = await runAiEnhancement(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      buildContext({
        url: "https://example.com",
        title: "x",
        content: "<p>hello world</p>"
      }),
      { limiter }
    );
    expect(result.scoreDelta).toBe(0);
  });
});

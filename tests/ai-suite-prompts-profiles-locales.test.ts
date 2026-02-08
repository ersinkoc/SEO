import { describe, expect, it, vi } from "vitest";
import { createAiCompetitorTask } from "../src/ai/analyzers/ai-competitor";
import { createAiContentTask } from "../src/ai/analyzers/ai-content-quality";
import { createAiDetectionTask } from "../src/ai/analyzers/ai-detection";
import { createAiMetaTask } from "../src/ai/analyzers/ai-meta";
import { createAiRewriteTask } from "../src/ai/analyzers/ai-rewrite";
import { createAiSearchIntentTask } from "../src/ai/analyzers/ai-search-intent";
import { createAiSemanticTask } from "../src/ai/analyzers/ai-semantic";
import { createAiSnippetTask } from "../src/ai/analyzers/ai-snippet";
import { createAiTitleTask } from "../src/ai/analyzers/ai-title";
import { createAiToneTask } from "../src/ai/analyzers/ai-tone";
import { createAiTopicGapTask } from "../src/ai/analyzers/ai-topic-gap";
import { createAiTasks } from "../src/ai/analyzers";
import { estimateAiCost } from "../src/ai/cost-estimator";
import { aiDetectionPrompt } from "../src/ai/prompts/ai-detection.prompt";
import { competitorPrompt } from "../src/ai/prompts/competitor.prompt";
import { contentQualityPrompt } from "../src/ai/prompts/content-quality.prompt";
import { metaPrompt } from "../src/ai/prompts/meta.prompt";
import { rewritePrompt } from "../src/ai/prompts/rewrite.prompt";
import { searchIntentPrompt } from "../src/ai/prompts/search-intent.prompt";
import { semanticPrompt } from "../src/ai/prompts/semantic.prompt";
import { snippetPrompt } from "../src/ai/prompts/snippet.prompt";
import { buildSystemPrompt } from "../src/ai/prompts/system.prompts";
import { titlePrompt } from "../src/ai/prompts/title.prompt";
import { tonePrompt } from "../src/ai/prompts/tone.prompt";
import { topicGapPrompt } from "../src/ai/prompts/topic-gap.prompt";
import { runAiSuite } from "../src/ai/suite";
import { buildContext } from "../src/core/context";
import { enGradeLabels } from "../src/locales/en";
import { trGradeLabels } from "../src/locales/tr";
import { createAiContentPlugin } from "../src/plugins/built-in/ai-content.plugin";
import { createCompetitorGapPlugin } from "../src/plugins/built-in/competitor-gap.plugin";
import { blogProfile } from "../src/profiles/blog";
import { documentationProfile } from "../src/profiles/documentation";
import { ecommerceProfile } from "../src/profiles/ecommerce";
import { landingProfile } from "../src/profiles/landing";
import { newsProfile } from "../src/profiles/news";
import { productProfile } from "../src/profiles/product";

describe("ai prompts and suite", () => {
  it("builds prompts", () => {
    expect(contentQualityPrompt("Title", 100)).toContain("Title");
    expect(searchIntentPrompt("seo")).toContain("seo");
    expect(searchIntentPrompt(undefined)).toContain("\"\"");
    expect(titlePrompt("Title")).toContain("Title");
    expect(metaPrompt("desc")).toContain("desc");
    expect(metaPrompt(undefined)).toContain("\"\"");
    expect(semanticPrompt("seo")).toContain("seo");
    expect(semanticPrompt(undefined)).toContain("\"\"");
    expect(rewritePrompt("X")).toContain("X");
    expect(snippetPrompt("snippet")).toContain("snippet");
    expect(tonePrompt("en")).toContain("English");
    expect(tonePrompt("tr")).toContain("Turkce");
    expect(competitorPrompt("seo", 2)).toContain("2");
    expect(topicGapPrompt("seo", ["a", "b"])).toContain("a, b");
    expect(aiDetectionPrompt("text")).toContain("text");
    expect(buildSystemPrompt("en")).toContain("JSON");
    expect(buildSystemPrompt("tr")).toContain("Turkce");
  });

  it("builds ai tasks", () => {
    const context = buildContext({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>hello world</p>",
      focusKeyword: "seo"
    });
    expect(createAiContentTask(context).id).toBe("ai-content-quality");
    expect(createAiSemanticTask(context).id).toBe("ai-semantic");
    expect(createAiRewriteTask(context).id).toBe("ai-rewrite");
    expect(createAiSearchIntentTask(context).id).toBe("ai-search-intent");
    expect(createAiTitleTask(context).id).toBe("ai-title");
    expect(createAiMetaTask(context).id).toBe("ai-meta");
    expect(createAiSnippetTask(context).id).toBe("ai-snippet");
    expect(createAiToneTask(context).id).toBe("ai-tone");
    expect(createAiCompetitorTask(context).id).toBe("ai-competitor");
    expect(createAiTopicGapTask(context).id).toBe("ai-topic-gap");
    expect(createAiDetectionTask(context).id).toBe("ai-detection");

    const tasks = createAiTasks(context);
    expect(tasks).toHaveLength(11);
    expect(tasks.map((task) => task.id)).toEqual(
      expect.arrayContaining([
        "ai-content-quality",
        "ai-search-intent",
        "ai-title",
        "ai-meta",
        "ai-semantic",
        "ai-rewrite",
        "ai-snippet",
        "ai-tone",
        "ai-competitor",
        "ai-topic-gap",
        "ai-detection"
      ])
    );

    const fallbackContext = buildContext({
      url: "https://example.com/fallback",
      title: "Fallback Title",
      content: "<p>fallback</p>"
    });
    expect(createAiMetaTask(fallbackContext).prompt).toContain('""');
    expect(createAiCompetitorTask(fallbackContext).prompt).toContain("Fallback Title");

    const richContext = buildContext({
      url: "https://example.com/rich",
      title: "Rich Title",
      content: "<p>rich</p>",
      focusKeyword: "rich seo",
      secondaryKeywords: ["a", "b", "c"],
      meta: { description: "Rich description" }
    });
    expect(createAiMetaTask(richContext).prompt).toContain("Rich description");
    expect(createAiCompetitorTask(richContext).prompt).toContain("3 competitors");
  });

  it("runs ai suite and clamps total delta", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: "{\"scoreDelta\":10}" } }] })
      }))
    );
    const context = buildContext({
      url: "https://example.com",
      title: "Title",
      content: "<h1>Title</h1><p>hello world</p>"
    });
    const result = await runAiSuite(
      {
        enabled: true,
        baseUrl: "https://api.test",
        apiKey: "k",
        model: "m"
      },
      context
    );
    expect(result.scoreDelta).toBe(20);
  });
});

describe("split locale/profile modules", () => {
  it("exports locale grade labels", () => {
    expect(enGradeLabels.A).toBe("Excellent");
    expect(trGradeLabels.A).toBe("Mukemmel");
  });

  it("exports profile weights", () => {
    expect(blogProfile.content).toBeGreaterThan(1);
    expect(productProfile.structuredData).toBeGreaterThan(1);
    expect(landingProfile.ux).toBeGreaterThan(1);
    expect(newsProfile.eeat).toBeGreaterThan(1);
    expect(documentationProfile.structure).toBeGreaterThan(1);
    expect(ecommerceProfile.technical).toBeGreaterThan(1);
  });
});

describe("ai cost estimator and built-in plugins", () => {
  it("estimates ai cost with defaults and custom pricing", () => {
    expect(estimateAiCost(100_000, 20_000)).toBeGreaterThan(0);
    expect(
      estimateAiCost(100_000, 20_000, {
        inputPerMillion: 1,
        outputPerMillion: 2
      })
    ).toBe(0.14);
    expect(estimateAiCost(-1, -1)).toBe(0);
  });

  it("applies built-in plugin behavior", () => {
    const aiContentPlugin = createAiContentPlugin();
    const competitorGapPlugin = createCompetitorGapPlugin();

    const base = {
      score: 70,
      grade: "C",
      categoryScores: {
        content: { score: 1, maxScore: 1 },
        meta: { score: 1, maxScore: 1 },
        keyword: { score: 1, maxScore: 1 },
        semantic: { score: 1, maxScore: 1 },
        structure: { score: 1, maxScore: 1 },
        readability: { score: 1, maxScore: 1 },
        technical: { score: 1, maxScore: 1 },
        eeat: { score: 1, maxScore: 1 },
        structuredData: { score: 1, maxScore: 1 },
        ux: { score: 1, maxScore: 1 }
      },
      rules: [],
      suggestions: [],
      mode: "rule-only" as const
    };

    const afterAiContent = aiContentPlugin.afterAnalyze?.(base);
    expect(afterAiContent?.suggestions[0]?.id).toBe("plugin.ai-content.enable-ai");

    const afterCompetitor = competitorGapPlugin.afterAnalyze?.(base);
    expect(afterCompetitor?.suggestions.at(-1)?.id).toBe("plugin.competitor-gap.run-analysis");

    const hybrid = {
      ...base,
      score: 90,
      mode: "hybrid" as const
    };
    expect(aiContentPlugin.afterAnalyze?.(hybrid)).toEqual(hybrid);
    expect(competitorGapPlugin.afterAnalyze?.(hybrid)).toEqual(hybrid);
  });
});

import { describe, expect, it } from "vitest";
import { analyzeCompetitorGap } from "../src/analyzers/competitor.analyzer";
import { analyzeFreshness } from "../src/analyzers/freshness.analyzer";
import { analyzeLinkStrategy } from "../src/analyzers/link-strategy.analyzer";
import { analyzeSnippetOpportunity } from "../src/analyzers/snippet.analyzer";
import { buildContext } from "../src/core/context";
import {
  tokenizeSentences,
  tokenizeWordsFromSentence
} from "../src/parsers/sentence.tokenizer";
import { parseStructuredDataFromHtml } from "../src/parsers/structured-data.parser";
import { getBuiltInRules } from "../src/rules/all";

describe("extra analyzers", () => {
  it("covers competitor analyzer branches", () => {
    const context = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>short</p>",
      secondaryKeywords: []
    });
    const suggestions = analyzeCompetitorGap(context);
    expect(suggestions.length).toBeGreaterThan(0);

    const rich = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>" + "word ".repeat(900) + "</p>",
      secondaryKeywords: ["a", "b", "c"]
    });
    expect(analyzeCompetitorGap(rich)).toHaveLength(0);
  });

  it("covers snippet analyzer branches", () => {
    const withHowNoList = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>How to rank</h1><p>" + "word ".repeat(400) + "</p>"
    });
    const suggestions = analyzeSnippetOpportunity(withHowNoList);
    expect(suggestions.some((item) => item.id === "snippet.add-list")).toBe(true);

    const withList = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>Guide</h1><ul><li>a</li></ul><p>short words here</p>"
    });
    expect(analyzeSnippetOpportunity(withList)).toHaveLength(0);
  });

  it("covers freshness analyzer branches", () => {
    const noDate = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>x</p>"
    });
    expect(analyzeFreshness(noDate)[0]?.id).toBe("freshness.modified-date");

    const invalidDate = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>x</p>",
      meta: { modifiedDate: "bad-date" }
    });
    expect(analyzeFreshness(invalidDate)[0]?.id).toBe("freshness.invalid-date");

    const oldDate = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>x</p>",
      meta: { modifiedDate: "2020-01-01" }
    });
    const stale = analyzeFreshness(oldDate, Date.parse("2026-02-07"));
    expect(stale[0]?.id).toBe("freshness.update-content");
  });

  it("covers link strategy analyzer branches", () => {
    const weak = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1><p>x</p><a href='/a'>a</a>"
    });
    const suggestions = analyzeLinkStrategy(weak);
    expect(suggestions.some((item) => item.id === "links.internal")).toBe(true);
    expect(suggestions.some((item) => item.id === "links.external")).toBe(true);

    const strong = buildContext({
      url: "https://example.com",
      title: "T",
      content:
        "<h1>T</h1><p>x</p><a href='/a'>a</a><a href='/b'>b</a><a href='https://x.com'>x</a>"
    });
    expect(analyzeLinkStrategy(strong)).toHaveLength(0);
  });
});

describe("new parsers", () => {
  it("tokenizes sentences and words", () => {
    expect(tokenizeSentences("A. B? C!")).toEqual(["A", "B", "C"]);
    expect(tokenizeWordsFromSentence("SEO Guide 2026")).toEqual(["seo", "guide", "2026"]);
  });

  it("parses structured data blocks", () => {
    const html =
      "<script type='application/ld+json'>{\"@type\":\"Article\"}</script>" +
      "<script type='application/ld+json'>[{\"@type\":\"FAQPage\"}]</script>" +
      "<script type='application/ld+json'>bad-json</script>";
    const parsed = parseStructuredDataFromHtml(html);
    expect(parsed.length).toBe(2);
    expect(parseStructuredDataFromHtml("<p>no scripts</p>")).toEqual([]);
    expect(
      parseStructuredDataFromHtml(
        "<script type='application/ld+json'>   </script>"
      )
    ).toEqual([]);

    const contextFromHtml = buildContext({
      url: "https://example.com",
      title: "T",
      content: `<h1>T</h1>${html}`
    });
    expect(contextFromHtml.input.structuredData?.length).toBe(2);

    const contextFromInput = buildContext({
      url: "https://example.com",
      title: "T",
      content: "<h1>T</h1>",
      structuredData: [{ "@type": "Product" }]
    });
    expect(contextFromInput.input.structuredData?.length).toBe(1);
  });

  it("covers structured-data rules when input structuredData is undefined", () => {
    const rules = getBuiltInRules().filter((rule) => rule.category === "structuredData");
    const fakeContext = {
      input: {
        url: "https://example.com",
        title: "T",
        content: "<h1>T</h1>"
      },
      parsed: {
        plainText: "T",
        wordCount: 1,
        sentenceCount: 1,
        titleLength: 1,
        headings: ["T"],
        imageCount: 0,
        internalLinkCount: 0,
        externalLinkCount: 0,
        hasCanonical: false,
        hasRobots: false,
        isHttps: true,
        depth: 1,
        hasQuery: false
      },
      tokens: ["t"]
    };
    expect(rules[0]?.evaluate(fakeContext as any).passed).toBe(false);
    expect(rules[4]?.evaluate(fakeContext as any).passed).toBe(true);
  });
});

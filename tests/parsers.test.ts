import { describe, expect, it } from "vitest";
import { extractPlainText } from "../src/parsers/text.extractor";
import { parseHtml } from "../src/parsers/html.parser";
import { parseUrl } from "../src/parsers/url.parser";

describe("parsers", () => {
  it("extracts plain text", () => {
    const text = extractPlainText("<h1>Hello</h1><p>World</p>");
    expect(text).toBe("Hello World");
  });

  it("parses html stats", () => {
    const result = parseHtml("<h1>A</h1><h2>B</h2><img/><a href='/x'>x</a>");
    expect(result.headings).toEqual(["A", "B"]);
    expect(result.imageCount).toBe(1);
    expect(result.linkCount).toBe(1);
  });

  it("parses url", () => {
    const parsed = parseUrl("https://example.com/a/b?x=1");
    expect(parsed.isHttps).toBe(true);
    expect(parsed.depth).toBe(2);
    expect(parsed.hasQuery).toBe(true);
  });
});


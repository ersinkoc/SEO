import { describe, expect, it } from "vitest";
import { hasFocusToken } from "../src/rules/helpers";

describe("rules helpers", () => {
  it("handles empty and blank focus keyword", () => {
    expect(hasFocusToken(undefined, ["seo"])).toBe(false);
    expect(hasFocusToken("   ", ["seo"])).toBe(false);
    expect(hasFocusToken("seo guide", ["seo", "guide"])).toBe(true);
  });
});


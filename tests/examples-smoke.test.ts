import { describe, expect, it, vi } from "vitest";

const exampleModules = [
  "../examples/01-basic/quick-scan.ts",
  "../examples/01-basic/simple-analysis.ts",
  "../examples/01-basic/with-meta.ts",
  "../examples/02-plugins/custom-plugin.ts",
  "../examples/02-plugins/custom-rule.ts",
  "../examples/02-plugins/disable-category.ts",
  "../examples/03-ai/openai-basic.ts",
  "../examples/03-ai/ollama-local.ts",
  "../examples/03-ai/openrouter.ts",
  "../examples/03-ai/all-features.ts",
  "../examples/04-competitor/basic-comparison.ts",
  "../examples/04-competitor/content-gap.ts",
  "../examples/05-advanced/batch-analysis.ts",
  "../examples/05-advanced/report-diff.ts",
  "../examples/05-advanced/selective-categories.ts",
  "../examples/05-advanced/custom-profile.ts",
  "../examples/06-real-world/blog-optimization.ts",
  "../examples/06-real-world/ci-integration.ts",
  "../examples/06-real-world/ecommerce-page.ts"
] as const;

describe("examples smoke", () => {
  it("imports and runs all examples without throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        json: async () => ({ choices: [{ message: { content: "{\"scoreDelta\":1}" } }] })
      }))
    );

    for (const modulePath of exampleModules) {
      await expect(import(modulePath)).resolves.toBeTruthy();
    }
  });
});

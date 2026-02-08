import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "tests/**",
        "examples/**",
        "dist/**",
        "**/dist/**",
        "website/**",
        "bin/**",
        "**/*.config.*",
        "src/types.ts",
        "src/locales/types.ts",
        "src/profiles/types.ts",
        "src/plugins/**"
      ],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      }
    }
  }
});

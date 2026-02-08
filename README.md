# @oxog/seo

Enterprise-grade, zero-runtime-dependency on-page SEO scoring engine for TypeScript.

- Package: `@oxog/seo`
- Repository: `https://github.com/ersinkoc/seo`
- Documentation: `https://seo.oxog.dev`
- License: MIT

## What This Package Does

`@oxog/seo` evaluates web content with deterministic scoring rules and optional AI enhancement.

- 10 core SEO categories
- 107 built-in rules
- micro-kernel plugin hooks
- sync rule-only analysis and async hybrid analysis
- batch analysis utilities
- JSON/Markdown/HTML/CSV report formatting
- report diff/trend/benchmark helpers

## Install

```bash
npm i @oxog/seo
```

## Quick Start

```ts
import { createSeoAnalyzer } from "@oxog/seo";

const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  depth: "full"
});

const report = analyzer.analyzeSync({
  url: "https://example.com/blog/typescript-seo",
  title: "TypeScript SEO Guide",
  content: "<article><h1>TypeScript SEO</h1><p>...</p></article>",
  focusKeyword: "typescript seo",
  secondaryKeywords: ["on-page seo", "seo analyzer"],
  meta: {
    description: "Zero-dependency SEO analysis with deterministic scoring.",
    canonical: "https://example.com/blog/typescript-seo",
    robots: "index, follow",
    author: "Ersin",
    publishDate: "2026-01-20",
    modifiedDate: "2026-02-01"
  },
  structuredData: [{ "@type": "Article" }]
});

console.log(report.score, report.grade);
console.log(report.suggestions);
```

## API Overview

### `createSeoAnalyzer(config)`

Creates analyzer instance with locale, profile, depth, and optional AI config.

```ts
const analyzer = createSeoAnalyzer({
  locale: "tr",
  profile: "blog",
  depth: "standard",
  enabledCategories: ["content", "meta", "keyword", "technical"]
});
```

### `analyzeSync(input)`

Deterministic rule-only path (no network calls).

### `analyze(input)`

Hybrid path. If AI is enabled and available, merges AI with rule score.
If AI fails, gracefully falls back to rule-only.

### `analyzeBatchSync(inputs)` and `analyzeBatch(inputs)`

Analyze multiple documents in one call.

### `addRule(rule)`

Register custom rules with category + weight.

```ts
analyzer.addRule({
  id: "custom.meta.min-description",
  category: "meta",
  weight: 2,
  description: "Meta description must be >= 120 chars",
  evaluate: (context) => ({
    passed: (context.input.meta?.description?.length ?? 0) >= 120,
    message: "Meta description length check"
  })
});
```

### `use(plugin)`

Hook into analysis lifecycle.

```ts
analyzer.use({
  name: "score-flagger",
  afterAnalyze(report) {
    if (report.score >= 90) {
      report.suggestions.unshift({
        id: "plugin.score-flag",
        category: "content",
        message: "Score is excellent.",
        priority: "low"
      });
    }
    return report;
  }
});
```

### Formatter Helpers

- `format(report)` -> JSON
- `formatMarkdown(report)` -> Markdown
- `formatHtml(report)` -> self-contained HTML
- `formatCsv(reports)` -> CSV

## Scoring Model

### Categories

- `content`
- `meta`
- `keyword`
- `semantic`
- `structure`
- `readability`
- `technical`
- `eeat`
- `structuredData`
- `ux`

### Grade Mapping

- `97+` -> `A+`
- `93-96` -> `A`
- `90-92` -> `A-`
- `87-89` -> `B+`
- `83-86` -> `B`
- `80-82` -> `B-`
- `77-79` -> `C+`
- `73-76` -> `C`
- `70-72` -> `C-`
- `67-69` -> `D+`
- `63-66` -> `D`
- `60-62` -> `D-`
- `<60` -> `F`

## Depth Modes

- `quick`: content, meta, keyword, technical
- `standard`: quick + structure, readability, eeat
- `full`: all 10 categories

## Compare Utilities

```ts
import { diffReports, analyzeTrend, benchmarkReport } from "@oxog/seo";

const diff = diffReports(reportA, reportB);
const trend = analyzeTrend([reportA, reportB, reportC]);
const benchmark = benchmarkReport(reportA, 78);
```

## AI Integration

AI is optional and OpenAI-compatible.

```ts
const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  ai: {
    enabled: true,
    baseUrl: "https://api.openai.com/v1",
    apiKey: process.env.OPENAI_API_KEY ?? "",
    model: "gpt-4o-mini",
    timeoutMs: 15000,
    ruleWeight: 0.7,
    aiWeight: 0.3
  }
});
```

AI modules currently include:
- 11 prompt templates (`content-quality`, `semantic`, `search-intent`, `rewrite`, `title`, `meta`, `snippet`, `tone`, `competitor`, `topic-gap`, `ai-detection`)
- 11 analyzer tasks orchestrated through `runAiSuite`
- retry, rate-limiter, token estimator, score merger, and cost estimator
- built-in plugins: `createAiContentPlugin`, `createCompetitorGapPlugin`

## Examples

Example catalog currently includes 19 TypeScript files across 6 groups:

- `examples/01-basic`: `simple-analysis.ts`, `with-meta.ts`, `quick-scan.ts`
- `examples/02-plugins`: `custom-rule.ts`, `custom-plugin.ts`, `disable-category.ts`
- `examples/03-ai`: `openai-basic.ts`, `ollama-local.ts`, `openrouter.ts`, `all-features.ts`
- `examples/04-competitor`: `basic-comparison.ts`, `content-gap.ts`
- `examples/05-advanced`: `batch-analysis.ts`, `report-diff.ts`, `selective-categories.ts`, `custom-profile.ts`
- `examples/06-real-world`: `blog-optimization.ts`, `ecommerce-page.ts`, `ci-integration.ts`

## Development

```bash
npm run test
npm run test:coverage
npm run typecheck
npm run build
```

## Implementation Status

Implemented in current codebase:
- deterministic engine with 107 built-in rules
- plugin hooks + built-in plugins
- depth/category scoping
- sync + async + batch analysis
- formatters and compare utilities
- split NLP modules (TF-IDF, stemmer, entity extraction, sentiment, readability helpers)
- multi-step AI prompt/analyzer orchestration
- zero runtime dependencies

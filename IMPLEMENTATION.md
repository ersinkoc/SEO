# Implementation

## 1. Architecture Strategy

The package is implemented with a micro-kernel style core:

- `Kernel` orchestrates plugin hooks (`beforeAnalyze`, `afterAnalyze`)
- `RuleRegistry` owns built-in + custom rule set
- `buildContext` builds immutable analysis context from raw input
- `scoreRules` computes weighted category and final scores
- `SeoAnalyzer` coordinates sync, async, and batch pipelines

This design allows:
- deterministic core behavior
- pluggable extensibility
- graceful hybrid mode without coupling rule engine to network calls

## 2. Data Flow

### 2.1 Sync (`analyzeSync`)

1. Validate required input fields
2. Trigger `beforeAnalyze` plugin hooks
3. Parse HTML + tokenize + URL decomposition
4. Evaluate active rule set
5. Aggregate weighted scores and grade
6. Build suggestions from failed rules
7. Trigger `afterAnalyze` plugin hooks
8. Return `SeoReport`

### 2.2 Async (`analyze`)

1. Execute sync pipeline
2. If AI config disabled -> return sync report
3. Call fetch-based AI endpoint
4. Parse score delta
5. Merge score via weighted formula
6. Return hybrid report

If any AI step fails, async path still returns deterministic report.

## 3. Rule Engine Design

- Rules are simple objects with `id`, `category`, `weight`, `description`, `evaluate(context)`
- Evaluation returns `passed`, `message`, optional `suggestion`
- Rule results are normalized as `RuleResult`
- Category scoring is based on `sum(passed weight) / sum(max weight)`
- Profile weights shape final aggregate score

## 4. Scoping Design

### 4.1 Depth

- `quick`: core technical scan
- `standard`: quick + structure/readability/eeat
- `full`: all categories

### 4.2 Category Allow-list

`enabledCategories` can narrow depth scope, useful for custom workflows.

## 5. Formatter and Compare Design

- `formatAsJson`: canonical serialization
- `formatAsMarkdown`: compact report for docs/PR comments
- `formatAsHtml`: self-contained report for artifacts
- `formatAsCsv`: batch export surface
- `diffReports`, `analyzeTrend`, `benchmarkReport`: post-analysis insight helpers

## 6. Quality Strategy

- strict TypeScript
- unit tests for parsers, analyzer lifecycle, AI fallback, compare utilities
- coverage enforcement via Vitest thresholds
- zero runtime dependency enforcement via `package.json`

## 7. Planned Expansion Points

- dedicated analyzer modules by category
- richer NLP internals (tf-idf, stemming, entity extraction, passive voice)
- provider preset catalog and AI orchestrator strategies
- website documentation content and generated API docs

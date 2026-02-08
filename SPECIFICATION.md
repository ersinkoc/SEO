# @oxog/seo Specification

## 1. Product Identity

- Name: `@oxog/seo`
- Runtime: Node.js `>=18`
- Language: TypeScript (strict mode)
- Runtime dependencies: none

## 2. Product Goal

Provide a deterministic on-page SEO scoring engine with optional AI enhancement.
Primary use cases:
- CI quality gates for content score thresholds
- editorial SEO quality checks
- rule-based audit and recommendations
- hybrid scoring when AI is enabled

## 3. Functional Requirements

### 3.1 Analyzer Lifecycle

- parse input content
- build normalized analysis context
- evaluate active rules
- aggregate category scores
- calculate final score and grade
- generate actionable suggestions
- optionally merge AI score signal
- format and compare reports

### 3.2 Input and Output

Input:
- URL
- title
- HTML/content body
- optional focus and secondary keywords
- optional meta fields
- optional structured data array

Output (`SeoReport`):
- total score
- letter grade
- category score map
- rule-level results
- prioritized suggestions
- execution mode (`rule-only` or `hybrid`)

### 3.3 Categories and Rule Distribution

- content: 12
- meta: 15
- keyword: 14
- semantic: 8
- structure: 12
- readability: 12
- technical: 10
- eeat: 10
- structuredData: 8
- ux: 6

Total built-in rule count target: 107.

### 3.4 API Contract

- `createSeoAnalyzer(config): AnalyzerInstance`
- `analyzeSync(input): SeoReport`
- `analyze(input): Promise<SeoReport>`
- `analyzeBatchSync(inputs): SeoReport[]`
- `analyzeBatch(inputs): Promise<SeoReport[]>`
- `addRule(rule): void`
- `use(plugin): void`
- `format(report): string`
- `formatMarkdown(report): string`
- `formatHtml(report): string`
- `formatCsv(reports): string`
- `getRules(): RuleDefinition[]`

### 3.5 Scope Controls

- `depth`: `quick | standard | full`
- `enabledCategories`: optional category allow-list
- `profile`: scoring-weight profile (`blog`, `product`, `landing`, `news`, `documentation`, `ecommerce`)

### 3.6 AI Requirements

- optional, fetch-based OpenAI-compatible API call
- no SDK dependency
- configurable timeout
- weighted merge with deterministic score
- graceful fallback to deterministic score when AI fails

### 3.7 Compare and Reporting

- report diff utility
- trend utility for score series
- benchmark utility against target score
- JSON/Markdown/HTML/CSV formatter support

## 4. Non-Functional Requirements

- zero runtime dependency policy
- strict TypeScript compiler options
- deterministic behavior in sync mode
- branch-safe error handling for malformed input and AI failures
- full test coverage target in CI

## 5. Compliance Notes

This implementation focuses on a production-capable core and API completeness.
Advanced modules from long-term scope (full NLP stack, provider preset families, website UI) are tracked in `TASKS.md`.

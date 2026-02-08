# @oxog/seo — Enterprise-Grade On-Page SEO Scoring Engine

## Package Identity

| Field | Value |
|-------|-------|
| **NPM Package** | `@oxog/seo` |
| **GitHub Repository** | `https://github.com/ersinkoc/seo` |
| **Documentation Site** | `https://seo.oxog.dev` |
| **License** | MIT |
| **Author** | Ersin Koç (ersinkoc) |

> **NO social media, Discord, email, or external links allowed.**

---

## Package Description

**One-line:** Zero-dependency, AI-enhanced on-page SEO scoring engine with 107 rules, semantic analysis, and OpenAI-compatible provider support.

@oxog/seo is a TypeScript-first SEO analysis library that goes far beyond basic meta tag checks. It combines a deterministic rule engine (~107 rules across 10 categories) with an optional AI enhancement layer that supports any OpenAI-compatible provider. The rule engine runs offline in ~50ms, scoring content quality, keyword strategy, E-E-A-T signals, structured data, readability (NLP-lite), and SERP pixel simulation. When AI is enabled, it adds deep semantic analysis, content rewrite suggestions, competitor insights, AI content detection, and featured snippet optimization. Hybrid scoring (rules 70% + AI 30%) ensures reliability even when API is unavailable — the system gracefully degrades to rule-only mode. Designed as an open-source alternative that surpasses Semrush's On-Page SEO Checker.

---

## NON-NEGOTIABLE RULES

These rules are **ABSOLUTE** and must be followed without exception.

### 1. ZERO RUNTIME DEPENDENCIES

```json
{
  "dependencies": {}  // MUST BE EMPTY - NO EXCEPTIONS
}
```

- Implement EVERYTHING from scratch — HTML parser, NLP tokenizer, TF-IDF, stemmer, HTTP client, LRU cache
- No cheerio, no natural, no openai SDK, no node-fetch — nothing
- Write your own utilities, parsers, validators
- The AI client uses native `fetch` (Node 18+) — no dependency needed
- If you think you need a dependency, you don't

**Allowed devDependencies only:**
```json
{
  "devDependencies": {
    "typescript": "^5.0.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "tsup": "^8.0.0",
    "@types/node": "^20.0.0",
    "prettier": "^3.0.0",
    "eslint": "^9.0.0"
  }
}
```

### 2. 100% TEST COVERAGE

- Every line of code must be tested
- Every branch must be tested
- Every function must be tested
- **All tests must pass** (100% success rate)
- Use Vitest for testing
- Coverage thresholds enforced in config
- Mock `fetch` for AI client tests — never make real API calls in tests

### 3. MICRO-KERNEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        User Code                             │
├─────────────────────────────────────────────────────────────┤
│  createSeoAnalyzer({ locale, profile, ai?, plugins? })      │
├──────────┬──────────┬──────────┬──────────┬─────────────────┤
│ Content  │ Meta     │ Keyword  │ Semantic │ ... (14 total)  │
│ Analyzer │ Analyzer │ Analyzer │ Analyzer │  Analyzer       │
│ Plugin   │ Plugin   │ Plugin   │ Plugin   │  Plugins        │
├──────────┴──────────┴──────────┴──────────┴─────────────────┤
│                    Analysis Pipeline                         │
│   Parse → Analyze → Score → Merge AI → Format → Report     │
├─────────────────────────────────────────────────────────────┤
│                      Micro Kernel                            │
│   Plugin Registry · Event Bus · Error Boundary · Config     │
└─────────────────────────────────────────────────────────────┘
```

Each analyzer is a plugin. Users can disable built-in analyzers, add custom rules, and extend via the plugin system.

### 4. DEVELOPMENT WORKFLOW

Create these documents **FIRST**, before any code:

1. **SPECIFICATION.md** — Complete package specification
2. **IMPLEMENTATION.md** — Architecture and design decisions
3. **TASKS.md** — Ordered task list with dependencies

Only after all three documents are complete, implement code following TASKS.md sequentially.

### 5. TYPESCRIPT STRICT MODE

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext"
  }
}
```

### 6. LLM-NATIVE DESIGN

- **llms.txt** file in root (< 2000 tokens)
- **Predictable API** naming (`create`, `get`, `set`, `use`, `remove`)
- **Rich JSDoc** with @example on every public API
- **15+ examples** organized by category
- **README** optimized for LLM consumption

### 7. NO EXTERNAL LINKS

- ✅ GitHub repository URL
- ✅ Custom domain (seo.oxog.dev)
- ✅ npm package URL
- ❌ Social media (Twitter, LinkedIn, etc.)
- ❌ Discord/Slack links
- ❌ Email addresses
- ❌ Donation/sponsor links

---

## ARCHITECTURE OVERVIEW

### Hybrid Scoring Model

```
┌─────────────────────────────────────────────────────────┐
│                    @oxog/seo Engine                      │
│                                                         │
│  ┌──────────────────┐     ┌──────────────────────────┐  │
│  │  Rule Engine      │     │  AI Engine (optional)    │  │
│  │  ~107 rules       │     │  OpenAI-compatible API   │  │
│  │  Deterministic    │     │  Any provider/model      │  │
│  │  Free / offline   │     │  Deep semantic analysis  │  │
│  │  ~50ms            │     │  ~2-5s (API call)        │  │
│  └────────┬─────────┘     └────────────┬─────────────┘  │
│           │                            │                 │
│           └──────────┬─────────────────┘                 │
│                      ▼                                   │
│             ┌────────────────┐                           │
│             │  Score Merger  │                           │
│             │  Rule: 70%     │  ← Configurable weight   │
│             │  AI:   30%     │                           │
│             └────────┬───────┘                           │
│                      ▼                                   │
│              Final SeoReport                             │
└─────────────────────────────────────────────────────────┘
```

**Why hybrid?**
- AI can hallucinate → Rule engine provides ground truth
- API down → Rule engine continues working alone
- Cost control → AI only for critical analyses
- Deterministic + Creative = Best results

### API Surface: sync vs async

```typescript
// WITHOUT AI → sync (fast, deterministic)
const report = analyzer.analyzeSync(input);

// WITH AI → async (API calls involved)
const report = await analyzer.analyze(input);

// analyze() always returns Promise<SeoReport> (works both with and without AI)
// analyzeSync() always returns SeoReport (never calls AI, rule-only)
```

---

## CORE FEATURES

### 1. SEO Analysis Engine (107 Rules, 10 Categories)

The core engine analyzes content through 10 scoring categories, each with weighted rules. Rules are deterministic functions that evaluate content against SEO best practices.

**API Example:**
```typescript
import { createSeoAnalyzer } from '@oxog/seo';

const analyzer = createSeoAnalyzer({
  locale: 'tr',
  profile: 'blog',
  depth: 'full',   // 'quick' | 'standard' | 'full'
});

const report = analyzer.analyzeSync({
  url: 'https://example.com/blog/typescript-seo',
  title: 'TypeScript ile SEO Aracı Nasıl Yazılır? [2025 Rehber]',
  content: '<article><h1>TypeScript ile SEO</h1><p>Bu rehberde...</p></article>',
  focusKeyword: 'typescript seo',
  secondaryKeywords: ['seo analiz', 'on-page seo'],
  meta: {
    description: 'TypeScript kullanarak zero-dependency SEO analiz...',
    canonical: 'https://example.com/blog/typescript-seo',
    robots: 'index, follow',
    author: 'Ersin',
    publishDate: '2025-01-15',
    modifiedDate: '2025-06-01',
    og: { title: '...', description: '...', image: '...', type: 'article' },
    twitter: { card: 'summary_large_image', title: '...' },
  },
  structuredData: [
    { '@type': 'Article', headline: '...', author: { '@type': 'Person', name: 'Ersin' } }
  ],
});

console.log(report.score);       // 78
console.log(report.grade);       // 'B+'
console.log(report.suggestions); // Prioritized action items
```

### 2. 10 Scoring Categories

Each category has its own analyzer plugin, rules, and configurable weight:

| Category | Description | Rule Count |
|----------|-------------|------------|
| `content` | Content quality, depth, word count, intro/conclusion | 12 |
| `meta` | Title (pixel-based), description, OG, Twitter, canonical | 15 |
| `keyword` | Density, placement, distribution, stuffing detection | 14 |
| `semantic` | TF-IDF, topic coverage, entity richness, content intent | 8 |
| `structure` | Headings hierarchy, links, images, anchor diversity | 12 |
| `readability` | Flesch score, sentence variance, passive voice, transitions | 12 |
| `technical` | URL analysis, HTTPS, canonical, hreflang, trailing slash | 10 |
| `eeat` | Author, publish date, sources, experience/expertise signals | 10 |
| `structuredData` | Schema.org validation, type appropriateness, completeness | 8 |
| `ux` | Table of contents, scannability, CTA, mobile paragraph length | 6 |
| **TOTAL** | | **107** |

### 3. Lightweight NLP Engine (Zero-Dependency)

Built-in NLP capabilities for semantic analysis without any external library:

```typescript
// All NLP functions are pure TypeScript, no external dependency

// TF-IDF — splits content into paragraph segments for IDF calculation
function calculateTfIdf(text: string, stopwords: Set<string>): TfIdfTerm[]

// Entity Extraction — regex + heuristic based
// Detects: persons, organizations, places, products, concepts, dates, numbers
function extractEntities(text: string, locale: string): EntityMention[]

// Turkish Stemmer — suffix stripping (SEO analysis level, not full morphological)
function stemTurkish(word: string): string

// English Stemmer — Porter-like lightweight stemmer
function stemEnglish(word: string): string

// Cosine Similarity — for topic clustering and competitor comparison
function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number

// Sentiment — keyword-based simple sentiment scoring
function analyzeSentiment(text: string, locale: string): number  // -1 to 1

// Syllable Counter — for Flesch readability score
function countSyllables(word: string, locale: string): number

// Passive Voice Detection
// TR: "yapılmıştır", "edilmiştir", "olunmuştur"
// EN: "was/were + past participle"
function detectPassiveVoice(sentences: string[], locale: string): number

// Transition Word Detection — locale-aware
function detectTransitionWords(sentences: string[], locale: string): number
```

### 4. SERP Pixel Simulation

Google truncates titles by **pixel width**, not character count. We simulate this accurately:

```typescript
import { simulateSerp } from '@oxog/seo';

const serp = simulateSerp({
  title: 'TypeScript ile SEO Aracı Nasıl Yazılır? [2025 Rehber]',
  description: 'TypeScript kullanarak zero-dependency SEO analiz kütüphanesi...',
  url: 'https://example.com/blog/typescript-seo',
});

console.log(serp.desktop.title.pixelWidth);    // 487
console.log(serp.desktop.title.truncated);     // false
console.log(serp.desktop.title.maxPixels);     // 580
console.log(serp.mobile.title.pixelWidth);     // 487
console.log(serp.mobile.title.maxPixels);      // 920

// Turkish character widths are included: ş, ç, ğ, ı, ö, ü, İ, Ş, Ç, Ğ, Ö, Ü
```

Character pixel width map is based on Arial 20px (Google's SERP font), including:
- Full ASCII character set
- Turkish special characters
- Common punctuation and symbols
- Desktop max: 580px, Mobile max: 920px

### 5. Competitor Analysis

Analyze your content against competitors to find gaps and advantages:

```typescript
const report = analyzer.analyzeSync({
  url: '...',
  title: '...',
  content: '...',
  focusKeyword: 'typescript seo',
  competitors: [
    { url: 'https://competitor1.com/seo', title: '...', content: '...' },
    { url: 'https://competitor2.com/guide', title: '...', content: '...' },
  ],
});

console.log(report.competitorAnalysis?.overallComparison);
// { yourScore: 78, avgCompetitorScore: 72, ranking: 1 }

console.log(report.competitorAnalysis?.uniqueTopics);
// { onlyYours: ['plugin system'], onlyCompetitors: ['performance benchmarks'], shared: ['installation'] }

console.log(report.contentGaps);
// [{ topic: 'performance', importance: 'high', suggestedSection: 'Performance Benchmarks', suggestedWordCount: 300 }]
```

### 6. Featured Snippet Opportunity Detection

```typescript
console.log(report.snippetOpportunity);
// {
//   eligible: true,
//   type: 'list',
//   currentContent: 'Steps: 1. Install... 2. Configure...',
//   optimization: 'Convert to ordered list with H2 "How to..." heading',
//   confidence: 0.72
// }
```

### 7. Content Freshness Analysis

```typescript
console.log(report.freshness);
// {
//   publishAge: 180,           // days
//   lastModifiedAge: 30,       // days
//   staleness: 'current',
//   dateReferences: ['2025', 'January 2025'],
//   hasFreshSignals: true,
//   suggestion: 'Content is current. Consider updating date references to latest month.'
// }
```

### 8. Internal Link Strategy

```typescript
const report = analyzer.analyzeSync({
  // ... content ...
  siteContext: {
    domain: 'example.com',
    existingPages: [
      { url: '/blog/nodejs-guide', title: 'Node.js Rehberi', keywords: ['nodejs'] },
      { url: '/blog/react-seo', title: 'React SEO', keywords: ['react', 'seo'] },
    ],
  },
});

console.log(report.linkSuggestions);
// [{ type: 'internal', from: 'Node.js', suggestedUrl: '/blog/nodejs-guide', suggestedAnchor: 'Node.js Rehberi', reason: 'Keyword match' }]
```

### 9. AI Enhancement Layer (Optional)

OpenAI-compatible AI integration that adds deep semantic analysis. **Works with ANY provider.**

```typescript
import { createSeoAnalyzer, providers } from '@oxog/seo';

const analyzer = createSeoAnalyzer({
  locale: 'tr',
  profile: 'blog',
  ai: {
    provider: providers.openai({
      apiKey: process.env.OPENAI_API_KEY!,
      model: 'gpt-4o-mini',
    }),
    features: {
      contentQuality: true,
      semanticRelevance: true,
      searchIntent: true,
      rewriteSuggestions: true,
      titleSuggestions: true,
      metaGeneration: true,
      snippetOptimization: true,
      toneAnalysis: true,
      competitorInsights: true,
      topicGaps: true,
      aiContentDetection: true,
    },
    budget: {
      maxCallsPerAnalysis: 5,
      maxTokensPerAnalysis: 8000,
      cacheResults: true,
      cacheTtlMs: 3_600_000,
    },
    weight: 0.30,
    onError: 'fallback-to-rules',
  },
});

// async when AI is configured
const report = await analyzer.analyze(input);

console.log(report.aiEnhanced);                         // true
console.log(report.categories.content.ruleScore);        // 72
console.log(report.categories.content.aiScore);          // 85
console.log(report.categories.content.score);            // 76 (merged: 72×0.7 + 85×0.3)
console.log(report.aiTitleAlternatives?.alternatives);   // 3 AI-generated title suggestions
console.log(report.aiContentDetection?.aiProbability);   // 23 (low AI probability)
console.log(report.aiUsage?.cost.estimatedUsd);          // 0.003
```

### 10. Multiple Provider Support

```typescript
import { providers } from '@oxog/seo';

// OpenAI
providers.openai({ apiKey: '...', model: 'gpt-4o-mini' })

// Anthropic (OpenAI-compatible)
providers.anthropic({ apiKey: '...', model: 'claude-sonnet-4-5-20250514' })

// Google Gemini
providers.gemini({ apiKey: '...', model: 'gemini-2.0-flash' })

// Ollama (local, free)
providers.ollama({ baseUrl: 'http://localhost:11434/v1', model: 'llama3.1' })

// OpenRouter (100+ models)
providers.openrouter({ apiKey: '...', model: 'anthropic/claude-sonnet-4-5-20250514' })

// Groq (ultra fast)
providers.groq({ apiKey: '...', model: 'llama-3.1-70b-versatile' })

// Together AI
providers.together({ apiKey: '...', model: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo' })

// Custom / Self-hosted
providers.custom({ baseUrl: 'https://my-llm.com/v1', apiKey: '...', model: '...', headers: {} })
```

### 11. Report Formatting & Export

```typescript
import { formatReport } from '@oxog/seo';

const json = formatReport(report, 'json');       // JSON export
const md = formatReport(report, 'markdown');      // Markdown report
const html = formatReport(report, 'html');        // Self-contained HTML report
const csv = formatReport(reports, 'csv');          // CSV (batch analysis)
```

### 12. Report Comparison (Diff)

```typescript
import { compare } from '@oxog/seo';

const before = analyzer.analyzeSync(oldContent);
const after = analyzer.analyzeSync(newContent);

const diff = compare(before, after);
console.log(diff.scoreDelta);    // +12
console.log(diff.improved);      // ['meta-title-length', 'keyword-density']
console.log(diff.regressed);     // ['readability-sentence-length']
```

### 13. Custom Rules

```typescript
const analyzer = createSeoAnalyzer();

analyzer.addRule({
  id: 'custom-brand-mention',
  category: 'content',
  defaultWeight: 0.3,
  evaluate: (ctx) => {
    const hasBrand = ctx.text.toLowerCase().includes('mybrand');
    return hasBrand
      ? { severity: 'pass', score: 100, message: 'Brand mentioned ✓' }
      : { severity: 'info', score: 70, message: 'Consider mentioning brand name' };
  },
});
```

### 14. Scoring Profiles

```typescript
import { createProfile } from '@oxog/seo';

// Built-in profiles: 'blog', 'product', 'landing', 'news', 'documentation', 'ecommerce'
const analyzer = createSeoAnalyzer({ profile: 'blog' });

// Custom profile
const myProfile = createProfile({
  weights: {
    content: 0.25,
    meta: 0.10,
    keyword: 0.20,
    semantic: 0.15,
    structure: 0.08,
    readability: 0.12,
    technical: 0.03,
    eeat: 0.04,
    structuredData: 0.02,
    ux: 0.01,
  },
});
const analyzer2 = createSeoAnalyzer({ profile: myProfile });
```

### 15. Analysis Depth Modes

```typescript
// quick (~5ms): Meta + keyword + technical rules only
const quick = analyzer.analyzeSync(input, { depth: 'quick' });

// standard (~20ms): All basic rules (no semantic/NLP)
const standard = analyzer.analyzeSync(input, { depth: 'standard' });

// full (~50ms): All 107 rules + NLP + competitor + snippet analysis
const full = analyzer.analyzeSync(input, { depth: 'full' });
```

### 16. Batch Analysis

```typescript
const pages = [
  { url: '...', title: '...', content: '...', focusKeyword: '...' },
  { url: '...', title: '...', content: '...', focusKeyword: '...' },
];

const reports = pages.map(page => analyzer.analyzeSync(page));
const avgScore = reports.reduce((sum, r) => sum + r.score, 0) / reports.length;
```

### 17. Selective Category Analysis

```typescript
const report = analyzer.analyzeSync(input, {
  categories: ['meta', 'keyword'],  // Only run meta and keyword rules
});
```

---

## PLUGIN SYSTEM

### Plugin Interface

```typescript
/**
 * Plugin interface for extending the SEO analyzer.
 *
 * @typeParam TContext - Analysis context type
 */
export interface SeoPlugin {
  /** Unique plugin identifier (kebab-case) */
  name: string;

  /** Semantic version */
  version: string;

  /** Plugin dependencies */
  dependencies?: string[];

  /**
   * Called when plugin is registered.
   * @param kernel - The kernel instance
   */
  install: (kernel: SeoKernel) => void;

  /** Called before analysis starts — can modify input/context */
  'before:analyze'?: (ctx: AnalysisContext) => void;

  /** Called after analysis — can modify report */
  'after:analyze'?: (report: SeoReport) => void;

  /** Called after scoring — can modify scores */
  'after:score'?: (report: SeoReport) => void;

  /** Called on error */
  onError?: (error: Error) => void;

  /** Called when plugin is unregistered */
  onDestroy?: () => void;
}
```

### Core Plugins (Always Loaded)

| Plugin | Description |
|--------|-------------|
| `content-analyzer` | Word count, paragraphs, reading time, intro/conclusion, depth |
| `meta-analyzer` | Title (pixel), description, OG, Twitter, canonical, robots |
| `keyword-analyzer` | Density, placement, distribution, stuffing, prominence |
| `structure-analyzer` | Headings, links, images, anchor text diversity |
| `readability-analyzer` | Flesch, sentence length, passive voice, transitions |
| `technical-analyzer` | URL structure, HTTPS, canonical, hreflang |

### Optional Plugins (Opt-in, loaded by depth/config)

| Plugin | Description | Enable |
|--------|-------------|--------|
| `semantic-analyzer` | TF-IDF, topic coverage, entity extraction, content intent | `depth: 'full'` or explicit |
| `eeat-analyzer` | E-E-A-T signal detection (author, sources, expertise) | `depth: 'full'` or explicit |
| `structured-data-analyzer` | Schema.org JSON-LD validation | `depth: 'full'` or explicit |
| `ux-analyzer` | UX-SEO intersection (scannability, CTA, mobile) | `depth: 'full'` or explicit |
| `competitor-analyzer` | Comparative analysis when competitors provided | Auto when `competitors` input given |
| `snippet-analyzer` | Featured snippet opportunity detection | `depth: 'full'` or explicit |
| `freshness-analyzer` | Content freshness and staleness detection | `depth: 'full'` or explicit |
| `link-strategy-analyzer` | Internal link suggestions when siteContext provided | Auto when `siteContext` input given |

---

## COMPLETE TYPE DEFINITIONS

These are the **exact** TypeScript types to implement. Follow them precisely.

```typescript
// ═══════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════

export interface SeoInput {
  /** Page URL */
  url: string;
  /** Page title (title tag) */
  title: string;
  /** HTML content of the page body */
  content: string;
  /** Primary focus keyword */
  focusKeyword: string;
  /** Secondary keywords */
  secondaryKeywords?: string[];
  /** Meta tags */
  meta?: MetaInput;
  /** JSON-LD structured data */
  structuredData?: Record<string, unknown>[];
  /** Competitor pages for comparison */
  competitors?: CompetitorInput[];
  /** Site context for internal link suggestions */
  siteContext?: SiteContext;
}

export interface MetaInput {
  description?: string;
  canonical?: string;
  robots?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
  og?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
    url?: string;
    siteName?: string;
  };
  twitter?: {
    card?: string;
    title?: string;
    description?: string;
    image?: string;
    site?: string;
  };
  alternates?: {
    hreflang?: Record<string, string>;
  };
}

export interface CompetitorInput {
  url: string;
  title?: string;
  content: string;
  focusKeyword?: string;
}

export interface SiteContext {
  domain: string;
  existingPages: {
    url: string;
    title: string;
    keywords?: string[];
  }[];
}

// ═══════════════════════════════════════════
// CONFIGURATION TYPES
// ═══════════════════════════════════════════

export type Locale = 'en' | 'tr';
export type ProfileName = 'blog' | 'product' | 'landing' | 'news' | 'documentation' | 'ecommerce';
export type AnalysisDepth = 'quick' | 'standard' | 'full';
export type CategoryName = 'content' | 'meta' | 'keyword' | 'semantic' | 'structure' | 'readability' | 'technical' | 'eeat' | 'structuredData' | 'ux';

export interface SeoAnalyzerConfig {
  locale?: Locale;
  profile?: ProfileName | ScoringProfile;
  depth?: AnalysisDepth;
  ai?: AiConfig;
}

export interface AnalyzeOptions {
  depth?: AnalysisDepth;
  categories?: CategoryName[];
}

export interface ScoringProfile {
  name: string;
  weights: Record<CategoryName, number>;  // Must sum to 1.0
}

// ═══════════════════════════════════════════
// REPORT TYPES
// ═══════════════════════════════════════════

export type Grade = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
export type Severity = 'critical' | 'error' | 'warning' | 'info' | 'pass';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Effort = 'quick' | 'medium' | 'significant';

export interface SeoReport {
  /** Overall score 0-100 */
  score: number;
  /** Letter grade */
  grade: Grade;
  /** Category scores */
  categories: Record<CategoryName, CategoryScore>;
  /** All rule results */
  rules: RuleResult[];
  /** Prioritized action items sorted by impact */
  suggestions: Suggestion[];
  /** Raw metrics */
  metrics: SeoMetrics;
  /** SERP preview (desktop + mobile) */
  serpPreview: SerpPreview;
  /** Profile used */
  profile: ScoringProfile;
  /** Analysis depth used */
  depth: AnalysisDepth;
  /** Time taken in ms */
  analysisTimeMs: number;

  // Optional deep analysis results
  competitorAnalysis?: CompetitorAnalysis;
  contentGaps?: ContentGap[];
  snippetOpportunity?: SnippetOpportunity;
  freshness?: FreshnessAnalysis;
  topicMap?: TopicMap;
  linkSuggestions?: LinkSuggestion[];

  // AI enhancement
  aiEnhanced: boolean;
  aiSuggestions?: AiSuggestion[];
  aiRewriteSuggestions?: AiRewriteSuggestion[];
  aiTitleAlternatives?: AiTitleSuggestions;
  aiMetaSuggestion?: AiMetaSuggestion;
  aiSnippetOptimization?: AiSnippetOptimization;
  aiToneAnalysis?: AiToneAnalysis;
  aiContentDetection?: AiContentDetection;
  aiTopicAnalysis?: AiTopicAnalysis;
  aiCompetitorInsights?: AiCompetitorInsights;
  aiSearchIntent?: AiSearchIntentResult;
  aiUsage?: AiUsageReport;
  aiErrors?: AiError[];
}

export interface CategoryScore {
  score: number;
  weight: number;
  grade: Grade;
  passed: number;
  failed: number;
  warnings: number;
  rules: RuleResult[];
  ruleScore?: number;      // Original rule-only score (when AI is active)
  aiScore?: number;        // AI score (when AI is active)
}

export interface RuleResult {
  id: string;
  category: CategoryName;
  severity: Severity;
  message: string;
  score: number;              // 0-100
  weight: number;
  details?: Record<string, unknown>;
  fixSuggestion?: string;
  learnMoreUrl?: string;
}

export interface Suggestion {
  priority: Priority;
  category: CategoryName;
  rule: string;
  action: string;
  impact: number;            // Estimated score improvement
  effort: Effort;
  before?: string;
  after?: string;
}

// ═══════════════════════════════════════════
// METRICS TYPES
// ═══════════════════════════════════════════

export interface SeoMetrics {
  wordCount: number;
  uniqueWordCount: number;
  vocabularyRichness: number;
  sentenceCount: number;
  paragraphCount: number;
  avgWordsPerSentence: number;
  avgWordsPerParagraph: number;
  readingTimeMinutes: number;
  contentDepthScore: number;

  headings: {
    count: Record<string, number>;
    hierarchy: HeadingNode[];
    hasProperNesting: boolean;
    outline: string[];
  };

  links: {
    internal: LinkInfo[];
    external: LinkInfo[];
    total: number;
    internalCount: number;
    externalCount: number;
    nofollowCount: number;
    brokenAnchors: string[];
    anchorTextDistribution: Record<string, number>;
  };

  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    withTitle: number;
    altTexts: string[];
    hasKeywordInAlt: boolean;
    details: ImageInfo[];
  };

  keyword: {
    focus: KeywordMetrics;
    secondary: Record<string, KeywordMetrics>;
  };

  readability: {
    fleschReadingEase: number | null;
    avgSyllablesPerWord: number;
    longSentenceRatio: number;
    shortSentenceRatio: number;
    passiveVoiceRatio: number;
    transitionWordRatio: number;
    consecutiveSentenceStarts: string[];
    sentenceLengthVariance: number;
  };

  semantic: {
    tfidfTopTerms: TfIdfTerm[];
    topicClusters: string[][];
    entityMentions: EntityMention[];
    sentimentScore: number;
    contentType: 'informational' | 'transactional' | 'navigational' | 'commercial';
  };

  technical: {
    urlAnalysis: UrlAnalysis;
    canonicalStatus: 'valid' | 'missing' | 'mismatch';
    robotsDirective: string;
    hreflangTags: Record<string, string>;
  };

  structuredData: {
    types: string[];
    isValid: boolean;
    errors: string[];
    warnings: string[];
    coverage: number;
  };

  eeat: {
    hasAuthor: boolean;
    hasAuthorBio: boolean;
    hasPublishDate: boolean;
    hasModifiedDate: boolean;
    hasSources: boolean;
    sourceCount: number;
    hasExpertiseSignals: boolean;
    trustSignals: string[];
    experienceSignals: string[];
  };
}

export interface HeadingNode {
  level: number;
  text: string;
  children: HeadingNode[];
  wordCountUnder: number;
}

export interface LinkInfo {
  href: string;
  anchor: string;
  rel?: string;
  isExternal: boolean;
  isEmpty: boolean;
}

export interface ImageInfo {
  src: string;
  alt: string;
  title?: string;
  hasKeyword: boolean;
  isDecorative: boolean;
}

export interface KeywordMetrics {
  keyword: string;
  count: number;
  density: number;
  prominence: number;
  inTitle: boolean;
  inMetaDescription: boolean;
  inH1: boolean;
  inH2: boolean;
  inFirstParagraph: boolean;
  inLastParagraph: boolean;
  inUrl: boolean;
  inImageAlt: boolean;
  distribution: number[];
  isStuffed: boolean;
}

export interface TfIdfTerm {
  term: string;
  tfidf: number;
  frequency: number;
  isKeyword: boolean;
}

export interface EntityMention {
  text: string;
  type: 'person' | 'organization' | 'place' | 'product' | 'concept' | 'date' | 'number';
  count: number;
  positions: number[];
}

export interface UrlAnalysis {
  full: string;
  protocol: string;
  domain: string;
  path: string;
  slug: string;
  depth: number;
  length: number;
  hasTrailingSlash: boolean;
  hasParams: boolean;
  hasHash: boolean;
  hasUnderscore: boolean;
  isKebabCase: boolean;
  containsNumbers: boolean;
  containsKeyword: boolean;
  isClean: boolean;
}

// ═══════════════════════════════════════════
// SERP TYPES
// ═══════════════════════════════════════════

export interface SerpPreview {
  desktop: {
    title: { text: string; truncated: boolean; pixelWidth: number; maxPixels: 580 };
    url: { display: string; breadcrumbs: string[] };
    description: { text: string; truncated: boolean; charCount: number };
  };
  mobile: {
    title: { text: string; truncated: boolean; pixelWidth: number; maxPixels: 920 };
    url: { display: string; breadcrumbs: string[] };
    description: { text: string; truncated: boolean; charCount: number };
  };
  richResult?: {
    type: 'article' | 'faq' | 'howto' | 'review' | 'breadcrumb';
    eligible: boolean;
    missingFields: string[];
  };
}

// ═══════════════════════════════════════════
// COMPETITOR & CONTENT GAP TYPES
// ═══════════════════════════════════════════

export interface CompetitorAnalysis {
  overallComparison: {
    yourScore: number;
    avgCompetitorScore: number;
    ranking: number;
  };
  categoryComparison: Record<string, { yours: number; best: number; avg: number; gap: number }>;
  advantages: string[];
  disadvantages: string[];
  uniqueTopics: {
    onlyYours: string[];
    onlyCompetitors: string[];
    shared: string[];
  };
}

export interface ContentGap {
  topic: string;
  importance: 'high' | 'medium' | 'low';
  foundInCompetitors: number;
  suggestedSection: string;
  suggestedWordCount: number;
}

export interface SnippetOpportunity {
  eligible: boolean;
  type: 'paragraph' | 'list' | 'table' | 'definition' | null;
  currentContent?: string;
  optimization: string;
  confidence: number;
}

export interface FreshnessAnalysis {
  publishAge: number;
  lastModifiedAge: number;
  hasFreshSignals: boolean;
  dateReferences: string[];
  staleness: 'fresh' | 'current' | 'aging' | 'stale' | 'outdated';
  suggestion?: string;
}

export interface TopicMap {
  primaryTopic: string;
  subtopics: {
    topic: string;
    coverage: 'deep' | 'mentioned' | 'missing';
    wordCount: number;
    relevanceScore: number;
  }[];
  topicDepthScore: number;
  breadthScore: number;
}

export interface LinkSuggestion {
  type: 'internal' | 'missing-anchor';
  from: string;
  suggestedUrl: string;
  suggestedAnchor: string;
  reason: string;
}

// ═══════════════════════════════════════════
// RULE ENGINE TYPES
// ═══════════════════════════════════════════

export interface SeoRule {
  /** Unique rule ID (kebab-case) */
  id: string;
  /** Category this rule belongs to */
  category: CategoryName;
  /** Default weight 0-1 */
  defaultWeight: number;
  /** Evaluate function */
  evaluate: (ctx: AnalysisContext) => RuleResult;
}

export interface AnalysisContext {
  /** Original input */
  input: SeoInput;
  /** Parsed HTML data */
  parsed: ParsedHtml;
  /** Plain text (tags stripped) */
  text: string;
  /** Tokenized words */
  words: string[];
  /** Tokenized sentences */
  sentences: string[];
  /** Locale */
  locale: Locale;
  /** Translation function */
  t: (key: string, params?: Record<string, unknown>) => string;
  /** Stopwords set for current locale */
  stopwords: Set<string>;
  /** Extra metadata (plugins can add data here) */
  meta: Record<string, unknown>;
}

export interface ParsedHtml {
  headings: { level: number; text: string }[];
  paragraphs: string[];
  links: { href: string; text: string; rel?: string; isExternal: boolean }[];
  images: { src: string; alt?: string; title?: string }[];
  lists: { type: 'ordered' | 'unordered'; items: string[] }[];
  tables: { rows: number; columns: number }[];
  plainText: string;
  meta?: Record<string, string>;
}

// ═══════════════════════════════════════════
// AI TYPES
// ═══════════════════════════════════════════

export interface AiConfig {
  /** Provider configuration */
  provider: AiProviderConfig;
  /** Which AI features to enable */
  features: AiFeatureFlags;
  /** Budget controls */
  budget?: AiBudgetConfig;
  /** Weight of AI scores in final score (0-1, default: 0.30) */
  weight?: number;
  /** Error handling strategy */
  onError?: 'fallback-to-rules' | 'throw' | 'partial';
}

export interface AiProviderConfig {
  baseUrl: string;
  apiKey: string;
  model: string;
  maxTokens?: number;
  temperature?: number;
  timeout?: number;
  headers?: Record<string, string>;
  retries?: number;
  retryDelayMs?: number;
}

export interface AiFeatureFlags {
  contentQuality?: boolean;
  semanticRelevance?: boolean;
  searchIntent?: boolean;
  rewriteSuggestions?: boolean;
  titleSuggestions?: boolean;
  metaGeneration?: boolean;
  snippetOptimization?: boolean;
  toneAnalysis?: boolean;
  competitorInsights?: boolean;
  topicGaps?: boolean;
  aiContentDetection?: boolean;
}

export interface AiBudgetConfig {
  maxCallsPerAnalysis?: number;       // Default: 5
  maxTokensPerAnalysis?: number;      // Default: 8000
  cacheResults?: boolean;             // Default: true
  cacheTtlMs?: number;               // Default: 3600000 (1 hour)
}

// AI Response Types

export interface AiContentQuality {
  scores: {
    depth: number;
    originality: number;
    actionability: number;
    engagement: number;
    accuracy: number;
    structure: number;
  };
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: string[];
}

export interface AiSearchIntentResult {
  detectedIntent: 'informational' | 'transactional' | 'navigational' | 'commercial';
  contentMatchScore: number;
  expectedContentType: string;
  missingElements: string[];
  serpExpectation: string;
}

export interface AiRewriteSuggestion {
  target: 'title' | 'meta_description' | 'h1' | 'intro' | 'paragraph' | 'conclusion';
  original: string;
  suggestions: {
    text: string;
    reasoning: string;
    estimatedImpact: 'high' | 'medium' | 'low';
  }[];
}

export interface AiTitleSuggestions {
  alternatives: {
    title: string;
    pixelWidth: number;
    strategy: string;
    ctrPrediction: 'high' | 'medium' | 'low';
  }[];
}

export interface AiMetaSuggestion {
  description: string;
  charCount: number;
  includesKeyword: boolean;
  includesCta: boolean;
  reasoning: string;
}

export interface AiSnippetOptimization {
  currentEligibility: number;
  bestFormat: 'paragraph' | 'list' | 'table' | 'definition';
  optimizedContent: string;
  placement: string;
  targetQuery: string;
}

export interface AiToneAnalysis {
  primaryTone: string;
  formality: number;
  confidence: number;
  friendliness: number;
  expertise: number;
  consistency: number;
  audienceMatch: {
    target: string;
    matchScore: number;
    suggestion?: string;
  };
}

export interface AiContentDetection {
  aiProbability: number;
  humanProbability: number;
  indicators: {
    signal: string;
    confidence: number;
    location?: string;
  }[];
  humanizationTips: string[];
}

export interface AiTopicAnalysis {
  topicAuthority: number;
  coveredSubtopics: {
    topic: string;
    depth: 'comprehensive' | 'adequate' | 'superficial';
  }[];
  missingSubtopics: {
    topic: string;
    importance: 'essential' | 'recommended' | 'nice-to-have';
    suggestedHeading: string;
    suggestedContent: string;
  }[];
  relatedQuestions: string[];
  internalLinkOpportunities: {
    anchor: string;
    suggestedTopic: string;
    reason: string;
  }[];
}

export interface AiCompetitorInsights {
  competitivePosition: string;
  uniqueAngle: string;
  contentGaps: {
    topic: string;
    importance: 'critical' | 'high' | 'medium';
    suggestedApproach: string;
    estimatedWordCount: number;
  }[];
  structuralAdvice: string;
  winningStrategy: string;
}

export type AiSuggestion = Suggestion;

export interface AiUsageReport {
  totalCalls: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  totalLatencyMs: number;
  model: string;
  cached: boolean;
  cost: { estimatedUsd: number; model: string };
}

export interface AiError {
  feature: string;
  message: string;
  code?: string;
}

// ═══════════════════════════════════════════
// COMPARE TYPES
// ═══════════════════════════════════════════

export interface ReportDiff {
  scoreDelta: number;
  gradeBefore: Grade;
  gradeAfter: Grade;
  improved: string[];      // Rule IDs that improved
  regressed: string[];     // Rule IDs that regressed
  unchanged: string[];     // Rule IDs unchanged
  categoryDeltas: Record<CategoryName, number>;
}
```

---

## COMPLETE RULE SPECIFICATIONS

### Content Rules (12)

| # | Rule ID | What It Checks | Scoring Logic |
|---|---------|-----------------|---------------|
| 1 | `content-word-count` | Minimum word count | <300: 0, 300-600: 50, 600-1500: 80, 1500-2500: 100, >4000: 80 |
| 2 | `content-unique-words` | Vocabulary richness (unique/total) | <0.3: 30, 0.3-0.5: 70, >0.5: 100 |
| 3 | `content-paragraph-length` | Words per paragraph | >200: 30, 150-200: 60, 50-150: 100, <50: 80 |
| 4 | `content-paragraph-count` | Sufficient paragraphs | <3: 40, 3-5: 70, >5: 100 |
| 5 | `content-reading-time` | Reading time appropriateness | <2m: 50, 2-5m: 80, 5-15m: 100, >15m: 70 |
| 6 | `content-intro-quality` | First paragraph quality (hook) | ≥40 words, contains keyword, has question or hook |
| 7 | `content-conclusion` | Conclusion paragraph presence | Has CTA or summary |
| 8 | `content-duplicate-content` | Intra-content repetition | Repeated 3+ word n-grams |
| 9 | `content-list-usage` | Bullet/numbered list usage | ≥1 list present (boosts engagement) |
| 10 | `content-table-usage` | Table usage for data content | Table present when data-heavy |
| 11 | `content-media-ratio` | Media-to-text ratio | ≥1 image per 300 words |
| 12 | `content-depth-score` | Content depth (headings × words) | Compound score of subtopic depth |

### Meta Rules (15)

| # | Rule ID | What It Checks | Scoring Logic |
|---|---------|-----------------|---------------|
| 1 | `meta-title-length` | **Pixel-based** title length | 285-580px: 100 (not character count!) |
| 2 | `meta-title-keyword-position` | Keyword near title start | First 1/3: 100, middle: 70, end: 40 |
| 3 | `meta-title-power-words` | Power words (Guide, Best, How to) | ≥1 power word: bonus |
| 4 | `meta-title-number` | Contains number ([2025], Top 10) | Number present: bonus |
| 5 | `meta-title-unique-words` | No repeated words in title | 80%+ unique: 100 |
| 6 | `meta-title-branding` | Brand separator format | " \| Brand" or " - Brand" |
| 7 | `meta-description-length` | Description character count | 120-160: 100 |
| 8 | `meta-description-keyword` | Keyword in description | Present: 100, Absent: 30 |
| 9 | `meta-description-cta` | Has call-to-action | "Learn", "Discover", etc. |
| 10 | `meta-description-unique` | Not same as title | Different: 100 |
| 11 | `meta-og-complete` | OG tag completeness | title + desc + image + type |
| 12 | `meta-og-image-size` | OG image size recommendation | Recommends 1200×630 |
| 13 | `meta-twitter-complete` | Twitter card completeness | card + title + desc |
| 14 | `meta-canonical-valid` | Canonical URL correctness | Present + matches URL |
| 15 | `meta-robots-valid` | Robots meta directive | index,follow check |

### Keyword Rules (14)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `keyword-density` | 1-3% ideal density |
| 2 | `keyword-in-title` | Focus keyword in title |
| 3 | `keyword-in-meta-desc` | Keyword in description |
| 4 | `keyword-in-h1` | Keyword in H1 |
| 5 | `keyword-in-h2` | Keyword in at least one H2 |
| 6 | `keyword-in-url` | Keyword in URL slug |
| 7 | `keyword-in-first-100` | Keyword in first 100 words |
| 8 | `keyword-in-last-100` | Keyword in last 100 words |
| 9 | `keyword-in-image-alt` | Keyword in at least one image alt |
| 10 | `keyword-distribution` | Even distribution throughout content |
| 11 | `keyword-stuffing` | Over-optimization detection (>4%) |
| 12 | `keyword-prominence` | Position-weighted importance score |
| 13 | `keyword-secondary-usage` | Secondary keywords used |
| 14 | `keyword-variation` | Keyword variations (plural, synonym) |

### Semantic Rules (8)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `semantic-topic-coverage` | How comprehensively the main topic is covered |
| 2 | `semantic-subtopic-depth` | Depth of subtopic treatment |
| 3 | `semantic-tfidf-relevance` | TF-IDF keyword-content alignment |
| 4 | `semantic-entity-richness` | Entity variety in content |
| 5 | `semantic-content-intent` | Content matches search intent type |
| 6 | `semantic-lsi-keywords` | Related/LSI terms present |
| 7 | `semantic-topic-clustering` | Topical coherence between sections |
| 8 | `semantic-competitor-coverage` | Covers topics competitors cover |

### Structure Rules (12)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `structure-h1-single` | Exactly 1 H1 tag |
| 2 | `structure-h1-keyword` | Keyword in H1 |
| 3 | `structure-heading-hierarchy` | Proper nesting (h1→h2→h3, no skips) |
| 4 | `structure-heading-frequency` | ≥1 subheading per 300 words |
| 5 | `structure-heading-length` | Heading length (5-70 chars) |
| 6 | `structure-heading-keyword-stuffing` | No keyword stuffing in headings |
| 7 | `structure-internal-links` | ≥3 internal links |
| 8 | `structure-external-links` | ≥1 external link to authority source |
| 9 | `structure-broken-anchors` | No empty/broken anchor texts |
| 10 | `structure-anchor-diversity` | Anchor text variety |
| 11 | `structure-image-alt` | 100% images have alt text |
| 12 | `structure-image-keyword-alt` | ≥1 image alt contains keyword |

### Readability Rules (12)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `readability-flesch-score` | Flesch reading ease (60-80 ideal) |
| 2 | `readability-avg-sentence-length` | Average sentence length (15-25 words) |
| 3 | `readability-long-sentences` | Long sentence ratio (<25% over 25 words) |
| 4 | `readability-short-sentences` | Short sentence variety |
| 5 | `readability-sentence-variance` | Sentence length variety (monotony check) |
| 6 | `readability-passive-voice` | Passive voice ratio (<10%) |
| 7 | `readability-transition-words` | Transition word usage (>30%) |
| 8 | `readability-consecutive-starts` | Consecutive same-word sentence starts |
| 9 | `readability-adverb-overuse` | Excessive adverb usage |
| 10 | `readability-complex-words` | Complex word ratio (3+ syllables) |
| 11 | `readability-paragraph-variety` | Paragraph length variety |
| 12 | `readability-engagement-hooks` | Questions, exclamations, direct address |

### Technical Rules (10)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `technical-url-length` | URL length (≤75 chars) |
| 2 | `technical-url-slug-format` | Kebab-case clean slug |
| 3 | `technical-url-keyword` | Keyword in URL |
| 4 | `technical-url-depth` | URL depth (≤3 levels) |
| 5 | `technical-url-no-params` | No unnecessary query params |
| 6 | `technical-url-no-underscore` | No underscores in URL |
| 7 | `technical-https` | HTTPS usage |
| 8 | `technical-canonical` | Canonical URL set correctly |
| 9 | `technical-hreflang` | Hreflang tags for multilingual |
| 10 | `technical-trailing-slash` | Trailing slash consistency |

### E-E-A-T Rules (10)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `eeat-author-present` | Author information present |
| 2 | `eeat-author-bio` | Author bio/about present |
| 3 | `eeat-publish-date` | Publish date specified |
| 4 | `eeat-modified-date` | Last modified date specified |
| 5 | `eeat-sources-cited` | External source references (outbound links) |
| 6 | `eeat-source-quality` | Reference quality (domain authority heuristic) |
| 7 | `eeat-experience-signals` | Personal experience phrases ("I tested", "I used") |
| 8 | `eeat-expertise-depth` | Technical terms, topic depth |
| 9 | `eeat-trust-signals` | HTTPS, contact info, about page reference |
| 10 | `eeat-freshness` | Content freshness signals |

### Structured Data Rules (8)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `sd-exists` | Structured data present |
| 2 | `sd-type-appropriate` | Schema type matches page type |
| 3 | `sd-article-complete` | Article schema completeness |
| 4 | `sd-breadcrumb` | BreadcrumbList present |
| 5 | `sd-faq-valid` | FAQ schema validity |
| 6 | `sd-howto-valid` | HowTo schema validity |
| 7 | `sd-image-object` | ImageObject defined |
| 8 | `sd-no-errors` | No schema validation errors |

### UX-SEO Rules (6)

| # | Rule ID | What It Checks |
|---|---------|-----------------|
| 1 | `ux-toc-present` | Table of contents (>2000 words) |
| 2 | `ux-cta-present` | Call-to-action present |
| 3 | `ux-content-scannable` | Scannability (bold, list, heading ratio) |
| 4 | `ux-above-fold-content` | Valuable content in first 200 words |
| 5 | `ux-link-density` | Link/text ratio (too many links = spam) |
| 6 | `ux-mobile-paragraph-length` | Mobile-friendly paragraph length (≤100 words) |

---

## SCORING PROFILES

| Category | Blog | Product | Landing | News | Docs | E-commerce |
|----------|------|---------|---------|------|------|------------|
| content | 0.20 | 0.10 | 0.10 | 0.20 | 0.25 | 0.10 |
| meta | 0.10 | 0.15 | 0.15 | 0.10 | 0.05 | 0.15 |
| keyword | 0.15 | 0.20 | 0.15 | 0.10 | 0.10 | 0.25 |
| semantic | 0.15 | 0.05 | 0.05 | 0.15 | 0.15 | 0.05 |
| structure | 0.08 | 0.10 | 0.10 | 0.08 | 0.15 | 0.10 |
| readability | 0.15 | 0.10 | 0.15 | 0.15 | 0.10 | 0.05 |
| technical | 0.05 | 0.10 | 0.10 | 0.05 | 0.05 | 0.10 |
| eeat | 0.05 | 0.05 | 0.05 | 0.10 | 0.05 | 0.05 |
| structuredData | 0.04 | 0.10 | 0.05 | 0.05 | 0.05 | 0.10 |
| ux | 0.03 | 0.05 | 0.10 | 0.02 | 0.05 | 0.05 |
| **TOTAL** | **1.00** | **1.00** | **1.00** | **1.00** | **1.00** | **1.00** |

### Grade Mapping

| Score | Grade |
|-------|-------|
| 95-100 | A+ |
| 85-94 | A |
| 75-84 | B+ |
| 65-74 | B |
| 55-64 | C+ |
| 45-54 | C |
| 30-44 | D |
| 0-29 | F |

---

## AI ENGINE SPECIFICATIONS

### AI Client (Zero-Dependency, OpenAI-Compatible)

The AI client uses **native `fetch`** (Node 18+). No SDK needed.

**Request format:** OpenAI Chat Completions API (`/chat/completions`)

```typescript
// All AI calls go through this single endpoint format
POST {baseUrl}/chat/completions
Headers: { Authorization: Bearer {apiKey}, Content-Type: application/json }
Body: { model, messages, max_tokens, temperature }
```

**Built-in features:**
- LRU cache (configurable TTL, default 1 hour)
- Retry with exponential backoff (configurable retries, default 2)
- Rate limiter (configurable calls/tokens per analysis)
- Token estimation without tiktoken (char/token ratio: EN ~4, TR ~3.5)
- JSON response parsing with markdown fence stripping
- AbortSignal timeout (configurable, default 15s)

### Provider Presets

Each provider preset returns an `AiProviderConfig` with correct `baseUrl`:

| Provider | baseUrl |
|----------|---------|
| `openai` | `https://api.openai.com/v1` |
| `anthropic` | `https://api.anthropic.com/v1` |
| `gemini` | `https://generativelanguage.googleapis.com/v1beta/openai` |
| `ollama` | `http://localhost:11434/v1` |
| `openrouter` | `https://openrouter.ai/api/v1` |
| `groq` | `https://api.groq.com/openai/v1` |
| `together` | `https://api.together.xyz/v1` |
| `custom` | User-specified |

### AI Orchestrator — Smart Batching

The orchestrator minimizes API calls using 3 strategies:

1. **Mega Prompt** (1 call) — When ≤4 features active and content < 4000 estimated tokens. Combines all analyses into a single prompt.
2. **Grouped Calls** (2-3 calls) — Groups related features and runs in parallel:
   - Group A: contentQuality + toneAnalysis + aiContentDetection
   - Group B: semanticRelevance + searchIntent + topicGaps
   - Group C: titleSuggestions + metaGeneration + snippetOptimization + rewriteSuggestions
   - Group D: competitorInsights (only when competitors provided)
3. **Priority-based** (budget-limited) — When budget is tight, runs highest-impact features first.

### Score Merger

```
finalScore = (ruleScore × (1 - aiWeight)) + (aiScore × aiWeight)
```

Default aiWeight: 0.30. Configurable per-category via `categoryOverrides`.

### AI Prompts

Each AI feature has a dedicated prompt template. All prompts:
- Include locale-aware system prompt
- Request JSON-only output (no markdown, no preamble)
- Include content metadata (URL, keyword, locale)
- Are designed for consistent, parseable responses

### Cost Estimation

Built-in approximate cost calculation per model:

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|----------------------|
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-4o | $2.50 | $10.00 |
| claude-sonnet-4-5 | $3.00 | $15.00 |
| llama-3.1-70b | $0.59 | $0.79 |

Cost table is extensible — unknown models get default pricing.

### Graceful Degradation

| `onError` setting | Behavior |
|---|---|
| `'fallback-to-rules'` (default) | AI fails → return rule-only scores, `aiEnhanced: false` |
| `'partial'` | Include successful AI results, skip failed ones, populate `aiErrors[]` |
| `'throw'` | Throw `AiClientError` on any AI failure |

---

## LOCALE SYSTEM

Each locale file provides:
- **Messages**: All rule result messages with interpolation (`{{len}}`, `{{count}}`)
- **Stop words**: Language-specific stop word list (~200 words)
- **Transition words**: Language-specific transition words/phrases (~100 items)
- **Power words**: Title power words for the locale
- **Passive voice patterns**: Regex patterns for passive detection
- **Syllable rules**: Syllable counting rules for Flesch score

### Supported Locales
- `en` — English (default)
- `tr` — Turkish (first-class support)

Locale is used for: NLP processing, rule messages, stemming, readability scoring, power word detection.

---

## TECHNICAL REQUIREMENTS

| Requirement | Value |
|-------------|-------|
| Runtime | Node.js (universal — no DOM dependency) |
| Module Format | ESM + CJS (dual) |
| Node.js Version | >= 18 (native fetch required for AI) |
| TypeScript Version | >= 5.0 |
| Bundle Size (core) | < 5KB gzipped |
| Bundle Size (all plugins) | < 15KB gzipped |

---

## PROJECT STRUCTURE

```
seo/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── index.ts                     # Public API exports
│   ├── kernel.ts                    # Micro kernel core
│   ├── types.ts                     # All type definitions
│   ├── errors.ts                    # Custom error classes
│   │
│   ├── core/
│   │   ├── analyzer.ts              # createSeoAnalyzer factory
│   │   ├── scorer.ts                # Weighted scoring engine
│   │   ├── pipeline.ts              # Analysis pipeline orchestrator
│   │   └── context.ts               # AnalysisContext builder
│   │
│   ├── parsers/
│   │   ├── html.parser.ts           # Regex-based HTML parser
│   │   ├── text.extractor.ts        # HTML → clean text
│   │   ├── url.parser.ts            # URL structure analysis
│   │   ├── structured-data.parser.ts # JSON-LD parser
│   │   └── sentence.tokenizer.ts    # Sentence/word tokenization
│   │
│   ├── nlp/
│   │   ├── tokenizer.ts             # Word tokenization
│   │   ├── stemmer.ts               # TR + EN stemmers
│   │   ├── stopwords.ts             # Stop word lists
│   │   ├── tfidf.ts                 # TF-IDF calculation
│   │   ├── similarity.ts            # Cosine similarity
│   │   ├── sentiment.ts             # Simple sentiment analysis
│   │   ├── entity.extractor.ts      # Heuristic entity extraction
│   │   ├── syllable.counter.ts      # Syllable counting (Flesch)
│   │   ├── passive.detector.ts      # Passive voice detection
│   │   └── transition.detector.ts   # Transition word detection
│   │
│   ├── serp/
│   │   ├── title.truncator.ts       # Pixel-based title truncation
│   │   ├── description.truncator.ts # Description truncation
│   │   ├── url.formatter.ts         # Google URL display format
│   │   ├── rich-result.checker.ts   # Rich result eligibility
│   │   └── char-width.map.ts        # Character pixel widths (Arial 20px)
│   │
│   ├── analyzers/
│   │   ├── content.analyzer.ts
│   │   ├── meta.analyzer.ts
│   │   ├── keyword.analyzer.ts
│   │   ├── semantic.analyzer.ts
│   │   ├── structure.analyzer.ts
│   │   ├── readability.analyzer.ts
│   │   ├── technical.analyzer.ts
│   │   ├── eeat.analyzer.ts
│   │   ├── structured-data.analyzer.ts
│   │   ├── ux.analyzer.ts
│   │   ├── competitor.analyzer.ts
│   │   ├── snippet.analyzer.ts
│   │   ├── freshness.analyzer.ts
│   │   └── link-strategy.analyzer.ts
│   │
│   ├── rules/
│   │   ├── registry.ts              # Rule registry + custom rule API
│   │   ├── content.rules.ts         # 12 rules
│   │   ├── meta.rules.ts            # 15 rules
│   │   ├── keyword.rules.ts         # 14 rules
│   │   ├── semantic.rules.ts        # 8 rules
│   │   ├── structure.rules.ts       # 12 rules
│   │   ├── readability.rules.ts     # 12 rules
│   │   ├── technical.rules.ts       # 10 rules
│   │   ├── eeat.rules.ts            # 10 rules
│   │   ├── structured-data.rules.ts # 8 rules
│   │   └── ux.rules.ts              # 6 rules
│   │
│   ├── ai/
│   │   ├── client/
│   │   │   ├── ai-client.ts         # OpenAI-compatible HTTP client
│   │   │   ├── providers.ts         # Provider preset factories
│   │   │   ├── retry.ts             # Retry + exponential backoff
│   │   │   ├── rate-limiter.ts      # Token/call rate limiting
│   │   │   └── cache.ts             # LRU cache
│   │   ├── prompts/
│   │   │   ├── system.prompts.ts    # System prompts (locale-aware)
│   │   │   ├── content-quality.prompt.ts
│   │   │   ├── semantic.prompt.ts
│   │   │   ├── search-intent.prompt.ts
│   │   │   ├── rewrite.prompt.ts
│   │   │   ├── title.prompt.ts
│   │   │   ├── meta.prompt.ts
│   │   │   ├── snippet.prompt.ts
│   │   │   ├── tone.prompt.ts
│   │   │   ├── competitor.prompt.ts
│   │   │   ├── topic-gap.prompt.ts
│   │   │   └── ai-detection.prompt.ts
│   │   ├── analyzers/
│   │   │   ├── ai-content-quality.ts
│   │   │   ├── ai-semantic.ts
│   │   │   ├── ai-search-intent.ts
│   │   │   ├── ai-rewrite.ts
│   │   │   ├── ai-title.ts
│   │   │   ├── ai-meta.ts
│   │   │   ├── ai-snippet.ts
│   │   │   ├── ai-tone.ts
│   │   │   ├── ai-competitor.ts
│   │   │   ├── ai-topic-gap.ts
│   │   │   └── ai-detection.ts
│   │   ├── orchestrator.ts          # Smart batching orchestrator
│   │   ├── score-merger.ts          # Rule + AI score merger
│   │   ├── token-estimator.ts       # Token count estimation
│   │   └── types.ts                 # AI-specific internal types
│   │
│   ├── locales/
│   │   ├── types.ts                 # Locale interface
│   │   ├── en.ts                    # English
│   │   └── tr.ts                    # Turkish
│   │
│   ├── profiles/
│   │   ├── types.ts                 # Profile interface
│   │   ├── blog.ts
│   │   ├── product.ts
│   │   ├── landing.ts
│   │   ├── news.ts
│   │   ├── documentation.ts
│   │   └── ecommerce.ts
│   │
│   ├── compare/
│   │   ├── diff.ts                  # Two-report comparison
│   │   ├── trend.ts                 # Time series trend analysis
│   │   └── benchmark.ts             # Industry benchmarks
│   │
│   ├── formatters/
│   │   ├── json.formatter.ts
│   │   ├── html.formatter.ts
│   │   ├── markdown.formatter.ts
│   │   └── csv.formatter.ts
│   │
│   └── plugins/
│       ├── plugin.interface.ts      # Plugin hook definitions
│       └── built-in/
│           ├── ai-content.plugin.ts
│           └── competitor-gap.plugin.ts
│
├── tests/
│   ├── unit/
│   │   ├── parsers/
│   │   ├── nlp/
│   │   ├── serp/
│   │   ├── rules/
│   │   ├── analyzers/
│   │   ├── ai/
│   │   ├── locales/
│   │   ├── profiles/
│   │   ├── compare/
│   │   └── formatters/
│   ├── integration/
│   │   ├── full-analysis.test.ts
│   │   ├── ai-integration.test.ts
│   │   ├── competitor-analysis.test.ts
│   │   └── batch-analysis.test.ts
│   └── fixtures/
│       ├── sample-blog.html
│       ├── sample-product.html
│       ├── sample-competitor.html
│       └── ai-mock-responses.json
│
├── examples/
│   ├── 01-basic/
│   │   ├── simple-analysis.ts
│   │   ├── with-meta.ts
│   │   └── quick-scan.ts
│   ├── 02-plugins/
│   │   ├── custom-rule.ts
│   │   ├── custom-plugin.ts
│   │   └── disable-category.ts
│   ├── 03-ai/
│   │   ├── openai-basic.ts
│   │   ├── ollama-local.ts
│   │   ├── openrouter.ts
│   │   └── all-features.ts
│   ├── 04-competitor/
│   │   ├── basic-comparison.ts
│   │   └── content-gap.ts
│   ├── 05-advanced/
│   │   ├── batch-analysis.ts
│   │   ├── report-diff.ts
│   │   ├── custom-profile.ts
│   │   └── selective-categories.ts
│   └── 06-real-world/
│       ├── blog-optimization.ts
│       ├── ecommerce-page.ts
│       └── ci-integration.ts
│
├── website/
│   ├── public/
│   │   ├── CNAME                    # seo.oxog.dev
│   │   └── llms.txt
│   ├── src/
│   └── ...
│
├── llms.txt
├── SPECIFICATION.md
├── IMPLEMENTATION.md
├── TASKS.md
├── README.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── .gitignore
```

---

## CONFIG FILES

### package.json

```json
{
  "name": "@oxog/seo",
  "version": "1.0.0",
  "description": "Zero-dependency, AI-enhanced on-page SEO scoring engine with 107 rules, semantic analysis, and OpenAI-compatible provider support",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    },
    "./plugins": {
      "import": {
        "types": "./dist/plugins/index.d.ts",
        "default": "./dist/plugins/index.js"
      },
      "require": {
        "types": "./dist/plugins/index.d.cts",
        "default": "./dist/plugins/index.cjs"
      }
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run build && npm run test:coverage"
  },
  "keywords": [
    "seo",
    "seo-analysis",
    "on-page-seo",
    "seo-scoring",
    "content-optimization",
    "keyword-analysis",
    "serp-preview",
    "structured-data",
    "eeat",
    "typescript",
    "zero-dependency",
    "ai-enhanced"
  ],
  "author": "Ersin Koç",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ersinkoc/seo.git"
  },
  "bugs": {
    "url": "https://github.com/ersinkoc/seo/issues"
  },
  "homepage": "https://seo.oxog.dev",
  "engines": {
    "node": ">=18"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^2.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noEmit": true,
    "declaration": true,
    "declarationMap": true,
    "esModuleInterop": true,
    "moduleResolution": "bundler",
    "target": "ES2022",
    "module": "ESNext",
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests", "website", "examples"]
}
```

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/plugins/plugin.interface.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'website/', 'examples/', '*.config.*'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100,
      },
    },
  },
});
```

---

## GITHUB ACTIONS

Single workflow file: `.github/workflows/deploy.yml`

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Build package
        run: npm run build

      - name: Build website
        working-directory: ./website
        run: |
          npm ci
          npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './website/dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## IMPLEMENTATION CHECKLIST

### Before Starting
- [ ] Create SPECIFICATION.md with complete spec
- [ ] Create IMPLEMENTATION.md with architecture
- [ ] Create TASKS.md with ordered task list
- [ ] All three documents reviewed and complete

### Phase 1: Core (MVP)
- [ ] Kernel + plugin registry + event bus
- [ ] HTML parser (regex-based) + text extractor
- [ ] URL parser
- [ ] Sentence/word tokenizer
- [ ] Content analyzer + 12 rules
- [ ] Meta analyzer + 15 rules (pixel-based title!)
- [ ] Keyword analyzer + 14 rules
- [ ] Technical analyzer + 10 rules
- [ ] Basic readability rules (first 6)
- [ ] Structure analyzer + 12 rules
- [ ] SERP pixel simulation (char-width map, truncation)
- [ ] Scoring engine (weighted, profile-based)
- [ ] TR + EN locale files
- [ ] 6 scoring profiles
- [ ] JSON formatter
- [ ] createSeoAnalyzer factory
- [ ] analyzeSync method
- [ ] Custom rule API (addRule)

### Phase 2: Deep Analysis
- [ ] NLP tokenizer + stemmer (TR + EN)
- [ ] Stop words (TR + EN)
- [ ] TF-IDF calculation
- [ ] Cosine similarity
- [ ] Entity extraction (heuristic)
- [ ] Sentiment analysis (basic)
- [ ] Syllable counter (TR + EN)
- [ ] Flesch readability score
- [ ] Passive voice detector (TR + EN)
- [ ] Transition word detector (TR + EN)
- [ ] Semantic analyzer + 8 rules
- [ ] Full readability rules (all 12)
- [ ] E-E-A-T analyzer + 10 rules
- [ ] Structured data parser + analyzer + 8 rules
- [ ] UX analyzer + 6 rules
- [ ] Competitor analyzer
- [ ] Content gap analysis
- [ ] Featured snippet analyzer
- [ ] Freshness analyzer
- [ ] Link strategy analyzer
- [ ] Topic map generation

### Phase 3: AI Layer
- [ ] AI client (fetch-based, OpenAI-compatible)
- [ ] Provider presets (openai, anthropic, gemini, ollama, openrouter, groq, together, custom)
- [ ] LRU cache
- [ ] Retry with exponential backoff
- [ ] Rate limiter
- [ ] Token estimator
- [ ] 11 AI prompt templates
- [ ] 11 AI analyzers
- [ ] AI orchestrator (mega/grouped/priority strategies)
- [ ] Score merger (rule + AI)
- [ ] Cost estimator
- [ ] Graceful degradation (fallback/partial/throw)
- [ ] async analyze() method

### Phase 4: Ecosystem
- [ ] Compare/diff engine
- [ ] Trend analysis
- [ ] HTML formatter (self-contained report)
- [ ] Markdown formatter
- [ ] CSV formatter (batch)
- [ ] Plugin system (SeoPlugin interface + hooks)
- [ ] Built-in plugins (ai-content, competitor-gap)
- [ ] Batch analysis support
- [ ] Selective category analysis
- [ ] llms.txt
- [ ] README.md
- [ ] 18+ examples across 6 categories
- [ ] Documentation website (React + Vite)
- [ ] CHANGELOG.md

### Final Verification
- [ ] `npm run build` succeeds
- [ ] `npm run test:coverage` shows 100%
- [ ] No TypeScript errors
- [ ] All examples run successfully
- [ ] Website builds without errors
- [ ] README is complete and accurate

---

## BEGIN IMPLEMENTATION

Start by creating **SPECIFICATION.md** with the complete package specification based on everything above.

Then create **IMPLEMENTATION.md** with architecture decisions.

Then create **TASKS.md** with ordered, numbered tasks.

Only after all three documents are complete, begin implementing code by following TASKS.md sequentially.

**Remember:**
- This package will be published to npm
- It must be production-ready
- Zero runtime dependencies — implement HTML parser, NLP, HTTP client, LRU cache from scratch
- 100% test coverage — mock fetch for AI tests
- Professionally documented with JSDoc + @example
- LLM-native design
- Beautiful documentation website at seo.oxog.dev

export type DocSection = {
  id: string;
  title: string;
  body: string[];
  bullets?: string[];
  code?: string;
  apiRows?: Array<{
    method: string;
    params: string;
    returns: string;
    notes: string;
  }>;
  apiDetails?: Array<{
    method: string;
    purpose: string;
    example: string;
    edgeCase: string;
  }>;
  page: "guide" | "api" | "architecture" | "quality";
};

export const pages: Array<{ id: DocSection["page"]; label: string }> = [
  { id: "guide", label: "Guide" },
  { id: "api", label: "API" },
  { id: "architecture", label: "Architecture" },
  { id: "quality", label: "Quality" }
];

export const sections: DocSection[] = [
  {
    id: "overview",
    page: "guide",
    title: "Overview",
    body: [
      "@oxog/seo is a deterministic on-page SEO engine with an optional AI layer.",
      "The default pipeline is reliable, local-first, and works without network calls."
    ],
    bullets: [
      "10 scoring categories",
      "107 built-in rules",
      "sync + async + batch analysis",
      "plugin hooks and custom rules"
    ]
  },
  {
    id: "quickstart",
    page: "guide",
    title: "Quickstart",
    body: ["Create an analyzer and run a sync report in a few lines."],
    code: `import { createSeoAnalyzer } from "@oxog/seo";

const analyzer = createSeoAnalyzer({
  locale: "en",
  profile: "blog",
  depth: "full"
});

const report = analyzer.analyzeSync({
  url: "https://example.com/blog/seo",
  title: "SEO Guide",
  content: "<h1>SEO Guide</h1><p>...</p>",
  focusKeyword: "seo guide"
});`
  },
  {
    id: "examples",
    page: "guide",
    title: "Examples",
    body: [
      "Repository examples are grouped by scenario and maturity level."
    ],
    bullets: [
      "examples/01-basic",
      "examples/02-plugins",
      "examples/03-ai",
      "examples/04-competitor",
      "examples/05-advanced",
      "examples/06-real-world"
    ],
    code: `# Run package checks
npm run typecheck
npm run test

# Build package
npm run build

# Build docs website
cd website
npm run build`
  },
  {
    id: "api-surface",
    page: "api",
    title: "Analyzer API",
    body: ["Core methods exposed by AnalyzerInstance."],
    apiRows: [
      {
        method: "createSeoAnalyzer(config)",
        params: "AnalyzerConfig",
        returns: "AnalyzerInstance",
        notes: "Factory entry point."
      },
      {
        method: "analyzeSync(input)",
        params: "SeoInput",
        returns: "SeoReport",
        notes: "Deterministic path, no network."
      },
      {
        method: "analyze(input)",
        params: "SeoInput",
        returns: "Promise<SeoReport>",
        notes: "Optional AI merge path."
      },
      {
        method: "analyzeBatchSync(inputs)",
        params: "SeoInput[]",
        returns: "SeoReport[]",
        notes: "Sync batch wrapper."
      },
      {
        method: "analyzeBatch(inputs)",
        params: "SeoInput[]",
        returns: "Promise<SeoReport[]>",
        notes: "Async batch wrapper."
      },
      {
        method: "addRule(rule)",
        params: "RuleDefinition",
        returns: "void",
        notes: "Adds or overrides a rule."
      },
      {
        method: "use(plugin)",
        params: "SeoPlugin",
        returns: "void",
        notes: "Registers plugin hooks."
      },
      {
        method: "format*(...)",
        params: "SeoReport | SeoReport[]",
        returns: "string",
        notes: "JSON / Markdown / HTML / CSV."
      }
    ],
    apiDetails: [
      {
        method: "analyzeSync(input)",
        purpose: "Runs deterministic rule engine without AI.",
        example: `const report = analyzer.analyzeSync({
  url: "https://example.com",
  title: "SEO Title",
  content: "<h1>SEO Title</h1><p>...</p>"
});`,
        edgeCase: "Throws when url/title/content is missing."
      },
      {
        method: "analyze(input)",
        purpose: "Runs sync path first, then optional AI merge.",
        example: `const report = await analyzer.analyze({
  url: "https://example.com",
  title: "SEO Title",
  content: "<h1>SEO Title</h1><p>...</p>"
});`,
        edgeCase: "If AI fails or rate-limited, returns deterministic fallback."
      },
      {
        method: "addRule(rule)",
        purpose: "Adds custom rule or overrides existing id.",
        example: `analyzer.addRule({
  id: "custom.meta.min-description",
  category: "meta",
  weight: 2,
  description: "Meta min length",
  evaluate: (ctx) => ({ passed: (ctx.input.meta?.description?.length ?? 0) > 120, message: "Meta check" })
});`,
        edgeCase: "Same id replaces previous rule."
      },
      {
        method: "use(plugin)",
        purpose: "Registers plugin lifecycle hooks.",
        example: `analyzer.use({
  name: "post-hook",
  afterAnalyze: (report) => ({ ...report, score: report.score })
});`,
        edgeCase: "Plugins run in registration order."
      }
    ]
  },
  {
    id: "ai-api",
    page: "api",
    title: "AI API",
    body: [
      "AI helpers are exported as standalone utilities and integrated by analyze()."
    ],
    bullets: [
      "providerPresets",
      "runAiSuite",
      "orchestrateTasks",
      "estimateTokens",
      "LruCache / RateLimiter / withRetry"
    ],
    code: `import {
  providerPresets,
  runAiSuite,
  orchestrateTasks,
  estimateTokens
} from "@oxog/seo";`
  },
  {
    id: "design",
    page: "architecture",
    title: "Core Design",
    body: [
      "Micro-kernel + registry + analyzers design keeps rules deterministic and testable.",
      "AI suite runs as a secondary, optional scoring signal."
    ],
    bullets: [
      "core/context builder",
      "rules by category modules",
      "analyzers by category modules",
      "ai/prompts + ai/analyzers + ai/suite"
    ]
  },
  {
    id: "pipeline",
    page: "architecture",
    title: "Pipeline",
    body: [
      "parse -> context -> rule analyzers -> score -> suggestions -> optional AI merge"
    ]
  },
  {
    id: "quality-gates",
    page: "quality",
    title: "Quality Gates",
    body: ["The package enforces strict code quality and deterministic behavior."],
    bullets: [
      "TypeScript strict mode",
      "100% statements / branches / functions / lines",
      "zero runtime dependencies",
      "build outputs for ESM + CJS + DTS"
    ],
    code: `npm run typecheck
npm run test:coverage
npm run build`
  },
  {
    id: "roadmap",
    page: "quality",
    title: "Roadmap",
    body: [
      "Next milestones focus on deeper AI orchestration, richer semantic analysis, and expanded docs."
    ],
    bullets: [
      "deeper provider strategies",
      "extended structured-data intelligence",
      "more benchmark and trend tooling",
      "expanded website docs and guides"
    ]
  }
];

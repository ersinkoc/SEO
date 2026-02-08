import { runAiSuite } from "../ai/suite";
import { analyzeByCategories } from "../analyzers";
import { analyzeCompetitorGap } from "../analyzers/competitor.analyzer";
import { analyzeFreshness } from "../analyzers/freshness.analyzer";
import { analyzeLinkStrategy } from "../analyzers/link-strategy.analyzer";
import { analyzeSnippetOpportunity } from "../analyzers/snippet.analyzer";
import { mergeScores } from "../ai/score-merger";
import { formatAsCsv } from "../formatters/csv.formatter";
import { formatAsHtml } from "../formatters/html.formatter";
import { InvalidInputError } from "../errors";
import { formatAsJson } from "../formatters/json.formatter";
import { formatAsMarkdown } from "../formatters/markdown.formatter";
import { Kernel } from "../kernel";
import { buildContext } from "./context";
import { buildSuggestions, gradeFromScore, scoreRules } from "./scorer";
import { RuleRegistry } from "../rules/registry";
import type {
  AnalysisContext,
  AnalyzerConfig,
  AnalyzerInstance,
  CategoryName,
  RuleDefinition,
  SeoInput,
  SeoPlugin,
  SeoReport
} from "../types";

class SeoAnalyzer implements AnalyzerInstance {
  private readonly kernel = new Kernel();
  private readonly registry = new RuleRegistry();

  public constructor(private readonly config: AnalyzerConfig) {}

  /**
   * Run deterministic rule analysis with no network dependency.
   *
   * @example
   * const report = analyzer.analyzeSync({
   *   url: "https://example.com/post",
   *   title: "SEO Guide",
   *   content: "<h1>SEO Guide</h1><p>...</p>"
   * });
   */
  public analyzeSync(input: SeoInput): SeoReport {
    validateInput(input);
    this.kernel.beforeAnalyze(input);
    const context = buildContext(input);
    const activeCategories = getActiveCategories(
      this.config.depth ?? "full",
      this.config.enabledCategories
    );
    const ruleResults = analyzeByCategories(
      activeCategories,
      context,
      this.registry.getAll()
    );
    const scored = scoreRules(this.config.profile, ruleResults);
    const report: SeoReport = {
      score: scored.score,
      grade: scored.grade,
      categoryScores: scored.categoryScores,
      rules: ruleResults,
      suggestions: this.buildAllSuggestions(context, ruleResults),
      mode: "rule-only"
    };
    return this.kernel.afterAnalyze(report);
  }

  /**
   * Run hybrid analysis. If AI is disabled or unavailable, gracefully falls back to rule-only.
   *
   * @example
   * const report = await analyzer.analyze(input);
   */
  public async analyze(input: SeoInput): Promise<SeoReport> {
    const base = this.analyzeSync(input);
    if (!this.config.ai?.enabled) {
      return base;
    }
    const context = buildContext(input);
    const ai = await runAiSuite(this.config.ai, context);
    const mergedScore = mergeScores(
      base.score,
      ai.scoreDelta,
      this.config.ai.ruleWeight ?? 0.7,
      this.config.ai.aiWeight ?? 0.3
    );
    return {
      ...base,
      score: mergedScore,
      grade: gradeFromScore(mergedScore),
      mode: "hybrid"
    };
  }

  /**
   * Analyze many documents synchronously (rule-only path).
   *
   * @example
   * const reports = analyzer.analyzeBatchSync([inputA, inputB]);
   */
  public analyzeBatchSync(inputs: SeoInput[]): SeoReport[] {
    return inputs.map((input) => this.analyzeSync(input));
  }

  /**
   * Analyze many documents asynchronously (hybrid-capable path).
   *
   * @example
   * const reports = await analyzer.analyzeBatch([inputA, inputB]);
   */
  public async analyzeBatch(inputs: SeoInput[]): Promise<SeoReport[]> {
    return Promise.all(inputs.map((input) => this.analyze(input)));
  }

  /**
   * Add or override a rule in the registry.
   *
   * @example
   * analyzer.addRule({
   *   id: "custom.meta.rule",
   *   category: "meta",
   *   weight: 2,
   *   description: "Custom",
   *   evaluate: () => ({ passed: true, message: "ok" })
   * });
   */
  public addRule(rule: RuleDefinition): void {
    this.registry.add(rule);
  }

  /**
   * Register a plugin that hooks before/after analysis.
   *
   * @example
   * analyzer.use({ name: "plugin", afterAnalyze: (report) => report });
   */
  public use(plugin: SeoPlugin): void {
    this.kernel.use(plugin);
  }

  /**
   * Serialize report as pretty JSON.
   *
   * @example
   * const json = analyzer.format(report);
   */
  public format(report: SeoReport): string {
    return formatAsJson(report);
  }

  /**
   * Serialize report as markdown.
   *
   * @example
   * const md = analyzer.formatMarkdown(report);
   */
  public formatMarkdown(report: SeoReport): string {
    return formatAsMarkdown(report);
  }

  /**
   * Serialize report as self-contained HTML.
   *
   * @example
   * const html = analyzer.formatHtml(report);
   */
  public formatHtml(report: SeoReport): string {
    return formatAsHtml(report);
  }

  /**
   * Serialize report array as CSV.
   *
   * @example
   * const csv = analyzer.formatCsv([reportA, reportB]);
   */
  public formatCsv(reports: SeoReport[]): string {
    return formatAsCsv(reports);
  }

  /**
   * Return active rules for current config scope.
   *
   * @example
   * const rules = analyzer.getRules();
   */
  public getRules(): RuleDefinition[] {
    const activeCategories = getActiveCategories(
      this.config.depth ?? "full",
      this.config.enabledCategories
    );
    return this.registry
      .getAll()
      .filter((rule) => activeCategories.includes(rule.category));
  }

  private buildAllSuggestions(
    context: AnalysisContext,
    ruleResults: import("../types").RuleResult[]
  ) {
    const base = buildSuggestions(ruleResults);
    const extended = [
      ...analyzeCompetitorGap(context),
      ...analyzeSnippetOpportunity(context),
      ...analyzeFreshness(context),
      ...analyzeLinkStrategy(context)
    ];
    return [...base, ...extended].slice(0, 20);
  }
}

/**
 * Create an analyzer instance.
 *
 * @example
 * const analyzer = createSeoAnalyzer({ locale: "en", profile: "blog" });
 */
export function createSeoAnalyzer(config: AnalyzerConfig): AnalyzerInstance {
  return new SeoAnalyzer(config);
}

function validateInput(input: SeoInput): void {
  if (!input.url || !input.title || !input.content) {
    throw new InvalidInputError("url, title and content are required");
  }
}

function getActiveCategories(
  depth: "quick" | "standard" | "full",
  enabledCategories: CategoryName[] | undefined
): CategoryName[] {
  const byDepth: Record<"quick" | "standard" | "full", CategoryName[]> = {
    quick: ["content", "meta", "keyword", "technical"],
    standard: [
      "content",
      "meta",
      "keyword",
      "structure",
      "readability",
      "technical",
      "eeat"
    ],
    full: [
      "content",
      "meta",
      "keyword",
      "semantic",
      "structure",
      "readability",
      "technical",
      "eeat",
      "structuredData",
      "ux"
    ]
  };

  const scoped = byDepth[depth];
  if (!enabledCategories || enabledCategories.length === 0) {
    return scoped;
  }

  return enabledCategories.filter((category) => scoped.includes(category));
}

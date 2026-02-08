export type LocaleCode = "en" | "tr";
export type ProfileName =
  | "blog"
  | "product"
  | "landing"
  | "news"
  | "documentation"
  | "ecommerce";
export type CategoryName =
  | "content"
  | "meta"
  | "keyword"
  | "semantic"
  | "structure"
  | "readability"
  | "technical"
  | "eeat"
  | "structuredData"
  | "ux";
export type AnalysisDepth = "quick" | "standard" | "full";

export interface SeoInput {
  url: string;
  title: string;
  content: string;
  focusKeyword?: string;
  secondaryKeywords?: string[];
  meta?: {
    description?: string;
    canonical?: string;
    robots?: string;
    author?: string;
    publishDate?: string;
    modifiedDate?: string;
  };
  structuredData?: Array<Record<string, unknown>>;
}

export interface AnalyzerConfig {
  locale: LocaleCode;
  profile: ProfileName;
  depth?: AnalysisDepth;
  enabledCategories?: CategoryName[];
  ai?: {
    enabled: boolean;
    baseUrl: string;
    apiKey: string;
    model: string;
    timeoutMs?: number;
    ruleWeight?: number;
    aiWeight?: number;
  };
}

export interface ParsedDocument {
  plainText: string;
  wordCount: number;
  sentenceCount: number;
  titleLength: number;
  headings: string[];
  imageCount: number;
  internalLinkCount: number;
  externalLinkCount: number;
  hasCanonical: boolean;
  hasRobots: boolean;
  isHttps: boolean;
  depth: number;
  hasQuery: boolean;
}

export interface AnalysisContext {
  input: SeoInput;
  parsed: ParsedDocument;
  tokens: string[];
}

export interface RuleEvaluation {
  passed: boolean;
  message: string;
  suggestion?: string;
}

export interface RuleDefinition {
  id: string;
  category: CategoryName;
  weight: number;
  description: string;
  evaluate(context: AnalysisContext): RuleEvaluation;
}

export interface RuleResult {
  id: string;
  category: CategoryName;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  suggestion?: string;
}

export interface CategoryScore {
  score: number;
  maxScore: number;
}

export interface SeoSuggestion {
  id: string;
  category: CategoryName;
  message: string;
  priority: "high" | "medium" | "low";
}

export interface SeoReport {
  score: number;
  grade: string;
  categoryScores: Record<CategoryName, CategoryScore>;
  rules: RuleResult[];
  suggestions: SeoSuggestion[];
  mode: "rule-only" | "hybrid";
}

export interface SeoPlugin {
  name: string;
  beforeAnalyze?(input: SeoInput): void;
  afterAnalyze?(report: SeoReport): SeoReport;
}

export interface AnalyzerInstance {
  analyzeSync(input: SeoInput): SeoReport;
  analyze(input: SeoInput): Promise<SeoReport>;
  analyzeBatchSync(inputs: SeoInput[]): SeoReport[];
  analyzeBatch(inputs: SeoInput[]): Promise<SeoReport[]>;
  addRule(rule: RuleDefinition): void;
  use(plugin: SeoPlugin): void;
  format(report: SeoReport): string;
  formatMarkdown(report: SeoReport): string;
  formatHtml(report: SeoReport): string;
  formatCsv(reports: SeoReport[]): string;
  getRules(): RuleDefinition[];
}

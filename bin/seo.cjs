#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createSeoAnalyzer } = require("../dist/index.cjs");

function printHelp() {
  console.log(`@oxog/seo CLI

Usage:
  seo analyze --input <file.json> [--format json|markdown|html] [--locale en|tr] [--profile blog|product|landing|news|documentation|ecommerce] [--depth quick|standard|full] [--output <file>]
  seo batch --input <file.json> [--format csv|json|markdown|html] [--locale en|tr] [--profile blog|product|landing|news|documentation|ecommerce] [--depth quick|standard|full] [--output <file>]
  seo clean-temp
  seo examples
  seo version
  seo help`);
}

function parseArg(args, name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

function readInputJson(filePath) {
  const resolved = path.resolve(process.cwd(), filePath);
  const raw = fs.readFileSync(resolved, "utf8");
  const normalized = raw.replace(/^\uFEFF/, "");
  return JSON.parse(normalized);
}

function writeMaybeOutput(outputPath, content) {
  if (!outputPath) {
    console.log(content);
    return;
  }
  const resolved = path.resolve(process.cwd(), outputPath);
  fs.writeFileSync(resolved, content, "utf8");
  console.log(`Wrote output to ${resolved}`);
}

function parseConfigArgs(args, source) {
  const locale = parseArg(args, "--locale") || source.locale || "en";
  const profile = parseArg(args, "--profile") || source.profile || "blog";
  const depth = parseArg(args, "--depth") || source.depth || "full";

  const validLocales = new Set(["en", "tr"]);
  const validProfiles = new Set([
    "blog",
    "product",
    "landing",
    "news",
    "documentation",
    "ecommerce"
  ]);
  const validDepths = new Set(["quick", "standard", "full"]);

  if (!validLocales.has(locale)) {
    throw new Error(`Invalid --locale value: ${locale}`);
  }
  if (!validProfiles.has(profile)) {
    throw new Error(`Invalid --profile value: ${profile}`);
  }
  if (!validDepths.has(depth)) {
    throw new Error(`Invalid --depth value: ${depth}`);
  }

  return { locale, profile, depth };
}

function renderReport(analyzer, report, format) {
  if (format === "markdown") return analyzer.formatMarkdown(report);
  if (format === "html") return analyzer.formatHtml(report);
  return analyzer.format(report);
}

function runAnalyze(args) {
  const inputPath = parseArg(args, "--input");
  const format = parseArg(args, "--format") || "csv";
  const outputPath = parseArg(args, "--output");
  if (!inputPath) {
    throw new Error("Missing required argument: --input <file.json>");
  }
  const input = readInputJson(inputPath);
  const config = parseConfigArgs(args, input);
  const analyzer = createSeoAnalyzer(config);
  const report = analyzer.analyzeSync(input);
  const content = renderReport(analyzer, report, format);
  writeMaybeOutput(outputPath, content);
}

function resolveBatchInputs(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.inputs)) return payload.inputs;
  throw new Error("Batch input must be an array or an object with an inputs array.");
}

function runBatch(args) {
  const inputPath = parseArg(args, "--input");
  const format = parseArg(args, "--format") || "json";
  const outputPath = parseArg(args, "--output");
  if (!inputPath) {
    throw new Error("Missing required argument: --input <file.json>");
  }
  const payload = readInputJson(inputPath);
  const inputs = resolveBatchInputs(payload);
  const config = parseConfigArgs(args, payload || {});
  const analyzer = createSeoAnalyzer(config);
  const reports = analyzer.analyzeBatchSync(inputs);

  if (format === "json") {
    writeMaybeOutput(outputPath, JSON.stringify(reports, null, 2));
    return;
  }
  if (format === "markdown") {
    const joined = reports.map((report) => analyzer.formatMarkdown(report)).join("\n\n---\n\n");
    writeMaybeOutput(outputPath, joined);
    return;
  }
  if (format === "html") {
    const html = reports.map((report) => analyzer.formatHtml(report)).join("\n");
    writeMaybeOutput(outputPath, html);
    return;
  }
  writeMaybeOutput(outputPath, analyzer.formatCsv(reports));
}

function runExamples() {
  const analyzer = createSeoAnalyzer({
    locale: "en",
    profile: "blog",
    depth: "standard"
  });
  const report = analyzer.analyzeSync({
    url: "https://example.com/cli",
    title: "CLI Example",
    content: "<article><h1>CLI Example</h1><p>SEO content sample.</p></article>",
    focusKeyword: "cli seo"
  });
  console.log(`score=${report.score} grade=${report.grade} mode=${report.mode}`);
}

function runCleanTemp() {
  const cwd = process.cwd();
  const entries = fs.readdirSync(cwd, { withFileTypes: true });
  const targets = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^tmp\..+/.test(name));

  for (const name of targets) {
    fs.unlinkSync(path.join(cwd, name));
  }

  console.log(`Removed ${targets.length} temp file(s).`);
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    const pkg = require("../package.json");
    console.log(pkg.version);
    return;
  }

  if (command === "examples") {
    runExamples();
    return;
  }

  if (command === "clean-temp") {
    runCleanTemp();
    return;
  }

  try {
    if (command === "analyze") {
      runAnalyze(args);
      return;
    }

    if (command === "batch") {
      runBatch(args);
      return;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown CLI error";
    console.error(message);
    process.exitCode = 1;
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

main();

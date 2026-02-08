#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const { createSeoAnalyzer } = require("../dist/index.cjs");

function printHelp() {
  console.log(`@oxog/seo CLI

Usage:
  seo analyze --input <file.json> [--format json|markdown|html]
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
  return JSON.parse(raw);
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

  if (command === "analyze") {
    const inputPath = parseArg(args, "--input");
    const format = parseArg(args, "--format") || "json";
    if (!inputPath) {
      console.error("Missing required argument: --input <file.json>");
      process.exitCode = 1;
      return;
    }
    const input = readInputJson(inputPath);
    const analyzer = createSeoAnalyzer({
      locale: input.locale || "en",
      profile: input.profile || "blog",
      depth: input.depth || "full"
    });
    const report = analyzer.analyzeSync(input);
    if (format === "markdown") {
      console.log(analyzer.formatMarkdown(report));
      return;
    }
    if (format === "html") {
      console.log(analyzer.formatHtml(report));
      return;
    }
    console.log(analyzer.format(report));
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

main();

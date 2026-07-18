#!/usr/bin/env node
import { execSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const url = process.argv[2] ?? "http://localhost:4877";
const outDir = path.join(process.cwd(), "docs", "perf");
const jsonPath = path.join(outDir, "lighthouse-home.latest.json");
const mdPath = path.join(outDir, "HOMEPAGE-PERF.md");

function formatMs(ms) {
  if (ms == null || Number.isNaN(Number(ms))) return "n/a";
  return `${(Number(ms) / 1000).toFixed(2)}s`;
}

function runLighthouse() {
  const args = [
    url,
    "--only-categories=performance",
    "--output=json",
    `--output-path=${jsonPath}`,
    "--chrome-flags=--headless --no-sandbox",
    "-q",
  ];
  const result = spawnSync("npx", ["lighthouse", ...args], {
    stdio: "inherit",
    shell: true,
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function writeReport(report) {
  const perf = report.categories?.performance?.score;
  const score = perf != null ? Math.round(perf * 100) : "n/a";
  const a = report.audits ?? {};
  const date = new Date().toISOString().slice(0, 10);
  const body = `# Homepage performance (Lighthouse)

**URL:** ${url}
**Date:** ${date}
**Performance score:** ${score}/100

| Metric | Value |
|--------|-------|
| FCP | ${formatMs(a["first-contentful-paint"]?.numericValue)} |
| LCP | ${formatMs(a["largest-contentful-paint"]?.numericValue)} |
| TBT | ${a["total-blocking-time"]?.numericValue != null ? `${Math.round(a["total-blocking-time"].numericValue)} ms` : "n/a"} |
| CLS | ${a["cumulative-layout-shift"]?.numericValue?.toFixed(3) ?? "n/a"} |
| Speed Index | ${formatMs(a["speed-index"]?.numericValue)} |
| TTI | ${formatMs(a["interactive"]?.numericValue)} |

Lazy-load sections (4e44012+): HomeTodaysMatches, HomeLatestNews, HomeTrendingClips, HomeTeamsLeagues.

Re-run: \`npm run lighthouse:home\` or \`node scripts/lighthouse-home.mjs ${url}\`
`;
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(mdPath, body, "utf8");
  console.log("Wrote", mdPath, "score", score);
}

try {
  execSync("npx lighthouse --version", { stdio: "ignore", shell: true });
} catch {
  console.error("Install Lighthouse: npm i -D lighthouse");
  process.exit(1);
}

runLighthouse();
writeReport(JSON.parse(fs.readFileSync(jsonPath, "utf8")));
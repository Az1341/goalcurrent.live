/**
 * GC-REPORTING-STANDARD-BATCH-003 — reporting standard v1.0.0 validator.
 * Docs and templates only; does not touch application code.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const ok = (msg) => console.log(`PASS  ${msg}`);
const fail = (msg) => {
  errors.push(msg);
  console.error(`FAIL  ${msg}`);
};

const VERSION = "1.0.0";

const mustExist = [
  "docs/standards/REPORTING_STANDARD.md",
  "docs/standards/REPORTING_CHANGELOG.md",
  "templates/progress-report.md",
  "templates/completion-report.md",
  "templates/ci-report.md",
  "templates/deployment-report.md",
  "templates/blocker-report.md",
  "AGENTS.md",
];

const requiredSections = [
  "Executive header",
  "Executive Summary",
  "Execution Timeline",
  "Environment Summary",
  "Git Summary",
  "Commit URL",
  "Pull Request URL",
  "Branch URL",
  "Files Changed Report",
  "Files Created",
  "Files Modified",
  "Files Deleted",
  "Executive Metrics Dashboard",
  "Tasks Completed",
  "Decision Log",
  "Known Issues",
  "Rollback Assessment",
  "Dependencies",
  "Success Criteria",
  "Overall completion percentage",
  "Risk Assessment",
  "Founder Action Required",
  "Next Recommended Task",
  "Audit Trail",
  "Report Version",
  "Overall Status",
  "Production Status",
  "Main Branch Status",
  "Draft PR Status",
  "Public Deployment Status",
  "Report Generated",
];

const headerFields = [
  "**Project**",
  "**Execution Batch**",
  "**Report Type**",
  "**Status**",
  "**Repository**",
  "**Branch**",
  "**PR Number**",
];

function assertUtf8(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    fail(`missing ${rel}`);
    return null;
  }
  const buf = fs.readFileSync(p);
  if (buf.includes(0)) {
    fail(`${rel} contains NUL (likely UTF-16)`);
    return null;
  }
  ok(`${rel} exists (UTF-8 text)`);
  return fs.readFileSync(p, "utf8");
}

for (const rel of mustExist) assertUtf8(rel);

const standard = assertUtf8("docs/standards/REPORTING_STANDARD.md");
if (standard) {
  if (!standard.includes(`**Version:** ${VERSION}`)) fail(`standard Version must be ${VERSION}`);
  else ok(`standard Version ${VERSION}`);
  if (!standard.includes("GC-REPORTING-STANDARD-BATCH-003")) fail("standard must declare BATCH-003");
  else ok("standard declares BATCH-003");
  if (!standard.includes("\u2013")) fail("standard missing en dash");
  else ok("standard uses en dash");
  for (const needle of [
    "Execution Timeline",
    "Commit URL",
    "Pull Request URL",
    "Branch URL",
    "Executive Metrics Dashboard",
    "Decision Log",
    "Known Issues",
    "Rollback Assessment",
    "Dependency Register",
    "Success Criteria",
    "Audit Trail",
    "Change Log",
    "Revision History",
  ]) {
    if (!standard.includes(needle)) fail(`REPORTING_STANDARD.md missing: ${needle}`);
    else ok(`standard contains: ${needle}`);
  }
}

const changelog = assertUtf8("docs/standards/REPORTING_CHANGELOG.md");
if (changelog) {
  if (!changelog.includes(`[${VERSION}]`)) fail(`changelog missing [${VERSION}]`);
  else ok(`changelog has [${VERSION}]`);
  if (!changelog.includes("GC-REPORTING-STANDARD-BATCH-003")) fail("changelog missing BATCH-003");
  else ok("changelog references BATCH-003");
}

const templateRels = [
  "templates/progress-report.md",
  "templates/completion-report.md",
  "templates/ci-report.md",
  "templates/deployment-report.md",
  "templates/blocker-report.md",
];

for (const rel of templateRels) {
  const body = assertUtf8(rel);
  if (!body) continue;
  if (!body.includes("docs/standards/REPORTING_STANDARD.md")) fail(`${rel} must cite standard`);
  else ok(`${rel} cites standard`);
  if (!body.includes(VERSION)) fail(`${rel} must reference ${VERSION}`);
  else ok(`${rel} references ${VERSION}`);
  if (!body.includes("\u2013")) fail(`${rel} missing en dash`);
  else ok(`${rel} uses en dash`);
  for (const section of requiredSections) {
    if (!body.includes(section)) fail(`${rel} missing: ${section}`);
    else ok(`${rel} has ${section}`);
  }
  for (const field of headerFields) {
    if (!body.includes(field)) fail(`${rel} missing header: ${field}`);
  }
}

const agents = assertUtf8("AGENTS.md");
if (agents) {
  if (!agents.includes("docs/standards/REPORTING_STANDARD.md")) fail("AGENTS.md must link standard");
  else ok("AGENTS.md links standard");
}

const policy = assertUtf8("docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md");
if (policy) {
  if (!policy.includes("REPORTING_STANDARD.md")) fail("release policy must link standard");
  else ok("release policy links standard");
}

if (standard && changelog) {
  const stdVer = /\*\*Version:\*\*\s*([0-9]+\.[0-9]+\.[0-9]+)/.exec(standard);
  if (stdVer && changelog.includes("[" + stdVer[1] + "]")) ok("version consistency standard↔changelog");
  else fail("version consistency failed between standard and changelog");
}

if (errors.length) {
  console.error(`\n${errors.length} failure(s)`);
  process.exit(1);
}
console.log("\nAll reporting-standard v1.0.0 checks passed.");
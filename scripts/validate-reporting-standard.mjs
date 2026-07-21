/**
 * GC-REPORTING-STANDARD-BATCH-002 — reporting standard / template / example validator.
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

const STATUS_VALUES = ["PASS", "FAIL", "RUNNING", "SKIPPED", "BLOCKED"];
const RISK_VALUES = ["NONE", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

const mustExist = [
  "docs/standards/REPORTING_STANDARD.md",
  "templates/progress-report.md",
  "templates/completion-report.md",
  "templates/ci-report.md",
  "templates/deployment-report.md",
  "templates/blocker-report.md",
  "docs/examples/reporting/progress-report.example.md",
  "docs/examples/reporting/completion-report.example.md",
  "docs/examples/reporting/ci-report.example.md",
  "docs/examples/reporting/deployment-report.example.md",
  "docs/examples/reporting/blocker-report.example.md",
  "AGENTS.md",
];

const requiredSections = [
  "Executive header",
  "Executive Summary",
  "Environment Summary",
  "Git Summary",
  "Files Changed Report",
  "Files Created",
  "Files Modified",
  "Files Deleted",
  "Risk Assessment",
  "Founder Action Required",
  "Next Recommended Task",
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

const dashboardChecks = [
  "TypeScript",
  "ESLint",
  "Unit Tests",
  "Integration Tests",
  "Playwright",
  "Visual Tests",
  "Accessibility",
  "i18n",
  "Markdown",
  "Production Build",
  "Vercel Preview",
  "GitHub Actions",
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
  if (!standard.includes("GC-REPORTING-STANDARD-BATCH-002")) {
    fail("standard must declare BATCH-002");
  } else ok("standard declares BATCH-002");
  for (const needle of [
    "Executive report header",
    "Executive Summary",
    "Environment Summary",
    "Git Summary",
    "Files Changed Report",
    "Validation Dashboard",
    "Risk Assessment",
    "Founder Action Required",
    "Next Recommended Task",
    "Report Generated",
    "BLOCKED",
    ...dashboardChecks,
  ]) {
    if (!standard.includes(needle)) fail(`REPORTING_STANDARD.md missing: ${needle}`);
    else ok(`standard contains: ${needle}`);
  }
  if (!standard.includes("\u2013")) fail("standard missing en dash");
  else ok("standard uses en dash");
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
  if (!body.includes("docs/standards/REPORTING_STANDARD.md")) {
    fail(`${rel} must cite REPORTING_STANDARD.md`);
  } else ok(`${rel} cites standard`);
  if (!body.includes("\u2013")) fail(`${rel} missing en dash`);
  else ok(`${rel} uses en dash`);
  for (const section of requiredSections) {
    if (!body.includes(section)) fail(`${rel} missing section: ${section}`);
    else ok(`${rel} has ${section}`);
  }
  for (const field of headerFields) {
    if (!body.includes(field)) fail(`${rel} missing header field: ${field}`);
    else ok(`${rel} has ${field}`);
  }
  // Blocker may omit full dashboard table rows but must still allow validation language if present
  if (rel !== "templates/blocker-report.md") {
    for (const check of dashboardChecks) {
      if (!body.includes(check)) fail(`${rel} missing dashboard check: ${check}`);
      else ok(`${rel} dashboard ${check}`);
    }
  }
}

const exampleRels = [
  "docs/examples/reporting/progress-report.example.md",
  "docs/examples/reporting/completion-report.example.md",
  "docs/examples/reporting/ci-report.example.md",
  "docs/examples/reporting/deployment-report.example.md",
  "docs/examples/reporting/blocker-report.example.md",
];

for (const rel of exampleRels) {
  const body = assertUtf8(rel);
  if (!body) continue;
  if (!body.includes("docs/standards/REPORTING_STANDARD.md")) {
    fail(`${rel} must cite REPORTING_STANDARD.md`);
  } else ok(`${rel} cites standard`);
  for (const section of ["Executive header", "Executive Summary", "Risk Assessment", "Report Generated"]) {
    if (!body.includes(section)) fail(`${rel} missing ${section}`);
    else ok(`${rel} has ${section}`);
  }
}

const agents = assertUtf8("AGENTS.md");
if (agents) {
  if (!agents.includes("docs/standards/REPORTING_STANDARD.md")) {
    fail("AGENTS.md must link REPORTING_STANDARD.md");
  } else ok("AGENTS.md links standard");
  if (agents.includes("GC-STANDARD-REPORTING-001") && !agents.includes("BATCH-002")) {
    fail("AGENTS.md still centers obsolete GC-STANDARD-REPORTING-001");
  }
}

const policy = assertUtf8("docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md");
if (policy) {
  if (!policy.includes("REPORTING_STANDARD.md")) {
    fail("PRIVATE-PREVIEW-RELEASE-POLICY.md must link reporting standard");
  } else ok("release policy links reporting standard");
}

// Ensure no second competing standard file
const competing = [
  "docs/standards/REPORTING_STANDARD_V1.md",
  "docs/REPORTING_STANDARD.md",
];
for (const rel of competing) {
  if (fs.existsSync(path.join(root, rel))) fail(`competing standard file present: ${rel}`);
  else ok(`no competing file ${rel}`);
}

if (errors.length) {
  console.error(`\n${errors.length} failure(s)`);
  process.exit(1);
}
console.log("\nAll reporting-standard markdown checks passed.");
/**
 * GC-REPORTING-STANDARD-BATCH-001 — markdown / template conformance check.
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

const mustExist = [
  "docs/standards/REPORTING_STANDARD.md",
  "templates/progress-report.md",
  "templates/completion-report.md",
  "templates/ci-report.md",
  "templates/deployment-report.md",
  "templates/blocker-report.md",
  "AGENTS.md",
];

for (const rel of mustExist) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) fail(`missing ${rel}`);
  else {
    const buf = fs.readFileSync(p);
    if (buf.includes(0)) fail(`${rel} contains NUL (likely UTF-16)`);
    else ok(`${rel} exists (UTF-8 text)`);
  }
}

const standard = fs.readFileSync(
  path.join(root, "docs/standards/REPORTING_STANDARD.md"),
  "utf8",
);
for (const needle of [
  "Generated at",
  "Task started",
  "Task completed",
  "Status checked",
  "Report generated",
  "Execution duration",
  "Overall Status",
  "READY FOR REVIEW",
  "TypeScript",
  "Playwright",
  "Vercel Preview",
  "Waiting",
  "Running",
  "Retrying",
  "Passed",
  "Failed",
  "Current commit SHA",
  "Previous commit SHA",
]) {
  if (!standard.includes(needle)) fail(`REPORTING_STANDARD.md missing: ${needle}`);
  else ok(`standard contains: ${needle}`);
}

const templateChecks = {
  "templates/progress-report.md": [
    "Date",
    "Time",
    "Task ID",
    "Branch",
    "Commit",
    "Current status",
    "Completed",
    "Remaining",
    "Blockers",
    "Next action",
    "Report generated",
  ],
  "templates/completion-report.md": [
    "Start time",
    "Finish time",
    "Duration",
    "Validation summary",
    "Files changed",
    "Commits",
    "Deployment status",
    "Final verdict",
    "Overall Status",
  ],
  "templates/ci-report.md": [
    "Workflow",
    "Run number",
    "Queued",
    "Running",
    "Passed",
    "Failed",
    "Skipped",
  ],
  "templates/deployment-report.md": [
    "Git commit",
    "Branch",
    "Environment",
    "Deploy start",
    "Deploy finish",
    "Deployment duration",
    "Smoke tests",
    "Rollback status",
  ],
  "templates/blocker-report.md": [
    "When discovered",
    "Severity",
    "Impact",
    "Root cause",
    "Evidence",
    "Recommended action",
    "Owner",
  ],
};

for (const [rel, needles] of Object.entries(templateChecks)) {
  const body = fs.readFileSync(path.join(root, rel), "utf8");
  if (!body.includes("docs/standards/REPORTING_STANDARD.md")) {
    fail(`${rel} must cite REPORTING_STANDARD.md`);
  } else ok(`${rel} cites standard`);
  if (!body.includes("\u2013")) fail(`${rel} missing en dash in timestamp placeholder`);
  else ok(`${rel} uses en dash`);
  for (const n of needles) {
    if (!body.includes(n)) fail(`${rel} missing field/section: ${n}`);
    else ok(`${rel} has ${n}`);
  }
}

const agents = fs.readFileSync(path.join(root, "AGENTS.md"), "utf8");
if (!agents.includes("docs/standards/REPORTING_STANDARD.md")) {
  fail("AGENTS.md must link REPORTING_STANDARD.md");
} else ok("AGENTS.md links standard");
if (agents.includes("GC-STANDARD-REPORTING-001") && !agents.includes("REPORTING_STANDARD.md")) {
  fail("AGENTS.md still defines obsolete standalone timestamp rule without standard link");
}

const policy = fs.readFileSync(
  path.join(root, "docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md"),
  "utf8",
);
if (!policy.includes("REPORTING_STANDARD.md")) {
  fail("PRIVATE-PREVIEW-RELEASE-POLICY.md must link reporting standard");
} else ok("release policy links reporting standard");

if (errors.length) {
  console.error(`\n${errors.length} failure(s)`);
  process.exit(1);
}
console.log("\nAll reporting-standard markdown checks passed.");
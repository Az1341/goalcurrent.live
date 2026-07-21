# GoalCurrent Reporting Standard

**Standard ID:** GC-REPORTING-STANDARD-BATCH-002  
**Supersedes:** GC-REPORTING-STANDARD-BATCH-001 / GC-STANDARD-REPORTING-001  
**Status:** MANDATORY  
**Scope:** GoalCurrent, SepanAI and FAMVI work unless the Founder explicitly overrides  
**Owner:** Ahmad Zafarani (Founder)  
**Authority:** This file is the single source of truth for execution, validation, CI, deployment and blocker reports.

Templates: `templates/`. Examples: `docs/examples/reporting/`. Validator: `scripts/validate-reporting-standard.mjs`.

---

## 1. Purpose

Every report must be timestamped, structured, comparable, executive-ready and suitable for founder audit. Never estimate times. Never invent SHAs, URLs or Founder Approval.

---

## 2. Timestamp format

### Required opening

```text
[DD/MM/YYYY – HH:MM]
```

### Rules

1. Generate immediately before producing the report.
2. Use local project / founder time.
3. Use en dash `–` (not hyphen).
4. 24-hour `HH:MM`.
5. Never reuse an older timestamp.
6. Never estimate. If unknown, write `UNKNOWN` and explain.

### Mandatory time labels (never omit)

| Label | Meaning |
| --- | --- |
| **Generated at** | Instant the report content was assembled |
| **Task started** | When the named task began |
| **Task completed** | When finished, or `IN PROGRESS` / `BLOCKED` |
| **Status checked** | When live status was last queried |
| **Report Generated** | Footer stamp on every final report |

### Execution duration (mandatory)

```text
Started:  15:18
Finished: 15:54
Duration: 36 minutes
```

---

## 3. Executive report header (mandatory)

Every report begins with the opening timestamp, then this header:

| Field | Requirement |
| --- | --- |
| **Project** | e.g. GoalCurrent / SepanAI / FAMVI |
| **Execution Batch** | Batch / task ID |
| **Report Type** | Progress / Completion / CI / Deployment / Blocker / Validation |
| **Status** | Short live status string |
| **Repository** | e.g. `Az1341/goalcurrent.live` |
| **Branch** | Exact branch name |
| **PR Number** | Number or `N/A` |

---

## 4. Executive Summary (mandatory)

Immediately below the header. **Maximum five** concise bullet points.

---

## 5. Environment Summary (mandatory)

| Field | Requirement |
| --- | --- |
| **Repository** | |
| **Branch** | |
| **Commit** | Current HEAD SHA |
| **Previous Commit** | Parent SHA |
| **Draft/Ready PR** | Draft / Ready / N/A |
| **Production Status** | NOT DEPLOYED / DEPLOYED / UNKNOWN |
| **Preview URL** | URL or `none` |
| **PR URL** | URL or `none` |

---

## 6. Git Summary (mandatory)

| Field | Requirement |
| --- | --- |
| **Current Commit** | |
| **Previous Commit** | |
| **Commits Created** | List or count for this batch |
| **Files Added** | Count |
| **Files Modified** | Count |
| **Files Deleted** | Count |

Also include Pull Request identity: URL and Draft or Ready.

---

## 7. Files Changed Report (mandatory)

Alphabetically sorted lists:

- **Files Created**
- **Files Modified**
- **Files Deleted**

---

## 8. Validation Dashboard (mandatory when claiming quality gates)

Each row must be exactly one of: `PASS` | `FAIL` | `RUNNING` | `SKIPPED` | `BLOCKED`

| Check |
| --- |
| TypeScript |
| ESLint |
| Unit Tests |
| Integration Tests |
| Playwright |
| Visual Tests |
| Accessibility |
| i18n |
| Markdown |
| Production Build |
| Vercel Preview |
| GitHub Actions |

---

## 9. Risk Assessment (mandatory)

| Risk | Severity |
| --- | --- |
| **Production Risk** | NONE / LOW / MEDIUM / HIGH / CRITICAL |
| **Deployment Risk** | NONE / LOW / MEDIUM / HIGH / CRITICAL |
| **Documentation Risk** | NONE / LOW / MEDIUM / HIGH / CRITICAL |
| **Merge Risk** | NONE / LOW / MEDIUM / HIGH / CRITICAL |

---

## 10. Founder Action Required (mandatory)

List **only** actions that require Founder approval. If none, write `None`.

---

## 11. Next Recommended Task (mandatory)

Name the logical next execution batch or task ID.

---

## 12. Report footer (mandatory on final reports)

| Field | Values |
| --- | --- |
| **Overall Status** | READY FOR REVIEW / READY FOR PRODUCTION / BLOCKED / FAILED / Requires Founder Approval |
| **Production Status** | NOT DEPLOYED / DEPLOYED / UNKNOWN |
| **Main Branch Status** | UNCHANGED / CHANGED (must stay UNCHANGED without Founder Approval) |
| **Draft PR Status** | Draft / Ready / none |
| **Public Deployment Status** | NOT PUBLICLY DEPLOYED / PUBLICLY DEPLOYED |
| **Report Generated** | `[DD/MM/YYYY – HH:MM]` |

GoalCurrent product changes without Founder Approval must also state:

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**

---

## 13. CI monitoring

Long-running jobs must report:

- **Status checked:** `[DD/MM/YYYY – HH:MM]`
- **Current state:** Waiting | Running | Retrying | Passed | Failed

Prohibited: writing only "Still running."

---

## 14. Report types and templates

| Type | Template | Example |
| --- | --- | --- |
| Progress | `templates/progress-report.md` | `docs/examples/reporting/progress-report.example.md` |
| Completion | `templates/completion-report.md` | `docs/examples/reporting/completion-report.example.md` |
| CI | `templates/ci-report.md` | `docs/examples/reporting/ci-report.example.md` |
| Deployment | `templates/deployment-report.md` | `docs/examples/reporting/deployment-report.example.md` |
| Blocker | `templates/blocker-report.md` | `docs/examples/reporting/blocker-report.example.md` |

Type-specific body fields remain required inside the templates.

---

## 15. Mandatory section order

1. Opening timestamp
2. Executive header (section 3)
3. Executive Summary (section 4)
4. Time block
5. Environment Summary (section 5)
6. Git Summary (section 6)
7. Files Changed Report (section 7)
8. Type-specific body
9. Validation Dashboard (section 8) when applicable
10. Risk Assessment (section 9)
11. Founder Action Required (section 10)
12. Next Recommended Task (section 11)
13. Footer (section 12)

---

## 16. Prohibited formats

- Omit opening timestamp or required sections
- Reuse timestamps or estimate clocks
- Collapse validation into a single "tests passed" line
- Duplicate competing report schemas outside this file
- Claim Founder Approval that was not given

---

## 17. Backward compatibility

- `AGENTS.md` must point here only.
- `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md` remains the release-gate authority; reports must satisfy **both**.
- Older `reports/` narratives are historical.

---

## 18. Change control

Amendments require Founder awareness. Docs PRs must not merge to `main` without Explicit Founder Approval.

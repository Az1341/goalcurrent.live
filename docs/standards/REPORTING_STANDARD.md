# GoalCurrent Reporting Standard

**Version:** 1.0.0  
**Release Date:** 21/07/2026  
**Standard ID:** GC-REPORTING-STANDARD-BATCH-003  
**Supersedes:** GC-REPORTING-STANDARD-BATCH-002 / BATCH-001 / GC-STANDARD-REPORTING-001  
**Status:** MANDATORY  
**Scope:** GoalCurrent, SepanAI and FAMVI work unless the Founder explicitly overrides  
**Owner:** Ahmad Zafarani (Founder)  
**Authority:** Single source of truth for execution, validation, CI, deployment and blocker reports.

Templates: `templates/`. Examples: `docs/examples/reporting/`. Changelog: `docs/standards/REPORTING_CHANGELOG.md`. Validator: `scripts/validate-reporting-standard.mjs`.

---

## 1. Purpose

Every report must be timestamped, structured, comparable, executive-ready and suitable for founder audit. Never estimate times. Never invent SHAs, URLs or Founder Approval.

---

## 2. Versioning

| Field | Rule |
| --- | --- |
| **Version Number** | Semantic `MAJOR.MINOR.PATCH` (this release: `1.0.0`) |
| **Release Date** | `DD/MM/YYYY` of this version |
| **Change Log** | Mandatory entry in `docs/standards/REPORTING_CHANGELOG.md` for every reporting-standard change |
| **Revision History** | Summarised in the changelog; reports must state **Report Version** matching this Version Number when conforming |

Future reporting changes must bump the version and append a changelog entry before merge consideration.

---

## 3. Timestamp format

Opening (every report):

```text
[DD/MM/YYYY – HH:MM]
```

Rules: generate immediately before writing; local founder time; en dash `–`; 24-hour `HH:MM`; never reuse; never estimate (`UNKNOWN` + reason if needed).

### Execution Timeline (mandatory — chronological)

| Order | Event |
| --- | --- |
| 1 | **Task Started** `[DD/MM/YYYY – HH:MM]` |
| 2 | **Task Completed** `[DD/MM/YYYY – HH:MM]` / `IN PROGRESS` / `BLOCKED` |
| 3 | **Status Checked** `[DD/MM/YYYY – HH:MM]` |
| 4 | **Report Generated** `[DD/MM/YYYY – HH:MM]` |

Also retain **Generated at**, **Started**, **Finished**, **Duration** (real clocks only).

---

## 4. Executive report header (mandatory)

| Field | Requirement |
| --- | --- |
| **Project** | GoalCurrent / SepanAI / FAMVI |
| **Execution Batch** | Batch / task ID |
| **Report Type** | Progress / Completion / CI / Deployment / Blocker / Validation |
| **Status** | Short live status |
| **Repository** | e.g. `Az1341/goalcurrent.live` |
| **Branch** | Exact name |
| **PR Number** | Number or `N/A` |

---

## 5. Executive Summary (mandatory)

Max **five** concise bullets immediately below the header.

---

## 6. Environment Summary (mandatory)

Repository, Branch, Commit, Previous Commit, Draft/Ready PR, Production Status, Preview URL, PR URL.

---

## 7. Git Summary + GitHub Evidence Links (mandatory)

| Field | Requirement |
| --- | --- |
| **Current Commit** | SHA |
| **Previous Commit** | SHA |
| **Commit URL** | Clickable `${GH}/commit/<SHA>` for current (and each listed SHA) |
| **Pull Request URL** | Clickable PR URL or `none` |
| **Branch URL** | Clickable `${GH}/tree/<branch>` |
| **Commits Created** | List/count |
| **Files Added / Modified / Deleted** | Counts |

Every SHA referenced in the report must have a clickable GitHub commit URL.

---

## 8. Files Changed Report (mandatory)

Alphabetically sorted: **Files Created**, **Files Modified**, **Files Deleted**.

---

## 9. Executive Metrics Dashboard (mandatory)

| Metric | Value |
| --- | --- |
| **Tasks Completed** | number |
| **Tasks Failed** | number |
| **Tasks Skipped** | number |
| **Commits Created** | number |
| **Files Created** | number |
| **Files Modified** | number |
| **Files Deleted** | number |
| **Documentation Pages Updated** | number |

---

## 10. Validation Dashboard

Each: `PASS` | `FAIL` | `RUNNING` | `SKIPPED` | `BLOCKED`

TypeScript, ESLint, Unit Tests, Integration Tests, Playwright, Visual Tests, Accessibility, i18n, Markdown, Production Build, Vercel Preview, GitHub Actions.

---

## 11. Decision Log (mandatory — chronological)

Record:

- Founder Decisions
- Architecture Decisions
- Repository Decisions
- Documentation Decisions

---

## 12. Known Issues Register (mandatory)

Separate from Blockers.

| Issue | Severity | Impact | Planned Resolution |
| --- | --- | --- | --- |

If none: `None`.

---

## 13. Blockers (when applicable)

Use blocker template fields (severity, impact, root cause, evidence, owner). Do not mix into Known Issues.

---

## 14. Rollback Assessment (mandatory)

| Field | Values |
| --- | --- |
| **Rollback Required** | Yes / No / N/A |
| **Rollback Complexity** | NONE / LOW / MEDIUM / HIGH |
| **Rollback Risk** | NONE / LOW / MEDIUM / HIGH / CRITICAL |
| **Recovery Method** | e.g. revert commits / redeploy previous SHA |

---

## 15. Dependency Register (mandatory)

List:

- Previous execution batches
- Required documentation
- Required repositories
- Required standards

---

## 16. Success Criteria (mandatory)

Checklist of objectives with Status `PASS` / `FAIL`, plus **Overall completion percentage**.

---

## 17. Risk Assessment / Founder Action / Next Task

Unchanged from Batch 002 (Production / Deployment / Documentation / Merge risks; Founder Action Required; Next Recommended Task).

---

## 18. Audit Trail (mandatory)

| Field | Requirement |
| --- | --- |
| **Repository** | |
| **Branch** | |
| **Execution Environment** | e.g. Cursor agent / local Windows |
| **Executor** | Agent or human identity |
| **Founder Approval Status** | Pending / Approved / Rejected / N/A |
| **Approval Date** | `DD/MM/YYYY` or `N/A` |
| **Report Version** | Must match standard Version Number (e.g. `1.0.0`) |

---

## 19. Report footer (mandatory)

Overall Status; Production Status; Main Branch Status; Draft PR Status; Public Deployment Status; **Report Generated**.

**NOT MERGED AND NOT PUBLICLY DEPLOYED.** until Explicit Founder Approval.

---

## 20. Mandatory section order

1. Opening timestamp  
2. Executive header  
3. Executive Summary  
4. Execution Timeline  
5. Environment Summary  
6. Git Summary + GitHub Evidence Links  
7. Files Changed Report  
8. Executive Metrics Dashboard  
9. Type-specific body  
10. Validation Dashboard (when applicable)  
11. Decision Log  
12. Known Issues Register  
13. Rollback Assessment  
14. Dependency Register  
15. Success Criteria  
16. Risk Assessment  
17. Founder Action Required  
18. Next Recommended Task  
19. Audit Trail  
20. Footer  

---

## 21. CI monitoring

Status checked + Current state: Waiting | Running | Retrying | Passed | Failed. Never only “Still running.”

---

## 22. Prohibited formats

Omit required sections; reuse timestamps; estimate clocks; collapse validation; duplicate competing schemas; claim ungiven Founder Approval; list SHAs without clickable commit URLs.

---

## 23. Backward compatibility

`AGENTS.md` points here only. Release gates: `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md`. Changelog is authoritative for version history.

---

## 24. Change control

Bump Version Number, update Release Date, append `REPORTING_CHANGELOG.md`, and keep templates/validator in sync. Docs PRs must not merge to `main` without Explicit Founder Approval.

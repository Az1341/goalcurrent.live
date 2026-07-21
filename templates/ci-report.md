# CI Report

> Conforms to `docs/standards/REPORTING_STANDARD.md`

```text
[DD/MM/YYYY – HH:MM]
```

## Identity

| Field | Value |
| --- | --- |
| **Task ID** | |
| **Repository** | |
| **Current branch** | |
| **Current commit SHA** | |
| **Previous commit SHA** | |
| **Pull Request** | |
| **Draft or Ready** | Draft / Ready / N/A |

## Time block

| Field | Value |
| --- | --- |
| **Generated at** | `[DD/MM/YYYY – HH:MM]` |
| **Task started** | `[DD/MM/YYYY – HH:MM]` |
| **Task completed** | `[DD/MM/YYYY – HH:MM]` or `IN PROGRESS` |
| **Status checked** | `[DD/MM/YYYY – HH:MM]` |
| **Started** | HH:MM |
| **Finished** | HH:MM or — |
| **Duration** | N minutes |

## Workflow

| Field | Value |
| --- | --- |
| **Workflow** | e.g. CI |
| **Run number** | |
| **Run URL** | |
| **Start time** | `[DD/MM/YYYY – HH:MM]` |
| **End time** | `[DD/MM/YYYY – HH:MM]` or — |
| **Duration** | N minutes |

## Current state (long-running)

**Status checked:** `[DD/MM/YYYY – HH:MM]`  
**Current state:** `Waiting` | `Running` | `Retrying` | `Passed` | `Failed`

Do not write only "Still running."

## Jobs

For every individual job, mark exactly one column:

| Job | Queued | Running | Passed | Failed | Skipped |
| --- | --- | --- | --- | --- | --- |
| Lint, types, i18n, unit tests | | | | | |
| Playwright E2E + visual regression | | | | | |
| (add rows as needed) | | | | | |

## Overall Status

`READY FOR REVIEW` | `READY FOR PRODUCTION` | `BLOCKED` | `FAILED` | `Requires Founder Approval`

---

Report generated:  
`[DD/MM/YYYY – HH:MM]`
# Deployment Report

> Conforms to `docs/standards/REPORTING_STANDARD.md`

```text
[DD/MM/YYYY – HH:MM]
```

## Identity

| Field | Value |
| --- | --- |
| **Task ID** | |
| **Repository** | |
| **Branch** | |
| **Git commit** | (deployed SHA) |
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
| **Deploy start** | `[DD/MM/YYYY – HH:MM]` |
| **Deploy finish** | `[DD/MM/YYYY – HH:MM]` or — |
| **Deployment duration** | N minutes |

## Environment

| Field | Value |
| --- | --- |
| **Environment** | Preview / Production / other |
| **URL** | |
| **Protection** | Verified / Unverified / N/A |

## Smoke tests

| Check | Result |
| --- | --- |
| (critical URL / flow) | PASS / FAIL / SKIPPED / RUNNING |

## Rollback status

| Field | Value |
| --- | --- |
| **Rollback ready** | Yes / No |
| **Rollback method** | revert commit / redeploy previous / other |
| **Known-good SHA** | |

## Overall Status

`READY FOR REVIEW` | `READY FOR PRODUCTION` | `BLOCKED` | `FAILED` | `Requires Founder Approval`

**NOT MERGED AND NOT PUBLICLY DEPLOYED.** (for private preview until Founder Approval)

---

Report generated:  
`[DD/MM/YYYY – HH:MM]`
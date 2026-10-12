# checklist.md — GoalCurrent.live

**Type:** Non-authoritative documentation review plan. **Date:** 12 October 2026 (Europe/London). **State:** DRAFT / NOT CERTIFIED.

## Governing records
`AGENTS.md` and `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md` are mandatory. `docs/ENVIRONMENT.md` is environment guidance; reconcile any stale live-data statements against the current approved archive decision.

## Project-specific acceptance checks
- [ ] Protect public access to football pages while enforcing server-only access for privileged cron/admin routes and API tokens.
- [ ] Run `npm run verify:design` and applicable build, unit, i18n and visual checks; record results.
- [ ] Documentation-only PR must still receive explicit founder approval before merge; protected preview requirements apply as specified by the canonical policy.
- [ ] No reactivation of retired World Cup live/API features without a separate approved decision.

## Cross-project evidence gates
- [ ] Confirm the five new root files add **no second source of truth**, new permission or release authority.
- [ ] Validate all Markdown links, file contents, data classification and absence of credential values or private records.
- [ ] Verify exact branch/head SHA and diff restricted to the five documentation files.
- [ ] Record actual result of any applicable static, lint, build and regression checks; if not run, label **NOT RUN**, never PASS.
- [ ] Have the applicable project owner review the exact commit and required existing release gates before merge.

## Outcome
**Document review:** pending independent QA evidence. **Application security / tests:** NOT CERTIFIED. **Release:** NOT AUTHORISED.

**Current decision:** HOLD — DOCUMENTATION REVIEW AND FOUNDER RELEASE GATE.

These checkboxes are gates, not statements that underlying software is missing or unsafe. See [security.md](security.md), [auth.md](auth.md), [data.md](data.md) and [hack.md](hack.md).

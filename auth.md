# auth.md — GoalCurrent.live

**Scope:** Authentication, authorisation and access review guide. **Status:** DRAFT / NOT CERTIFIED (12 October 2026, Europe/London). This file grants no permissions and does not supersede existing controls.

## Governing authority
`AGENTS.md`, `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md`, `src/app/api/cron/refresh-content/route.ts` and `docs/ENVIRONMENT.md`.

## Specific boundaries
- Public football pages are intentionally readable without sign-in; do not impose universal login or SaaS tenant semantics.
- Protect administrative/cron endpoints with server-side credentials, and keep API/YouTube and other provider tokens out of browser code.
- The cron source permits no-secret access only in `NODE_ENV=development`; verify that no production host accidentally uses development semantics.
- Do not permit an agent, deploy hook, or CI status to bypass protected preview and founder release approval.

## Negative-case evidence to collect
- Unauthorised cron access in production; provider token exposure; unprotected preview; prohibited API reactivation.

## Approval and audit
Founder review of the exact docs PR before merge, per release policy. Use isolated test fixtures; record test outcomes and reviewed exact commit SHA. If a verification has not run, state **NOT RUN** rather than PASS.

Related: [security.md](security.md), [data.md](data.md), [hack.md](hack.md), [checklist.md](checklist.md).

# hack.md — Authorised defensive assessment: goalcurrent.live

**Status:** DRAFT scope statement, 12 October 2026 (Europe/London). The filename is a checklist label only; it is **not** authorisation to hack, penetrate, scan or attack systems.

## Assessment target
public web security and server-only feed/cron boundaries.

## Allowed review
Review static source for admin/cron auth, secret handling, third-party asset rights and release policy. For a later separately authorised isolated QA session, test unauthorised cron requests and fail-closed behaviour.

## Explicitly prohibited
No unauthorised production requests, key disclosure, live-feed activation, deployment or bypass of protected private preview.

## Required safeguards and evidence
1. Confirm owner, approved environment, test identity, exact code revision and stop conditions before any active test. A documentation review alone is not active-test approval.
2. Prefer static source and dependency review. Use synthetic fixtures and offline deterministic test execution only where authorised and accessible; never fabricate runtime output.
3. Capture finding ID, severity, verified code line or observed test result, remediation, retest outcome, and reviewer. Label missing tests **NOT RUN**.
4. Stop if real secrets or personal data are discovered, preserve minimal redacted evidence and escalate privately according to existing policy.
5. Fix any verified issues via a separate scoped change when code changes are required. This documentation-only PR is not a vulnerability-remediation branch.

No project access, vendor key, deployment, destructive activity or production testing is conferred by this file. Existing approved policies take precedence.

See [security.md](security.md), [auth.md](auth.md), [data.md](data.md) and [checklist.md](checklist.md).

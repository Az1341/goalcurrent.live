# hack.md — goalcurrent.live

**Purpose:** Authorised defensive review plan only. No offensive activity or production penetration tests are approved by this file.
**Status:** Review draft — 12 October 2026 (Europe/London).

## Permitted approach
- Obtain the approved test scope, environments, accounts, owners and stop conditions before any active security testing.
- Prefer static checks, dependency audits, code review and synthetic-data tests in isolated local or test environments.
- Assess trust-boundary bypasses, broken access control, injection, input handling, secrets exposure, insecure defaults, unsafe action execution and rate-limit failure.
- Test only owned/authorised systems. Never attack external providers, real customers, production services or third-party accounts.
- Stop immediately on real personal information, secret exposure or unexpected side effects. Report privately; redact evidence.

## Test records
Capture test case ID, scoped revision, expected control, observed evidence, severity, remediation owner and retest outcome. A passing checklist alone is not proof of security. All findings must enter the project's existing issue/evidence mechanism.

## Release barrier
No deployments, credential rotations, live hacking, exploitation or disabling protection is authorised by this documentation. Follow existing project governance and explicit founder approvals.

Related: [security.md](security.md), [auth.md](auth.md), [data.md](data.md).

# security.md — GoalCurrent.live

**Classification:** Non-authoritative control-review guide. **Status:** DRAFT / NOT CERTIFIED, 12 October 2026 (Europe/London). This document neither certifies existing controls nor authorises new security tests or production changes.

## Source of authority
`AGENTS.md`, `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md`, `docs/ENVIRONMENT.md`. Archive retirement decisions must be reconciled where older documentation still describes live feeds. If there is a conflict, reconcile the authoritative implementation and approved decisions; do not elevate this summary to a second Source of Truth.

## Priority threats to review
- Server API/cron credentials accidentally leaked through bundles or logs.
- Release bypass of protected preview or reactivation of discontinued WC26 endpoints.
- Unlicensed assets or inaccurate football archive content.

## Security boundaries to preserve
- Allow anonymous public content reads, but protect privileged routes server-side.
- Review deployment `NODE_ENV`, cron bearer checks, cache updates, external feed key exposure and rights provenance.
- Every merge needs founder's explicit review and approval. No public deployment from the doc PR.

## Evidence and incident treatment
- Collect reproducible scoped findings and exact commit SHA using synthetic or redacted evidence. No live penetration test authorised by this file.
- Never include API keys, tokens, personal records or exploit artefacts with real data in repository documentation.
- For exposure or a serious finding, preserve evidence, restrict access and use established incident/credential-response procedures with the appropriate owner.
- Verify a fix in isolation; an unrun check is **NOT RUN**, never PASS.

**Release decision:** NOT MERGED AND NOT PUBLICLY DEPLOYED. Existing policy controls the exact approval requirements.

Related: [auth.md](auth.md), [data.md](data.md), [hack.md](hack.md), [checklist.md](checklist.md).

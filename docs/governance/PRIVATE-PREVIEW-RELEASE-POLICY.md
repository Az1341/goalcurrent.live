# PRIVATE-PREVIEW-RELEASE-POLICY — GoalCurrent Mandatory Release Gate

**UK date/time first published:** 2026-07-20 22:00 BST  
**Owner:** Ahmad Zafarani (Founder)  
**Status:** MANDATORY for all GoalCurrent work  
**Scope:** Code, content, configuration, and documentation that affects the live product or public URLs

## Permanent release rule

Every GoalCurrent change must follow:

**Build → Automated tests → Protected private preview → Ahmad’s review → Explicit Founder Approval → Merge into main → Public deployment**

Mandatory wording:

> Nothing may be merged into main or published publicly without explicit Founder Approval after Ahmad has reviewed the protected private preview.

## Definitions

### Protected private preview

A Vercel (or equivalent) **branch/preview deployment** of the change branch that:

- Is reachable by the Founder for review.
- Is protected against unauthorised public access (Deployment Protection, password, SSO, or equivalent).
- Is **not** the production deployment on `main`.
- Must not be described as “published” or “live production”.

If access protection cannot be verified, the URL must **not** be described as a completed private preview.

### Explicit Founder Approval

Written approval from Ahmad Zafarani that:

- Names the pull request and/or commit SHA reviewed.
- Confirms the protected private preview was inspected.
- Explicitly authorises merge into `main` and/or public deployment.
- Is not inferred from silence, emoji reactions alone, or a green CI check.

### Public deployment

Any promotion that serves the change on the production hostname (`https://goalcurrent.live` or the configured production domain) for general visitors.

## Prohibited automatic approval

The following are **never** sufficient for merge or public release:

- Successful `npm run build`
- Passing unit/i18n/Playwright tests
- A created preview URL
- An open or “ready for review” PR
- Agent recommendation
- Silence from the Founder
- Batch completion reports

## Preview access protection

- Prefer Vercel Deployment Protection (or equivalent) so previews are not anonymously crawlable.
- Share preview URLs only with authorised reviewers.
- Do not post unprotected preview URLs as “private” in public channels.
- Agents must not change Vercel account settings or GitHub branch protection remotely unless the Founder explicitly authorises that operations task in writing.

## Required evidence before requesting Founder Approval

1. Branch name and tip SHA.
2. Draft or ready PR URL (separate from unrelated batches).
3. Automated test results (at minimum unit, i18n, and build unless documented otherwise).
4. Protected private-preview URL **or** a recorded blocker if protection is unverified.
5. Summary of user-visible changes and risks.
6. Rollback method (revert commit / disable flag / restore previous deployment).
7. Explicit statement: **NOT MERGED AND NOT PUBLICLY DEPLOYED** until approval.

## Rollback readiness

Before merge:

- Identify the previous known-good `main` SHA.
- Prefer reversible PRs (single-purpose).
- For content/archive changes, document redirect reverse map if permanent redirects were added.
- Do not rely on “hotfix later” without a named rollback path.

## Emergency exception procedure

Only Ahmad may grant an emergency exception in writing.

An exception must state:

- Why the private-preview stage is skipped or shortened.
- Which production risk justifies it.
- Time-boxed scope.
- Immediate follow-up to restore the full gate.

Agents must not invent emergency exceptions.

## Documentation-only change handling

Documentation that **does not** affect production runtime may:

- Use a docs branch and draft PR.
- Still must **not** merge to `main` without Explicit Founder Approval.

Documentation that changes contributor/release behaviour (including this policy) follows the same merge rule.

Batch reports must still end with:

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**

when no public release was authorised.

## Production-release checklist

- [ ] Build succeeded on the change branch
- [ ] Automated tests required for the change type passed
- [ ] Protected private preview available and access-verified
- [ ] Ahmad reviewed the private preview
- [ ] Explicit Founder Approval recorded (PR comment or written message naming SHA/PR)
- [ ] PR merged into `main` only after that approval
- [ ] Production deployment follows merge (Git → host), not a manual bypass
- [ ] Post-release smoke of critical URLs
- [ ] Rollback path remains known

## Required final-report language

Every batch or release report that has not received Explicit Founder Approval for public release must state:

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**

After approval and merge, reports must state the approved SHA and production URL checked — never imply approval that was not given.

### Reporting format (mandatory)

All progress, completion, CI, deployment, validation and blocker reports must follow:

**[`docs/standards/REPORTING_STANDARD.md`](../standards/REPORTING_STANDARD.md)**

Use templates under [`templates/`](../../templates/). Do not invent alternate report schemas. Release-gate wording in this policy remains binding; the reporting standard defines structure, timestamps, duration, validation matrices and Overall Status values.

## Relationship to other work

- SEPANAI / Batch 003 foundation docs remain subject to this policy for any future implementation merge.
- World Cup archive Batch 004 and all future GoalCurrent work are bound by this policy without exception unless Ahmad grants a written emergency exception.
- Founder reporting standard (`GC-REPORTING-STANDARD-BATCH-001`) applies to GoalCurrent, SepanAI and FAMVI agent work unless the Founder explicitly overrides.
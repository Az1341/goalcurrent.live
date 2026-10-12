# checklist.md — goalcurrent.live

**Status:** Open review checklist (not a certification) — 12 October 2026.

## Documentation gates
- [ ] Confirm repository purpose, current branch and actual production ownership.
- [ ] Read existing approved Source of Truth and governance files; identify discrepancies.
- [ ] Review [security.md](security.md), [auth.md](auth.md), [data.md](data.md) and [hack.md](hack.md).
- [ ] Map implementation references to each documented control; mark unknown items UNVERIFIED.
- [ ] Verify secrets scanning and dependencies against the current revision.
- [ ] Verify least-privilege authentication and authorisation using synthetic test accounts.
- [ ] Verify data classification, separation, retention and recovery evidence.
- [ ] Check approved action gates, user experience and accessibility requirements.
- [ ] Run applicable test, lint, type-check and build commands; record exact commit SHA and logs.
- [ ] Independently review documentation for contradictions, public disclosure and duplication.
- [ ] Publish a draft pull request with changed files, unresolved findings, owner and rollback method.
- [ ] Obtain required founder review and approval before any merge or deployment.

## Outcomes
**Documentation coverage:** pending review. **Security certification:** NOT PERFORMED. **Production release:** NOT AUTHORISED. Do not interpret these empty checkboxes as failure or proof of a vulnerability.

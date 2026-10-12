# data.md — goalcurrent.live

**Review draft:** 12 October 2026. Do not create a new database, migration or retention policy from this document alone.

## Data inventory
In scope for verification: football public content and protected external API configuration. Inspect the existing schema, source-of-truth documents, storage and data processing code; these are the technical authority.

## Data contract
1. Classify public, internal, confidential and sensitive data. Identify owners, purpose, lawful basis where required, tenancy and approved processors.
2. Restrict reads and writes using existing server-side permissions, row policies where applicable, and auditable service privileges.
3. Minimise collection and avoid sensitive data in prompts, logs, analytics, fixtures and public Git history.
4. Document retention, secure deletion, export, restoration and backups from actual implementation. Treat unverified capabilities as UNVERIFIED.
5. Test access denial across accounts/brands/families/projects using synthetic records. Document data lineage and migration reversibility.
6. No production data migration, write, import or export is authorised by these documentation additions.

## Evidence needed
Schema and migration references; retention register; boundary checks; backup/restore test; privacy and incident contacts; exact-SHA automated test results.

See [security.md](security.md), [auth.md](auth.md), [checklist.md](checklist.md).

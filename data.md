# data.md — GoalCurrent.live

**Purpose:** Existing data-boundary review guide, not a new data policy or schema. **Status:** DRAFT / NOT CERTIFIED, 12 October 2026 (Europe/London).

## Authority
`AGENTS.md`, `docs/ENVIRONMENT.md`, football archive requirements and release policy govern; environment documentation may reflect an older live-feed phase.

## Data separation and handling
- Distinguish publicly published football/fixture/archive content from licensed third-party media and server-only provider API credentials.
- Do not reactivate retired World Cup live score fetches or replace final archived results without separate approved evidence.
- Check sources, attribution and licence for flags, still images, external feeds and videos before display.
- Protect any logged IP, access/analytics metadata and host secrets; do not claim a public page needs sign-in.

## Evidence and approval
Required verification: External feed secret access, archive finality and publish rights, analytics handling and approved page output. Use real code/schema paths and synthetic records for testing. Unexecuted checks are **NOT RUN**, not PASS. No database migration, retention change, live export, production write or credentials are authorised by this document.

**Current gate:** HOLD — no live-feed reactivation or production publication.

Related: [security.md](security.md), [auth.md](auth.md), [hack.md](hack.md), [checklist.md](checklist.md).

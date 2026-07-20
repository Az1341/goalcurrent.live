# GC-SEPAN-PRD-001 — Membership-Gated AI Pilot PRD

**UK date/time:** 2026-07-20 21:38 BST  
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED

## Goals

- Prove SEPANAI as GoalCurrent’s intelligence layer using evidence-linked match explanations.
- Keep public football content available.
- Gate **full** explanations behind free membership.
- Ensure page reading never triggers AI generation.
- Keep generation admin/editor initiated, stored once, served repeatedly.

## Exclusions (mandatory)

- Open unrestricted AI prompt box
- Anonymous generation
- Visitor uploads
- Automatic mass generation for every match
- Ultra intelligence
- Unreviewed AI publication
- Silent expensive provider fallback
- Dual member login systems

## Journeys

### Non-member

1. Browse public GoalCurrent content.
2. May see **selected explanation previews** only.
3. Unlock attempt prompts free membership (Firebase).
4. No AI generation from browsing.

### Free member

1. Signs in via Firebase (Google/Apple).
2. May view full published explanations for pilot matches.
3. May select **prepared** follow-up questions; answers are cached.
4. May save favourite teams/competitions and language preference.
5. Marketing consent is optional and separate from membership.
6. No open prompt box.

### Admin / editor

1. Selects verified match context.
2. Initiates generation via SEPANAI boundary (not page view).
3. Reviews evidence-linked output.
4. Approves, edits, or rejects before publication.
5. May authorise regeneration within budget/policy caps.
6. On budget/provider failure: stop new generation; keep cached published content.

## Functional requirements

| Area | Requirement |
|------|-------------|
| Preview / gate | Non-members see preview only; members see full |
| Full explanation | Stored published artifact; served from store/cache |
| Prepared questions | Predefined; answers cached; no free-text LLM chat |
| Favourites | Team/competition preferences persist for member |
| Language | Preference recorded; delivery language per product i18n |
| Marketing | Opt-in optional; timestamp/source/method stored; unsubscribe supported |
| Editorial | Mandatory approval before public full explanation |
| Evidence | Claims display evidence references; confidence not shown as certainty |
| Generation controls | Feature flag; daily/manual caps; one successful gen per match/version unless admin overrides |
| Budget failure | Serve cache; block new gen; surface ai_budget_blocked analytics |
| Provider failure | Same as budget: no silent paid fallback |
| Data-not-verified | Do not publish explanations for unverified match data (MATCH_NOT_VERIFIED) |
| Account deletion | Request flow; purge/anonymise pilot personal data per policy — Requires final owner/legal review. |
| Accessibility | WCAG-oriented UI for gate, explanation, questions |
| Mobile | Membership gate and explanation readable on small screens |
| Analytics | Pilot events only; do not duplicate page_view / article_open |

## Pilot boundaries

- Basic intelligence only.
- Selected completed matches / competition scope — exact competition list is an OPEN Founder Decision.
- Private pilot before controlled public pilot.

## Acceptance criteria

1. Page load never calls generation.
2. Non-member cannot access full explanation body.
3. Member receives stored published explanation.
4. Unpublished AI output is not public.
5. Prepared questions never invent live free-form tools.
6. When budget/provider blocked, cached content still loads.
7. Marketing opt-out is respected — Requires final owner/legal review.
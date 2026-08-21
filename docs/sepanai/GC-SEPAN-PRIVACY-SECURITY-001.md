# GC-SEPAN-PRIVACY-SECURITY-001 — Pilot Privacy, Consent and Security

**UK date/time:** 2026-07-20 21:50 BST  
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED  
**Legal rule:** Every proposed legal statement below is marked: Requires final owner/legal review.

## 1. Data-flow summary

1. Visitor reads public GoalCurrent content (existing site).
2. Optional Firebase sign-in (Google/Apple) creates a verified identity.
3. Internal identity adapter maps Firebase UID → member record (pilot design).
4. Non-members see explanation previews only; members unlock full stored explanations.
5. Admin/editor initiates generation through SEPANAI `POST /v1/explanations`.
6. SEPANAI classifies task/policy, calls approved provider adapter, validates structured output, records audit/budget, returns result for editorial review.
7. Published explanation is stored once and served repeatedly; page reads never trigger generation.
8. Marketing consent (optional) is separate from membership and recorded with version/timestamp/source/method.

Live Firebase/Upstash/provider production configuration: **NOT VERIFIED** without credentials.

## 2. Personal-data inventory

| Data | Purpose | Sensitivity | Retention category |
|------|---------|-------------|--------------------|
| Firebase UID / email / display name (as provided by IdP) | Membership identity | High | Account lifetime + deletion process |
| Member preferences (teams, competitions, language) | Personalisation | Medium | Account lifetime |
| Marketing consent history | Compliance | High | Legal/compliance retention — Requires final owner/legal review. |
| Marketing suppression | Honour opt-out | High | Indefinite while suppression required — Requires final owner/legal review. |
| Explanation feedback | Quality | Low–medium | Pilot retention |
| Account deletion requests | Compliance | High | Process + audit retention — Requires final owner/legal review. |
| AI generation audit (actor IDs, not raw Firebase tokens to providers) | Security/cost | Medium–high | Operational + audit |
| GA4 analytics (consent-gated) | Product analytics | Medium | Per GA4 retention settings — NOT VERIFIED live |

## 3. Football-data inventory

Match metadata, events, statistics, editorial theses, explanation text, evidence references, prepared questions, cached answers. Generally non-personal sports content; still subject to licensing and accuracy rules. Unverified match data must not be published as verified.

## 4. Firebase identity flow

- Member-facing auth remains Firebase (ADR Option C).
- Server verifies Firebase ID tokens via Firebase Admin when configured.
- SEPANAI receives Firebase-derived actor context (internal member ID / role), not raw Firebase tokens forwarded to AI providers.
- Live production Firebase env: **NOT VERIFIED**.

## 5. SEPANAI request minimisation

Send only: match identifiers, verified football facts required for the brief, language, policy/task class, idempotency key, actor role (admin/editor), budget/policy flags. Do not send marketing emails, full preference dumps, or unrelated PII to providers.

## 6. Provider-data exposure

- Prefer **paid** Gemini 2.5 Flash-Lite: pricing table indicates paid-tier content is not used to improve products; free-tier content may be. Requires final owner/legal review.
- Free-tier use only with non-personal football data + explicit founder acceptance. Requires final owner/legal review.
- No automatic multi-provider fallback that silently re-sends content.
- Provider model IDs are adapter-internal, not public API contract fields.

## 7. Marketing consent

- Optional and separate from free membership.
- Record: consent wording version, timestamp, source, method (UI checkbox / settings).
- Opt-out writes suppression and stops marketing sends.
- Essential account emails (security, verification) are not marketing. Requires final owner/legal review.

## 8. Consent wording version / timestamp / source / method

Store immutable history rows on change. UI copy and privacy-policy text: Requires final owner/legal review.

## 9. Unsubscribe and suppression

Honour opt-out immediately in app records; suppress list prevents re-contact for marketing. External ESP sync: **NOT IMPLEMENTED** / **NOT VERIFIED** on main.

## 10. Essential account emails

Security, verification, and account-deletion notices only. Marketing never piggybacks. Requires final owner/legal review.

## 11. Account deletion

User-initiated deletion request → verify identity → delete or anonymise member-linked personal data per retention policy → retain non-personal published football explanations and aggregate audit as allowed. Requires final owner/legal review.

## 12. Retention

Categories: account-lifetime, compliance/consent history, operational audit, published editorial content, analytics. Exact periods: Requires final owner/legal review.

## 13. Log redaction

Redact tokens, emails, phone numbers, and full prompts containing unnecessary PII from application logs. Audit IDs and cost metadata retained.

## 14. Secrets management

No secrets in git. Use platform env vars. `.env.example` documents names only. This batch adds no credentials.

## 15. Admin access

Generation and publication limited to administrator/editor roles. Membership unlock does not grant generation privilege.

## 16. Abuse prevention

Existing Upstash rate limits (60/min general, 30/min upstream when configured) plus pilot generation quotas, daily/monthly budget ledger, idempotency keys. Live Upstash: **NOT VERIFIED**.

## 17. Prompt injection

Treat match/editorial inputs as untrusted. Structured schemas + quality gate + mandatory editorial review before publication. No open visitor prompt box in pilot.

## 18. Editorial manipulation

Only authorised roles can approve publication. Unpublished AI drafts not member-visible as full explanations.

## 19. Provider outage

Serve cached published explanations; return `PROVIDER_UNAVAILABLE`; stop new generation; no silent paid fallback.

## 20. Cost exhaustion

`DAILY_BUDGET_REACHED` / `MONTHLY_BUDGET_REACHED` / `GENERATION_LIMIT_REACHED`; cached content remains available.

## 21. Replay / idempotency attacks

Require `Idempotency-Key`; duplicate successful generations map to same result (`DUPLICATE_REQUEST` or idempotent replay). Service authentication for SEPANAI calls.

## 22. Privilege escalation

Never elevate visitor → generator via client flags alone. Server checks role after Firebase verification.

## 23. Unverified match-data publication

`MATCH_NOT_VERIFIED` blocks generation/publication when evidence gate fails. Do not label unverified data as verified.

## 24. Threat register (summary)

| Threat | Mitigation | Status |
|--------|------------|--------|
| Token leakage to providers | Actor context only | Design |
| Cost abuse | Budgets + admin-only gen | Design |
| Dual-auth confusion | Firebase only for members | ADR C |
| Unreviewed AI publish | Editorial gate | PRD |
| Free-tier training risk | Prefer paid Gemini | Cost study |
| Live misconfiguration | NOT VERIFIED until credentials audited | Open |

## 25. Privacy-policy changes

Pilot membership, AI explanations, provider processing, marketing consent, deletion, and analytics consent must be reflected in public policy when features go live. Requires final owner/legal review.

## Classification note

Missing live credentials cause **NOT VERIFIED** items, not a batch stop. No authentication or production code is authorised by this document.
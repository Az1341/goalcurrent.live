# GC-SEPAN-DATA-MODEL-001 — Minimum Pilot Data Model

**UK date/time:** 2026-07-20 21:42 BST  
**Status:** PROPOSED reconciliation — SQL not modified in this batch  
**Note:** Rebuild migration supabase/migrations/20260719180000_gc_v2_initial.sql exists only on goalcurrent-v2-rebuild (NOT IMPLEMENTED on main).

## Design rules

- Firebase UID is the member-facing identity; map via member_identity_links.
- Do not activate Supabase Auth user tables for login.
- Do not duplicate GA4 event stores for page_view / article_open.
- Provenance and audit fields on AI artifacts.

## Record catalogue

| Record | Purpose | PK | Core fields | Relationships | Retention | Access owner | Sensitive | Indexes / uniqueness |
|--------|---------|----|-------------|---------------|-----------|--------------|-----------|----------------------|
| members | Internal member profile | member_id | status, created_at | identity_links | Account lifecycle — Requires final owner/legal review. | App | PII flags | unique member_id |
| member_identity_links | Firebase to member map | link_id | provider=firebase, subject=uid | members | While account active | App | UID | unique (provider, subject) |
| member_preferences | Favourites, locale | member_id | teams, competitions, locale | members | While account active | Member | Low | PK member_id |
| marketing_consent_history | Consent versions | event_id | member_id, version, granted, source, method, ts | members | Legal retention — Requires final owner/legal review. | App | Consent PII | (member_id, ts) |
| marketing_suppression | Do-not-contact | member_id/email_hash | reason, ts | — | Until lifted — Requires final owner/legal review. | App | Contact | unique key |
| matches | Pilot match snapshot | match_id | competition, kickoff, status, verified | events/stats | Product archive | Editorial/data | Low | match_id; verified flag |
| match_events | Events evidence | event_id | match_id, minute, type, payload | matches | With match | Data | Low | (match_id, minute) |
| match_statistics | Stats evidence | stat_id | match_id, team/player, metrics | matches | With match | Data | Low | (match_id, entity) |
| editorial_theses | Editor framing | thesis_id | match_id, body, status | matches | Editorial | Editor | Low | match_id+version |
| explanation_briefs | Generated/reviewed brief | brief_id | match_id, editorial_status, cache_key | sections/evidence | Product | Editor | Model text | unique cache_key; idempotency_key |
| explanation_sections | Brief sections | section_id | brief_id, ord, body | briefs | With brief | Editor | Model text | (brief_id, ord) |
| explanation_evidence | Evidence rows | evidence_id | brief_id, source_ref, summary | briefs, events/stats | With brief | Editor | Low | brief_id |
| prepared_questions | Follow-ups | question_id | brief_id, prompt_text | cached_answers | With brief | Editor | Low | (brief_id, ord) |
| cached_answers | Prepared answers | answer_id | question_id, body | questions | With brief | App | Model text | unique question_id |
| explanation_feedback | Member feedback | feedback_id | brief_id, member_id, rating | briefs/members | Limited — Requires final owner/legal review. | App | Member link | (brief_id, member_id) |
| ai_generation_audit | Generation audit | audit_id | actor, match_id, status, latency, tokens | briefs | Security/ops retention — Requires final owner/legal review. | System | Usage meta | audit_id; idempotency_key unique |
| ai_budget_ledger | Cost ledger | entry_id | period, amount_usd, reason | — | Finance/ops | System | Cost | (period) |
| feature_flags | Pilot flags | flag_key | enabled, audience | — | Config | Admin | Low | PK flag_key |
| account_deletion_requests | Deletion workflow | request_id | member_id, status, ts | members | Legal — Requires final owner/legal review. | App | PII | member_id open unique |

## Rebuild migration mapping

| Category | Items |
|----------|-------|
| Potentially reusable | Match/event/stat shaped tables; brief/section concepts; evidence concepts — port selectively after schema diff |
| Missing vs pilot list | member_identity_links, marketing_consent_history, marketing_suppression, ai_budget_ledger, account_deletion_requests, prepared question cache split — MISSING until diff confirms |
| Must not duplicate | Firebase Auth users as second login directory; GA4 page_view stores |
| Needs amendment | Any rebuild users table used as Auth — must not be member-facing auth |

Exact column-level diff against 20260719180000_gc_v2_initial.sql remains NOT VERIFIED line-by-line; implementation batch must diff before porting. Do not modify SQL in Batch 003.
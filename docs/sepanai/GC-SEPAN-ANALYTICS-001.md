# GC-SEPAN-ANALYTICS-001 — Pilot Analytics and Success Framework

**UK date/time:** 2026-07-20 21:55 BST  
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED  
**GA4 Measurement ID (verified in repo docs/pack):** `G-X84HCE5KGT`

## Guardrails

- Do **not** create another `page_view` or `article_open` emitter.
- Reuse existing SPA `page_view` pipeline (`send_page_view: false`, consent gate, remount dedupe).
- GA4 Enhanced Measurement browser-history setting: founder-side verification required (**NOT VERIFIED** live Admin).
- All pilot events honour analytics consent before send.
- Data minimisation: no emails, Firebase tokens, or full explanation text in event parameters.
- Key-event recommendation: mark `account_signup_completed`, `explanation_full_view`, and `email_marketing_opt_in` as key events in GA4 Admin after founder approval.

## Event catalogue

| Event | Parameters | Trigger | Consent | Deduplication key |
|-------|------------|---------|---------|-------------------|
| `account_signup_started` | `method` (google\|apple) | Auth start click | Analytics | `uid_session` + method + day |
| `account_signup_completed` | `method` | First successful Firebase session for new member link | Analytics | `firebase_uid` once |
| `email_verification_completed` | `method` | Verified email state observed | Analytics | `firebase_uid` once |
| `email_marketing_opt_in` | `consent_version` | Marketing opt-in saved | Analytics + marketing UI | `member_id` + version + ts |
| `email_marketing_opt_out` | `consent_version` | Opt-out / suppression | Analytics | `member_id` + version + ts |
| `favourite_team_saved` | `team_id` | Preference save | Analytics | `member_id` + team_id + day |
| `favourite_competition_saved` | `competition_id` | Preference save | Analytics | `member_id` + competition_id + day |
| `explanation_preview_view` | `match_id`, `explanation_id` | Preview rendered | Analytics | `session` + explanation_id |
| `explanation_unlock_attempt` | `match_id`, `explanation_id`, `outcome` | Gate interaction | Analytics | `session` + explanation_id + outcome |
| `explanation_full_view` | `match_id`, `explanation_id` | Full content shown to member | Analytics | `session` + explanation_id |
| `prepared_question_selected` | `question_id`, `explanation_id` | Question tap | Analytics | `session` + question_id |
| `cached_answer_served` | `question_id`, `cache_key` | Cached answer displayed | Analytics | `session` + cache_key |
| `ai_generation_started` | `match_id`, `audit_id`, `intelligence_level` | Admin gen start | Analytics (admin) | `audit_id` |
| `ai_generation_completed` | `match_id`, `audit_id`, `latency_ms`, `cost_estimate_usd` | Successful gen | Analytics (admin) | `audit_id` |
| `ai_generation_failed` | `match_id`, `audit_id`, `error_code` | Failed gen | Analytics (admin) | `audit_id` |
| `ai_budget_blocked` | `scope` (daily\|monthly\|limit), `error_code` | Budget/circuit stop | Analytics (admin) | `day` + scope |
| `email_click_return` | `campaign_id` (non-PII) | Landing from email link | Analytics | `session` + campaign_id |
| `account_deleted` | none (or `reason_code` non-PII) | Deletion completed | Analytics | `member_id` once |

Do not emit provider brand names as permanent required parameters.

## Funnels (proposed)

1. **Membership:** preview → unlock_attempt → signup_started → signup_completed → full_view  
2. **Engagement:** full_view → prepared_question_selected → cached_answer_served  
3. **Marketing:** signup_completed → email_marketing_opt_in (optional)  
4. **Editorial ops:** generation_started → completed|failed|budget_blocked → (later) full_view volume

## Retention metrics (proposed)

- 7-day return: members with ≥1 session on day 0 and day 7.
- Explanation unlock rate: full_view / preview_view (members + unlock attempts).
- Cached-response rate: cached_answer_served / prepared_question_selected.

## Cost metrics (ops, not GA4-primary)

From `ai_budget_ledger` / audit: cost per successful explanation, daily/monthly spend vs ceiling, blocked count.

## Editorial-quality metrics

Approval rate (approved / generated), validation failure rate, regeneration count per match/version.

## Proposed pilot success thresholds

**Label: proposed pilot targets, not historical results.**

| Metric | Proposed target |
|--------|-----------------|
| Visitor-to-member conversion | ≥ 2% of explanation-preview visitors who start signup complete membership within 7 days |
| Explanation unlock rate | ≥ 40% of member unlock attempts result in full_view |
| Seven-day return rate | ≥ 20% of new members return within 7 days |
| Cached-response rate | ≥ 90% of prepared-question selections serve cache |
| AI cost per explanation | ≤ $0.01 USD planning (Gemini estimate ~$0.0014) |
| Editorial approval rate | ≥ 70% of generations approved without discard |
| Generation failure rate | ≤ 10% of started generations |
| Marketing opt-in rate | Measured only; no hard target for privacy-safe pilot (informational) |

## Weekly founder report (content)

- New members, full_views, unlock conversion
- Generations started/completed/failed/budget-blocked
- Spend vs £ ceiling and warning thresholds
- Top matches by full_view
- Consent opt-in/out counts
- Open blockers / incidents

## Classification

Live GA4 Admin key-event configuration and Enhanced Measurement history setting remain **NOT VERIFIED** until founder confirms in GA4 console.
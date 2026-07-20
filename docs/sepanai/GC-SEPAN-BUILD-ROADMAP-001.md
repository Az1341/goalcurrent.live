# GC-SEPAN-BUILD-ROADMAP-001 — Controlled Cursor Build Roadmap

**UK date/time:** 2026-07-20 22:00 BST
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED
**Rule:** ≤10 tasks per batch. Implementation blocked until Founder Decision Pack approvals.

## Mandatory roadmap decision

- Do **not** merge `goalcurrent-v2-rebuild` wholesale.
- Create a fresh future implementation branch from **current main**.
- Audit and **selectively port** reusable rebuild components only.
- No authentication production-code changes until Auth ADR is founder-approved.
- No provider accounts, credentials, or paid activation in documentation batches.

## Batch 1 — Branch reconciliation and safe baseline

#### B1-T01
- **Purpose:** Create implementation branch from current main
- **Dependencies:** Founder Approval of Decision Pack
- **Expected files:** git branch only
- **Prohibited changes:** No wholesale rebuild merge; no secrets; no deploy; no dual member login; no OpenAI/Gemini fields on public contract; no open prompt box; no anonymous generation.
- **Acceptance criteria:** Branch exists from latest main SHA
- **Tests:** git log / merge-base checks
- **Evidence:** Branch SHA recorded
- **Commit boundary:** chore: create pilot implementation branch
- **Rollback:** Delete branch
- **Audit requirement:** Record main SHA

#### B1-T02
- **Purpose:** Inventory rebuild reusable paths
- **Dependencies:** B1-T01
- **Expected files:** docs/sepanai port checklist
- **Prohibited changes:** No wholesale rebuild merge; no secrets; no deploy; no dual member login; no OpenAI/Gemini fields on public contract; no open prompt box; no anonymous generation.
- **Acceptance criteria:** Checklist of portable vs discard files
- **Tests:** Path existence checks on rebuild
- **Evidence:** Checklist committed
- **Commit boundary:** docs: list selective port inventory
- **Rollback:** Revert doc
- **Audit requirement:** Diff vs rebuild listed

#### B1-T03
- **Purpose:** Define feature-flag skeleton for pilot
- **Dependencies:** B1-T01
- **Expected files:** feature flag docs/config names only until impl
- **Prohibited changes:** No wholesale rebuild merge; no secrets; no deploy; no dual member login; no OpenAI/Gemini fields on public contract; no open prompt box; no anonymous generation.
- **Acceptance criteria:** Pilot flags named and default-off policy
- **Tests:** Unit tests for flag defaults when coded
- **Evidence:** Flag matrix
- **Commit boundary:** feat: add pilot feature flag defaults
- **Rollback:** Disable flags
- **Audit requirement:** Flags default false in prod

#### B1-T04
- **Purpose:** Baseline regression green on branch
- **Dependencies:** B1-T01
- **Expected files:** CI / local verify scripts
- **Prohibited changes:** No unrelated prod refactors
- **Acceptance criteria:** Unit/i18n/build pass or pre-existing failures documented
- **Tests:** npm run test:unit; i18n:check; build
- **Evidence:** Verification note
- **Commit boundary:** chore: record baseline verification
- **Rollback:** N/A docs
- **Audit requirement:** Attach logs

#### B1-T05
- **Purpose:** Environment variable matrix for pilot services
- **Dependencies:** B1-T02
- **Expected files:** .env.example comments only when approved
- **Prohibited changes:** No live secrets
- **Acceptance criteria:** Names documented; live values NOT VERIFIED
- **Tests:** grep secrets absent
- **Evidence:** Matrix in docs
- **Commit boundary:** docs: pilot env matrix
- **Rollback:** Revert
- **Audit requirement:** No credentials committed

## Batch 2 — Authentication adapter and member records

#### B2-T01
- **Purpose:** Design identity adapter interfaces
- **Dependencies:** Auth ADR approved
- **Expected files:** src/lib/identity/* (future)
- **Prohibited changes:** No Supabase Auth for members; no Firebase rewrite
- **Acceptance criteria:** Adapter maps Firebase UID→member_id
- **Tests:** Unit tests for mapping
- **Evidence:** ADR link
- **Commit boundary:** feat: add identity adapter stubs
- **Rollback:** Remove adapter
- **Audit requirement:** No raw tokens stored

#### B2-T02
- **Purpose:** Create members + member_identity_links schema
- **Dependencies:** B2-T01; Data Model
- **Expected files:** migrations (new, not wholesale rebuild)
- **Prohibited changes:** Do not activate Supabase Auth
- **Acceptance criteria:** Tables match data model
- **Tests:** Migration dry-run
- **Evidence:** SQL review
- **Commit boundary:** feat: add member identity tables
- **Rollback:** Down migration
- **Audit requirement:** PII fields listed

#### B2-T03
- **Purpose:** Server session verification path documentation→impl
- **Dependencies:** B2-T01
- **Expected files:** server helpers using existing Firebase Admin
- **Prohibited changes:** No second login UI
- **Acceptance criteria:** Verified token→member link
- **Tests:** Auth unit tests
- **Evidence:** Flow diagram
- **Commit boundary:** feat: wire member link on verified session
- **Rollback:** Feature flag off
- **Audit requirement:** Role checks

#### B2-T04
- **Purpose:** Account deletion request record path
- **Dependencies:** B2-T02
- **Expected files:** account_deletion_requests
- **Prohibited changes:** No silent hard-delete without policy
- **Acceptance criteria:** Request capture works
- **Tests:** API tests
- **Evidence:** Privacy doc link
- **Commit boundary:** feat: account deletion request flow
- **Rollback:** Disable endpoint
- **Audit requirement:** Legal review flag

## Batch 3 — Consent and preference architecture

#### B3-T01
- **Purpose:** member_preferences tables
- **Dependencies:** Batch 2
- **Expected files:** migrations + types
- **Prohibited changes:** No wholesale rebuild merge; no secrets; no deploy; no dual member login; no OpenAI/Gemini fields on public contract; no open prompt box; no anonymous generation.
- **Acceptance criteria:** Teams/competitions/language stored
- **Tests:** CRUD tests
- **Evidence:** Schema review
- **Commit boundary:** feat: member preferences schema
- **Rollback:** Down migration
- **Audit requirement:** Sensitive fields noted

#### B3-T02
- **Purpose:** marketing_consent_history + suppression
- **Dependencies:** B3-T01
- **Expected files:** migrations + API
- **Prohibited changes:** Marketing not tied to membership gate
- **Acceptance criteria:** Opt-in/out versioned
- **Tests:** Consent tests
- **Evidence:** Version string
- **Commit boundary:** feat: marketing consent ledger
- **Rollback:** Disable marketing
- **Audit requirement:** Requires final owner/legal review.

#### B3-T03
- **Purpose:** Preference UI behind feature flag
- **Dependencies:** B3-T01
- **Expected files:** UI components
- **Prohibited changes:** No cards clutter beyond existing DS
- **Acceptance criteria:** Save emits analytics events
- **Tests:** a11y tests
- **Evidence:** Screenshots
- **Commit boundary:** feat: preference settings UI
- **Rollback:** Flag off
- **Audit requirement:** Consent copy review

#### B3-T04
- **Purpose:** Essential vs marketing email policy wiring
- **Dependencies:** B3-T02
- **Expected files:** docs + send guards
- **Prohibited changes:** No ESP account creation in this task without approval
- **Acceptance criteria:** Suppression respected
- **Tests:** Unit tests
- **Evidence:** Policy checklist
- **Commit boundary:** feat: email send guards
- **Rollback:** Disable sends
- **Audit requirement:** Requires final owner/legal review.

## Batch 4 — SEPANAI API boundary

#### B4-T01
- **Purpose:** Implement POST /v1/explanations contract surface
- **Dependencies:** API Contract approved
- **Expected files:** API route + Zod schemas
- **Prohibited changes:** No provider-specific public fields
- **Acceptance criteria:** Error codes match contract
- **Tests:** Contract tests
- **Evidence:** OpenAPI/schema dump
- **Commit boundary:** feat: sepanai explanations v1 endpoint
- **Rollback:** Flag disable generation
- **Audit requirement:** Authz admin-only

#### B4-T02
- **Purpose:** Service authentication + actor context
- **Dependencies:** B4-T01; Batch 2
- **Expected files:** auth middleware
- **Prohibited changes:** Do not forward Firebase tokens to providers
- **Acceptance criteria:** UNAUTHENTICATED/UNAUTHORISED paths
- **Tests:** Security tests
- **Evidence:** Redacted logs
- **Commit boundary:** feat: sepanai service authz
- **Rollback:** Revert
- **Audit requirement:** Token redaction audit

#### B4-T03
- **Purpose:** Idempotency-Key store
- **Dependencies:** B4-T01
- **Expected files:** idempotency table/cache
- **Prohibited changes:** No duplicate paid gens
- **Acceptance criteria:** Duplicate returns same audit
- **Tests:** Idempotency tests
- **Evidence:** Key samples
- **Commit boundary:** feat: explanation idempotency
- **Rollback:** Clear store
- **Audit requirement:** Replay attack notes

#### B4-T04
- **Purpose:** Timeouts and versioning headers
- **Dependencies:** B4-T01
- **Expected files:** client/server config
- **Prohibited changes:** No breaking public fields
- **Acceptance criteria:** Timeout behaviour documented
- **Tests:** Timeout tests
- **Evidence:** Version header
- **Commit boundary:** feat: sepanai timeouts versioning
- **Rollback:** Revert
- **Audit requirement:** Compat matrix

## Batch 5 — Provider adapter and structured validation

#### B5-T01
- **Purpose:** Provider-neutral adapter interface
- **Dependencies:** Batch 4; Cost Study
- **Expected files:** src/lib/sepanai/providers/*
- **Prohibited changes:** No permanent OpenAI/Gemini public contract fields
- **Acceptance criteria:** Swap providers without API change
- **Tests:** Adapter unit tests
- **Evidence:** Interface doc
- **Commit boundary:** feat: sepanai provider adapter interface
- **Rollback:** Remove adapters
- **Audit requirement:** Model ID internal only

#### B5-T02
- **Purpose:** Gemini 2.5 Flash-Lite adapter (after founder+paid setup)
- **Dependencies:** B5-T01; Founder provider approve
- **Expected files:** gemini adapter
- **Prohibited changes:** No free-tier silently; no auto fallback
- **Acceptance criteria:** Structured output validated
- **Tests:** Fixture tests
- **Evidence:** Sample redacted response
- **Commit boundary:** feat: gemini flash-lite adapter
- **Rollback:** Disable provider
- **Audit requirement:** Data-use terms noted

#### B5-T03
- **Purpose:** Structured response validation + quality gate
- **Dependencies:** B5-T01
- **Expected files:** validators
- **Prohibited changes:** No unreviewed publish
- **Acceptance criteria:** VALIDATION_FAILED path
- **Tests:** Schema tests
- **Evidence:** Failure corpus
- **Commit boundary:** feat: explanation validation gate
- **Rollback:** Bypass banned
- **Audit requirement:** Editorial still required

#### B5-T04
- **Purpose:** Selective port of rebuild explanation-engine ideas
- **Dependencies:** B5-T01; port inventory
- **Expected files:** prompts/quality modules as needed
- **Prohibited changes:** No wholesale rebuild merge; no direct OpenAI in edge as permanent
- **Acceptance criteria:** Ported files listed
- **Tests:** Unit tests
- **Evidence:** Port log
- **Commit boundary:** refactor: port explanation helpers selectively
- **Rollback:** Revert files
- **Audit requirement:** Diff against rebuild

#### B5-T05
- **Purpose:** Circuit breaker on provider errors
- **Dependencies:** B5-T02
- **Expected files:** breaker config
- **Prohibited changes:** No silent paid fallback
- **Acceptance criteria:** PROVIDER_UNAVAILABLE served with cache
- **Tests:** Breaker tests
- **Evidence:** Metrics
- **Commit boundary:** feat: provider circuit breaker
- **Rollback:** Reset breaker
- **Audit requirement:** Ops runbook

## Batch 6 — Budget ledger, quotas and circuit breaker

#### B6-T01
- **Purpose:** ai_budget_ledger + quotas
- **Dependencies:** Data Model; Cost Study ceilings approved
- **Expected files:** migrations + service
- **Prohibited changes:** No generation when capped
- **Acceptance criteria:** £ ceilings enforced
- **Tests:** Budget tests
- **Evidence:** Ledger samples
- **Commit boundary:** feat: ai budget ledger
- **Rollback:** Raise only via founder
- **Audit requirement:** Currency caveat

#### B6-T02
- **Purpose:** Daily/monthly stop + warning thresholds
- **Dependencies:** B6-T01
- **Expected files:** budget policy
- **Prohibited changes:** No override without admin+audit
- **Acceptance criteria:** 60/80/100% behaviour
- **Tests:** Threshold tests
- **Evidence:** Alerts design
- **Commit boundary:** feat: budget thresholds
- **Rollback:** Disable gen
- **Audit requirement:** Founder notify path

#### B6-T03
- **Purpose:** Per-match version generation limit
- **Dependencies:** B6-T01
- **Expected files:** quota rules
- **Prohibited changes:** Max one success unless admin
- **Acceptance criteria:** DUPLICATE/LIMIT errors
- **Tests:** Quota tests
- **Evidence:** Audit rows
- **Commit boundary:** feat: per-match generation quota
- **Rollback:** Admin override audited
- **Audit requirement:** Idempotency link

#### B6-T04
- **Purpose:** Private-test daily manual cap (10)
- **Dependencies:** B6-T01
- **Expected files:** policy config
- **Prohibited changes:** No mass generation
- **Acceptance criteria:** 10/day enforced
- **Tests:** Cap tests
- **Evidence:** Config evidence
- **Commit boundary:** feat: daily manual generation cap
- **Rollback:** Config rollback
- **Audit requirement:** Ops note

## Batch 7 — Editorial workflow

#### B7-T01
- **Purpose:** explanation_briefs/sections/evidence storage
- **Dependencies:** Batches 4–6
- **Expected files:** DB + admin APIs
- **Prohibited changes:** No auto-publish
- **Acceptance criteria:** Draft vs published states
- **Tests:** CRUD tests
- **Evidence:** Status enum
- **Commit boundary:** feat: editorial explanation storage
- **Rollback:** Flag off
- **Audit requirement:** Evidence required

#### B7-T02
- **Purpose:** Admin review UI
- **Dependencies:** B7-T01
- **Expected files:** admin UI
- **Prohibited changes:** Unreviewed AI not public full
- **Acceptance criteria:** Approve/reject flows
- **Tests:** a11y + e2e smoke
- **Evidence:** Screenshots
- **Commit boundary:** feat: editorial review UI
- **Rollback:** Flag off
- **Audit requirement:** Role checks

#### B7-T03
- **Purpose:** MATCH_NOT_VERIFIED gate
- **Dependencies:** B7-T01
- **Expected files:** verification service
- **Prohibited changes:** No unverified as verified
- **Acceptance criteria:** Error code path
- **Tests:** Gate tests
- **Evidence:** Evidence rules
- **Commit boundary:** feat: match verification gate
- **Rollback:** Strict mode on
- **Audit requirement:** Data quality log

#### B7-T04
- **Purpose:** Regeneration authorised path
- **Dependencies:** B7-T02; B6
- **Expected files:** admin action
- **Prohibited changes:** Not visitor-triggered
- **Acceptance criteria:** Audit + budget charged
- **Tests:** Authz tests
- **Evidence:** Audit ID
- **Commit boundary:** feat: authorised regenerate
- **Rollback:** Disable
- **Audit requirement:** Cost note

## Batch 8 — Membership-gated delivery

#### B8-T01
- **Purpose:** Preview vs full explanation rendering
- **Dependencies:** PRD; Batch 2
- **Expected files:** UI components
- **Prohibited changes:** No cards beyond DS norms; no open prompt
- **Acceptance criteria:** Non-members preview only
- **Tests:** e2e membership gate
- **Evidence:** Screenshots
- **Commit boundary:** feat: explanation membership gate
- **Rollback:** Flag off
- **Audit requirement:** No PII in HTML extras

#### B8-T02
- **Purpose:** Unlock attempt UX + analytics
- **Dependencies:** B8-T01; Analytics doc
- **Expected files:** UI + events
- **Prohibited changes:** Do not duplicate page_view/article_open
- **Acceptance criteria:** Events fire with consent
- **Tests:** Analytics unit tests
- **Evidence:** Event payloads
- **Commit boundary:** feat: unlock analytics events
- **Rollback:** Disable events
- **Audit requirement:** Consent gate

#### B8-T03
- **Purpose:** Serve stored published only
- **Dependencies:** B7
- **Expected files:** read path
- **Prohibited changes:** Page read never generates AI
- **Acceptance criteria:** No gen on GET
- **Tests:** Integration test
- **Evidence:** Cache headers
- **Commit boundary:** feat: published explanation read path
- **Rollback:** Revert
- **Audit requirement:** Gen disabled on read

#### B8-T04
- **Purpose:** Budget/outage graceful empty states
- **Dependencies:** B6; PRD
- **Expected files:** UI copy
- **Prohibited changes:** No invented facts
- **Acceptance criteria:** Cached remain; clear failure states
- **Tests:** UI tests
- **Evidence:** Copy review
- **Commit boundary:** feat: generation unavailable states
- **Rollback:** Copy rollback
- **Audit requirement:** Requires final owner/legal review. for legal claims

## Batch 9 — Prepared questions and caching

#### B9-T01
- **Purpose:** prepared_questions + cached_answers tables
- **Dependencies:** Data Model
- **Expected files:** migrations
- **Prohibited changes:** No wholesale rebuild merge; no secrets; no deploy; no dual member login; no OpenAI/Gemini fields on public contract; no open prompt box; no anonymous generation.
- **Acceptance criteria:** Unique cache keys
- **Tests:** Schema tests
- **Evidence:** Index list
- **Commit boundary:** feat: prepared questions schema
- **Rollback:** Down migration
- **Audit requirement:** No visitor uploads

#### B9-T02
- **Purpose:** Admin prepare questions workflow
- **Dependencies:** B9-T01; B7
- **Expected files:** admin UI/API
- **Prohibited changes:** No unrestricted prompt box
- **Acceptance criteria:** Questions linked to explanation
- **Tests:** e2e admin
- **Evidence:** Fixtures
- **Commit boundary:** feat: prepare questions admin
- **Rollback:** Flag off
- **Audit requirement:** Editorial approval

#### B9-T03
- **Purpose:** Member select → cached serve
- **Dependencies:** B9-T01; B8
- **Expected files:** read API + UI
- **Prohibited changes:** No on-demand gen
- **Acceptance criteria:** cached_answer_served event
- **Tests:** e2e
- **Evidence:** Cache hit metrics
- **Commit boundary:** feat: cached answer delivery
- **Rollback:** Flag off
- **Audit requirement:** Miss returns safe empty

#### B9-T04
- **Purpose:** Cache invalidation on new approved version
- **Dependencies:** B9-T03
- **Expected files:** invalidation rules
- **Prohibited changes:** No stale wrong version
- **Acceptance criteria:** Versioned keys
- **Tests:** Unit tests
- **Evidence:** Version matrix
- **Commit boundary:** feat: answer cache versioning
- **Rollback:** Revert
- **Audit requirement:** Audit

## Batch 10 — Analytics, accessibility and QA

#### B10-T01
- **Purpose:** Implement pilot GA4 events catalogue
- **Dependencies:** Analytics doc
- **Expected files:** analytics helpers
- **Prohibited changes:** No new page_view/article_open emitters
- **Acceptance criteria:** All listed events covered or explicitly deferred
- **Tests:** Unit tests + consent tests
- **Evidence:** Event matrix
- **Commit boundary:** feat: pilot ga4 events
- **Rollback:** Flag off
- **Audit requirement:** Dedup keys

#### B10-T02
- **Purpose:** Accessibility pass on pilot surfaces
- **Dependencies:** Batches 8–9
- **Expected files:** components
- **Prohibited changes:** No emoji-only critical UI where existing rules forbid
- **Acceptance criteria:** a11y tests pass
- **Tests:** npm a11y / playwright a11y
- **Evidence:** Report
- **Commit boundary:** test: pilot a11y coverage
- **Rollback:** Fix or flag
- **Audit requirement:** WCAG notes

#### B10-T03
- **Purpose:** Visual regression for gate/preview
- **Dependencies:** B10-T02
- **Expected files:** playwright visual
- **Prohibited changes:** No unrelated snapshot churn
- **Acceptance criteria:** Baselines updated intentionally
- **Tests:** visual tests
- **Evidence:** Diffs
- **Commit boundary:** test: pilot visual baselines
- **Rollback:** Restore baselines
- **Audit requirement:** Review diffs

#### B10-T04
- **Purpose:** Security regression checklist
- **Dependencies:** Privacy doc
- **Expected files:** checklist + tests
- **Prohibited changes:** No secrets in repo
- **Acceptance criteria:** Threat mitigations checked
- **Tests:** grep + unit
- **Evidence:** Checklist signed
- **Commit boundary:** docs: pilot security QA checklist
- **Rollback:** N/A
- **Audit requirement:** Redaction sample

#### B10-T05
- **Purpose:** i18n strings for pilot UI
- **Dependencies:** B8–B9
- **Expected files:** locale files
- **Prohibited changes:** No untranslated critical paths
- **Acceptance criteria:** i18n:check pass
- **Tests:** npm run i18n:check
- **Evidence:** Locale diff
- **Commit boundary:** feat: pilot i18n strings
- **Rollback:** Revert locales
- **Audit requirement:** EN+existing locales

## Batch 11 — Private pilot

#### B11-T01
- **Purpose:** Enable private flag for founder/admin only
- **Dependencies:** Batches 1–10; Founder Approve
- **Expected files:** feature flags
- **Prohibited changes:** No public mass enable
- **Acceptance criteria:** Only allowlisted access
- **Tests:** Manual QA
- **Evidence:** Allowlist
- **Commit boundary:** chore: enable private pilot flag
- **Rollback:** Disable flag
- **Audit requirement:** Spend ceiling £2

#### B11-T02
- **Purpose:** Seed selected completed matches one competition
- **Dependencies:** B11-T01
- **Expected files:** seed data
- **Prohibited changes:** No mass generation
- **Acceptance criteria:** Matches verified
- **Tests:** Manual QA
- **Evidence:** Match list
- **Commit boundary:** chore: seed private pilot matches
- **Rollback:** Unpublish
- **Audit requirement:** Evidence check

#### B11-T03
- **Purpose:** Run ≤10 gens/day; monitor budget
- **Dependencies:** B11-T02; B6
- **Expected files:** ops
- **Prohibited changes:** No Ultra; Basic only
- **Acceptance criteria:** Ledger within £2
- **Tests:** Ops log
- **Evidence:** Spend report
- **Commit boundary:** chore: private pilot generation ops
- **Rollback:** Stop gen
- **Audit requirement:** Weekly report

#### B11-T04
- **Purpose:** Private pilot retrospective
- **Dependencies:** B11-T03
- **Expected files:** docs/sepanai report
- **Prohibited changes:** No deploy to uncontrolled public
- **Acceptance criteria:** Go/no-go recorded
- **Tests:** N/A
- **Evidence:** Retrospective MD
- **Commit boundary:** docs: private pilot retrospective
- **Rollback:** N/A
- **Audit requirement:** Founder sign-off

## Batch 12 — Controlled public pilot

#### B12-T01
- **Purpose:** Raise ceiling to proposed £5 after private success
- **Dependencies:** B11-T04 approve
- **Expected files:** budget config
- **Prohibited changes:** No auto fallback
- **Acceptance criteria:** £5 stop at 100%
- **Tests:** Config test
- **Evidence:** Config evidence
- **Commit boundary:** chore: public pilot budget ceiling
- **Rollback:** Revert to £2/off
- **Audit requirement:** Founder approve

#### B12-T02
- **Purpose:** Feature-flag public membership gate surfaces
- **Dependencies:** B12-T01
- **Expected files:** flags
- **Prohibited changes:** Still no open prompt; Basic only
- **Acceptance criteria:** Public preview/full gate live
- **Tests:** e2e prod-like
- **Evidence:** Flag state
- **Commit boundary:** feat: enable controlled public pilot flag
- **Rollback:** Disable immediately
- **Audit requirement:** Incident plan

#### B12-T03
- **Purpose:** Monitor analytics funnels + cost daily
- **Dependencies:** B12-T02; Analytics
- **Expected files:** ops dashboard/manual
- **Prohibited changes:** Do not invent metrics
- **Acceptance criteria:** Weekly founder report
- **Tests:** Manual
- **Evidence:** Report MD
- **Commit boundary:** docs: public pilot weekly reports
- **Rollback:** N/A
- **Audit requirement:** Thresholds proposed not historical

#### B12-T04
- **Purpose:** Public pilot exit criteria review
- **Dependencies:** B12-T03
- **Expected files:** decision doc
- **Prohibited changes:** No Ultra; no mass gen
- **Acceptance criteria:** Continue/pause/stop decision
- **Tests:** N/A
- **Evidence:** Decision pack update
- **Commit boundary:** docs: public pilot exit decision
- **Rollback:** Disable flags
- **Audit requirement:** Requires final owner/legal review. for policy updates

## Implementation entry rule

Next implementation batch remains **blocked** until Founder Approval of `GC-SEPAN-FOUNDER-DECISION-PACK-001.md`.

# GC-SEPAN-SOURCE-PACK-001 — Authorised Pilot Source Pack

**UK date/time:** 2026-07-20 21:30 BST  
**Batch:** GC-EXECUTION-BATCH-003  
**Branch:** docs/gc-sepan-foundation-001  
**Status:** AUTHORISED

## Purpose

This document registers the authorised factual source pack for GoalCurrent × SEPANAI foundation work. It **supersedes** the empty-source failure recorded in Batch 002 (`docs/phase-2/BLOCKERS.md` / commit `2a6de49`). Historical Batch 002 files are retained for audit trail and must not be deleted.

## Source-lock ruling

| Rule | Application |
|------|-------------|
| Authorised pack | GC-EXECUTION-BATCH-003 instruction body (embedded factual pack) |
| Implementation SoT | Git repository `Az1341/goalcurrent.live` on branch `main` |
| External pricing/API | Official provider documentation URLs only |
| Missing live credentials | Classify as **NOT VERIFIED** — do **not** stop the batch |

Desktop/Documents searches for alternate packs are **not** required for Batch 003.

## A. Repository evidence (verified in pack + local git)

| Fact | Value | Classification |
|------|-------|----------------|
| Repository | Az1341/goalcurrent.live | VERIFIED COMPLETE |
| Production URL | https://goalcurrent.live | VERIFIED COMPLETE |
| Production branch | main | VERIFIED COMPLETE |
| Starting main commit (Batch 003) | `2a6de49a97e9a5d4a98aa4134b9d67563ba28250` | VERIFIED COMPLETE (local `git rev-parse`) |
| PR #9 | Merged | VERIFIED COMPLETE (pack) |
| PR #9 merge commit | `30cddd2ad7aad38f0abde42387b8a0f6a954a01f` | VERIFIED COMPLETE (pack) |
| Public accessibility | Repository publicly accessible | VERIFIED COMPLETE (pack) |
| Branch `goalcurrent-v2-rebuild` | Exists; 11 ahead / 27 behind main; diverged | VERIFIED COMPLETE (pack) |
| Merge base with rebuild | `2f95c3786f496a25c27a64b063aefd44838f5d1b` | VERIFIED COMPLETE (pack) |
| Wholesale merge of rebuild | Must not occur | VERIFIED COMPLETE (strategic rule) |

## B. Dependency evidence on main (package declarations)

Declared in `package.json` (presence ≠ live configuration):

| Dependency area | Declared | Live config |
|-----------------|----------|-------------|
| Next.js 16.2.9, React 19.2.4, TypeScript, Tailwind | VERIFIED COMPLETE (pack + package.json) | Runtime NOT VERIFIED without deploy probe |
| Firebase / Firebase Admin | VERIFIED PARTIAL (code paths cited in pack) | Live env NOT VERIFIED |
| Upstash Redis / rate limit | VERIFIED PARTIAL (code paths) | Live env NOT VERIFIED |
| Sentry, Zod, Playwright, a11y/visual tests | VERIFIED PARTIAL (declared) | CI behaviour NOT VERIFIED in this task |
| Supabase / OpenAI on **main** | NOT IMPLEMENTED as operational config on main (pack) | — |

## C. External official provider sources

Access date for all URLs below: **2026-07-20**.

| Source | URL |
|--------|-----|
| Google Gemini API pricing | https://ai.google.dev/gemini-api/docs/pricing |
| Google Gemini API rate limits | https://ai.google.dev/gemini-api/docs/rate-limits |
| Groq rate limits | https://console.groq.com/docs/rate-limits |
| Groq models | https://console.groq.com/docs/models |
| Groq billing | https://console.groq.com/docs/billing-faqs |
| Cloudflare Workers AI pricing | https://developers.cloudflare.com/workers-ai/platform/pricing/ |
| OpenAI API pricing | https://openai.com/api/pricing/ |

### Provider facts recorded from pack (as of 20 July 2026)

- Gemini 2.5 Flash-Lite model ID: `gemini-2.5-flash-lite`.
- Paid standard input US$0.10 / million tokens; output US$0.40 / million tokens (official pricing table).
- Free API tier documented; free-tier content may be used to improve Google products; paid-tier content is not (per pricing table) — privacy implication required in recommendations.
- Groq free limits exist, vary by model/account, organisation-level.
- Cloudflare Workers AI: model-specific pricing + free daily allocation per current terms.
- ChatGPT consumer subscription ≠ OpenAI API credits.
- Do not recommend deprecated Gemini 2.0 models.
- Pricing must be rechecked before account creation or implementation.

### Cost-estimation scenario (planning only)

- Input 8,000 + output 1,500 tokens → approx US$0.0014 per explanation on paid Flash-Lite.
- 100 explanations ≈ US$0.14 before tax/FX/tools.
- Not a provider guarantee.

## D. Approved pilot constraints (product facts from pack)

Public content remains available; full explanations membership-gated; marketing consent optional and separate; no open prompt box; prepared cached follow-ups; admin/editor-initiated generation; one stored explanation served repeatedly; page reads never trigger generation; Basic intelligence only; no mass generation; no anonymous generation; no visitor uploads; no Ultra; no silent expensive fallback.

## E. Approved architecture direction (from pack)

GoalCurrent → versioned SEPANAI boundary → task/policy classification → approved model adapter → structured validation → evidence/quality gate → cost/latency telemetry → editorial review → stored published explanation → membership-gated delivery.

## F. Supersession of Batch 002 blocker

| Item | Action |
|------|--------|
| `docs/phase-2/BLOCKERS.md` | Historical record retained |
| Source-lock empty pack | **RESOLVED** for Batch 003 — see `GC-SEPAN-BLOCKERS-001.md` |
| Architecture manufacture without pack | Still forbidden for Batch 002 scope; Batch 003 proceeds under **this** authorised pack |

## G. What remains NOT VERIFIED without credentials/dashboards

- Live Firebase project binding and keys
- Live Upstash Redis binding
- Live GA4 Admin Enhanced Measurement toggle state
- Live Sentry DSN
- Live API-Football / YouTube keys
- Any production Supabase project (none operational on main per pack)
- Any live AI provider account or spend

Missing credentials produce **NOT VERIFIED** rows, not a batch-wide stop.
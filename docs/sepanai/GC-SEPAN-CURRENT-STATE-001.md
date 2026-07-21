# GC-SEPAN-CURRENT-STATE-001 — Current-State Reconciliation

**UK date/time:** 2026-07-20 21:32 BST  
**Working branch:** docs/gc-sepan-foundation-001  
**Main tip at audit:** `2a6de49a97e9a5d4a98aa4134b9d67563ba28250`  
**This branch HEAD when writing:** `0d8247e9b0c25a234d1db72d8fec5feaa5f54fa2`

## Method

Read-only inspection of `main` (via this branch base) and `origin/goalcurrent-v2-rebuild`. Dependency presence is **not** treated as live service proof.

## Branch divergence

| Metric | Value | Classification |
|--------|-------|----------------|
| Rebuild remote | `origin/goalcurrent-v2-rebuild` | VERIFIED COMPLETE |
| Merge base | `2f95c3786f496a25c27a64b063aefd44838f5d1b` | VERIFIED COMPLETE |
| Commits on main not in rebuild | 28 | VERIFIED COMPLETE (`git rev-list --left-right --count`) |
| Commits on rebuild not in main | 11 | VERIFIED COMPLETE |
| Pack stated 27 behind | Pack said 27; measured **28** | CONFLICTING (minor count drift vs pack) — use measured 28 |
| Wholesale merge safe? | No | VERIFIED COMPLETE (strategic) |

## Component matrix

| Component | Paths / evidence | Status |
|-----------|------------------|--------|
| Next.js 16.2.9 / React 19.2.4 | `package.json` | VERIFIED COMPLETE (declared) |
| TypeScript / Tailwind | `package.json` | VERIFIED COMPLETE (declared) |
| Firebase client auth (Google/Apple) | `src/contexts/FirebaseAuthContext.tsx`, `src/lib/firebase/*`, `src/components/firebase/*`, `src/hooks/useFirebaseAuth.ts` | VERIFIED PARTIAL (code present; live project **NOT VERIFIED**) |
| Firebase Admin token verify | `src/lib/firebase/admin.ts` | VERIFIED PARTIAL (code; live SA **NOT VERIFIED**) |
| Upstash rate limit 60/min + upstream 30/min + memory fallback | `src/lib/rate-limit/index.ts`, `src/lib/server/cache.ts`, `@upstash/*` in package.json | VERIFIED PARTIAL (code; live Upstash **NOT VERIFIED**) |
| LRU cache | `lru-cache` in package.json + server cache module | VERIFIED PARTIAL |
| Sentry | `@sentry/nextjs`, `.env.example` SENTRY_* | VERIFIED PARTIAL (declared; DSN live **NOT VERIFIED**) |
| Zod | `package.json` | VERIFIED COMPLETE (declared) |
| Playwright + a11y + visual | `package.json` scripts | VERIFIED PARTIAL (scripts exist; CI health **NOT VERIFIED** here) |
| GA4 G-X84HCE5KGT, consent, `send_page_view:false`, manual SPA page_view, article_open, remount dedupe | `src/components/analytics/GA.tsx`, `AnalyticsRouteListener.tsx`, docs/analytics/* | VERIFIED PARTIAL (code+docs; Admin EM toggle **NOT VERIFIED**) |
| `.env.example` Firebase/Upstash/GA4/Sentry/API-Football | `.env.example` | VERIFIED COMPLETE (documentation of expected vars) |
| Operational Supabase on main | No `src/lib/supabase`, no supabase migration on main tip | NOT IMPLEMENTED on main |
| Operational OpenAI / SEPANAI boundary on main | No provider-neutral SEPANAI API on main | NOT IMPLEMENTED on main |
| Explanation engine | Present on rebuild only: `src/lib/explanation-engine/*` | VERIFIED PARTIAL on rebuild; NOT IMPLEMENTED on main |
| Supabase client utilities | Rebuild: `src/lib/supabase/*` | VERIFIED PARTIAL on rebuild; NOT IMPLEMENTED on main |
| Supabase migration `20260719180000_gc_v2_initial.sql` | Rebuild only | VERIFIED PARTIAL on rebuild |
| Edge functions fetch-match-data / generate-brief / regenerate-brief-section | Rebuild `supabase/functions/*` | VERIFIED PARTIAL on rebuild |
| Direct OpenAI in generate-brief | Pack states GPT-4o instantiated in generate-brief | VERIFIED PARTIAL (pack + rebuild path exists; line-level **NOT VERIFIED** in this read-only pass without full file dump) |
| `docs/ARCHITECTURE.md` | Rebuild only | VERIFIED PARTIAL on rebuild |
| `src/types/database.ts` | Pack cites rebuild | NOT VERIFIED on main (file absent at tip) |
| Email capability | No dedicated transactional email provider declared in `.env.example` keys reviewed | NOT IMPLEMENTED / NOT VERIFIED |
| Feature flags system for AI pilot | No pilot feature-flag module verified on main | NOT IMPLEMENTED |
| Membership-gated AI delivery | Not on main | NOT IMPLEMENTED |
| Provider-independent SEPANAI API | Not on main; rebuild couples OpenAI | CONFLICTING (rebuild approach vs approved direction) |

## Summary

- **main** is the production SoT: Firebase auth, Upstash rate limits, GA4 pipeline, football product — no operational Supabase/SEPANAI.
- **goalcurrent-v2-rebuild** holds partial reusable Supabase + explanation-engine work, diverged and behind main; selective port only.
- Live credentials remain **NOT VERIFIED** across Firebase, Upstash, Sentry, GA4 Admin, and any AI provider.
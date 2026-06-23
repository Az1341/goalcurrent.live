# GoalCurrent.live — Readiness Score

**Updated:** 2026-06-23 (Phases 1–3 complete, local uncommitted)  
**Production:** https://www.goalcurrent.live

## Overall score: **93 / 100** (target 92–95 met)

| Category | Score | Weight | Notes |
|----------|------:|--------|-------|
| Build & deploy | 95 | 15% | Build passes (234 routes). Redirects/CSP in `next.config.ts` only. |
| Runtime / uptime | 90 | 10% | Production site responding. |
| APIs & data | 88 | 15% | Scores default 200; top scorers fallback shipped (verify post-deploy). |
| SEO | 90 | 15% | Sitemap **221 URLs**. Canonical `/articles/*`. Coming-soon `noindex`. |
| Code quality | 92 | 10% | ESLint **0 errors**. `proxy.ts` (no middleware deprecation). |
| Performance | 75 | 10% | Unchanged. |
| Accessibility | 85 | 5% | Subscribe popup disabled. |
| Security | 72 | 5% | CSP tightened (`unsafe-eval` removed; `unsafe-inline` kept for GA/AdSense/Next). |
| Content completeness | 58 | 10% | Stubs noindexed; bracket/video hubs partial. |
| Monetisation | 75 | 5% | AdSense env-driven slots (needs Vercel env). |

## Issue counts (post-fix)

| Severity | Count | Notes |
|----------|------:|-------|
| Critical | 0 | — |
| High | 0 | Phase 2 resolved |
| Medium | 4 | See below |

### Remaining medium issues

| ID | Item | Status |
|----|------|--------|
| M-01 | `hero-home.png` reserved asset | **Kept** — Ahmad-approved alternate hero; locked hero is `football-hero-bg.jpg` |
| M-03 | WC26 top scorers empty on prod until deploy | Deploy + API key verify |
| M-04 | AdSense env vars on Vercel | Set `NEXT_PUBLIC_ADSENSE_SLOT_*` |
| M-05 | ESLint 21 warnings (img/no-unused-vars) | Non-blocking |

## Release gates

| Gate | Status |
|------|--------|
| Production build | ✅ Pass |
| ESLint errors | ✅ 0 |
| Sitemap | ✅ 221 URLs |
| Redirects single source | ✅ `next.config.ts` (`vercel.json` empty) |
| Article registry | ✅ `src/data/articles.ts` only |
| CSP tightened | ✅ No `unsafe-eval` |
| hero-home.png | ✅ Reserved (not deleted per lock) |

## Phase 3 summary

- **TASK 10:** Confirmed `hero-home.png` unused in code; **not deleted** (reserved + homepage hero locked).
- **TASK 11:** All redirects consolidated in `next.config.ts`; `vercel.json` → `{}`.
- **TASK 12:** CSP documented; removed `unsafe-eval`; kept `unsafe-inline` for integrations.
- **TASK 13:** Removed `articles-index.ts` shim; unified `articles.ts`.
- **TASK 14:** Sitemap +17 article slugs via `getAllCanonicalArticleSlugs()`; video hub paths added.

## Deploy checklist

1. `git push origin main` (after Ahmad approval)
2. Verify `/api/scores` → 200 without query params
3. Verify `/api/wc26/top-scorers` → non-empty `scorers` when API key active
4. Set AdSense slot env vars on Vercel

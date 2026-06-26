# GoalCurrent.live — Readiness Score

**Updated:** 2026-06-24 · **Branch:** `main` @ `bdae9c1` · **Tag:** `v1.0.0`  
**Production:** https://goalcurrent.live

## Overall score: **88 / 100**

| Category | Score | Weight | Notes |
|----------|------:|--------|-------|
| Build & deploy | 96 | 15% | Build passes · **306** static paths · `v1.0.0` tagged |
| Runtime / uptime | 92 | 10% | 13/13 focus URLs **200** on production probe |
| APIs & data | 91 | 15% | All 7 probed APIs **200** · top scorers **20 rows** |
| SEO | 86 | 15% | Sitemap **200 URLs** · ~106 build paths not in sitemap |
| Code quality | 90 | 10% | ESLint **0 errors** · **11 warnings** |
| Performance | 78 | 10% | TTFB 90–457 ms on probe · no Lighthouse run |
| Accessibility | 86 | 5% | Landmarks/ARIA on homepage · no axe audit |
| Security | 90 | 5% | CSP via `proxy.ts` · Sentry · debug routes blocked in prod |
| Content completeness | 74 | 10% | 21 coming-soon stubs (noindex) · ScoreBat needs token |
| Monetisation | 80 | 5% | AdSense env-driven · 1 ad unit seen on match page |

## Issue counts

| Severity | Count |
|----------|------:|
| Critical | 0 |
| High | 5 |
| Medium | 12 |
| Low | 9 |
| **Total** | **26** |

## Release gates

| Gate | Status |
|------|--------|
| Production build | ✅ Pass |
| ESLint errors | ✅ 0 |
| Sitemap live | ✅ 200 URLs |
| robots.txt | ✅ Allow `/` · Disallow `/api/` |
| Custom 404 | ✅ Production verified |
| Redirects | ✅ `/video`, `/news/articles`, `/worldcup2026/match` → 308 |
| Phase 4 hardening | ✅ Sentry, CSP, API safeguards, ads, trust UX |
| Monitoring (UptimeRobot / Sentry alerts) | ☐ Manual |
| AdSense + ScoreBat env on Vercel | ☐ Manual verify |

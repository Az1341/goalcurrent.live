# GoalCurrent.live — Full Technical Audit

**Date:** 24 June 2026 · **Branch:** `main` @ `bdae9c1` · **Tag:** `v1.0.0` · **Score:** **88 / 100**

Full reports saved to:
- `reports/audit-report.md` — master report (this file)
- `reports/findings.md` — every issue with file paths and fixes
- `reports/readiness-score.md` — weighted scorecard
- `reports/build-audit-v1.txt` / `reports/lint-audit-v1.txt` — raw logs

---

## One source of truth

| Item | Value |
|------|--------|
| **What** | GoalCurrent.live website |
| **GitHub** | `Az1341/goalcurrent-live-nextjs` |
| **Branch** | `main` |
| **Vercel** | `goalcurrent-live-nextjs` |
| **Live site** | https://www.goalcurrent.live |
| **Deploy** | `git push origin main` → Vercel auto production build |

---

## 1. Summary of all problems

### What works

- Production build passes — **306** static paths (`npm run build`)
- ESLint **0 errors**, 11 warnings (`npm run lint`)
- All 6 launch focus pages return **HTTP 200** on production
- Legal/trust pages live: `/privacy`, `/terms`, `/contact`, custom **404**
- WC26 live API healthy — `/api/wc26/scores?live=true` **200**
- Top scorers API returns **20 scorers**, `apiAvailable: true`
- `/api/scores` returns **200** with default payload (no query required)
- Locked homepage hero, ticker, favourites, standings preview verified
- **No hydration warnings** on production match page probe
- AdSense unit detected on production match page (`ins.adsbygoogle` × 1)
- Share buttons on match + article pages
- Sentry, CSP (`src/proxy.ts`), API-Football safeguards shipped (Phase 4)
- ScoreBat wiring in code + CSP allows `scorebat.com` iframes
- `sitemap.xml` (**200 URLs**), `robots.txt`, `manifest.json` all **200**
- 48 WC26 flag SVGs synced via `prebuild` script
- Redirects: `/video/*` → `/videos/*`, `/news/articles/*` → `/articles/*`, `/worldcup2026/match/*` → `/match/*` (all **308**)
- Debug routes return **403** in production

### Top blockers

| Priority | Count | Top items |
|----------|------:|-----------|
| **Critical** | 0 | — |
| **High** | 5 | Sitemap ~106 URLs short of build paths; AdSense env on Vercel; ScoreBat token; monitoring not set; legacy duplicate page trees |
| **Medium** | 12 | 11 ESLint warnings; 21 coming-soon stubs; dead Footer/SubscribePopup; contact form unverified |
| **Low** | 9 | Scaffold SVGs; untracked reports; Lighthouse CI missing |

### Broken links summary

**0 confirmed 404s** on 21 tested production URLs (including intentional `/nope-audit-404` → custom 404).

| URL tested | Status |
|------------|--------|
| `/`, `/live`, `/worldcup2026`, `/premier-league` | 200 |
| `/match/fixture-001` | 200 |
| `/articles/alireza-beiranvand-iran-world-cup-hero` | 200 |
| `/statistics/live`, `/transfers`, `/favourites/clubs` | 200 (coming-soon, noindex) |
| `/video/highlights` | 308 → `/videos/highlights` |
| `/worldcup2026/match/fixture-001` | 308 → `/match/fixture-001` |
| `/news/articles` | 308 → `/articles` |
| `/api/debug/wc26` | 403 (expected) |

### Broken media summary

| Asset | Status |
|-------|--------|
| `public/images/football-hero-bg.jpg` | ✅ Locked homepage hero |
| `public/images/hero-home.png` | ✅ Reserved (not wired — do not delete) |
| `public/flags/4x3/*.svg` (48) | ✅ Synced prebuild |
| `public/icons/*` PWA + OG | ✅ 200 on production |
| ScoreBat embed on match | ⚠️ Absent — token or feed match missing |
| YouTube `/api/videos` | ✅ 200 |

---

## 2. Detailed issue list (with file paths)

See `reports/findings.md` for full tables. Summary:

### Critical issues

*None.*

### High issues

| ID | Issue | File(s) |
|----|-------|---------|
| H-01 | Sitemap 200 vs build 306 paths | `src/app/sitemap.ts` |
| H-02 | AdSense env vars on Vercel | `src/lib/adsense-slots.ts` |
| H-03 | ScoreBat highlights not on prod | `src/lib/scorebat/getScoreBatEmbed.ts` |
| H-04 | Monitoring not configured | External |
| H-05 | Legacy duplicate routes in build | `src/app/video/*`, `src/app/worldcup2026/match/*`, `src/app/news/articles/*` |

### Medium issues

| ID | Issue | File(s) |
|----|-------|---------|
| M-01 | 11 ESLint warnings | See `reports/lint-audit-v1.txt` |
| M-02 | 21 coming-soon pages | `src/lib/coming-soon-page.tsx` |
| M-03 | Reserved `hero-home.png` | `public/images/hero-home.png` |
| M-04 | Unused `Footer.tsx` | `src/components/layout/Footer.tsx` |
| M-05 | Dead `SubscribePopup.tsx` | `src/components/layout/SubscribePopup.tsx` |
| M-06 | Deprecated `AdSenseUnit` | `src/components/AdSenseUnit.tsx` |
| M-07 | CSP `unsafe-inline` | `src/lib/security/csp.ts` |
| M-08 | PL pre-season zeros | `src/app/api/pl/standings/route.ts` |
| M-09 | Contact form unverified | `src/components/info/ContactForm.tsx` |
| M-10 | Match “Loading…” client-only | `src/lib/use-match-detail.ts` |
| M-11 | npm `devdir` warning | Local env |
| M-12 | API simulate hook undocumented | `src/lib/api-football/client.ts` |

### Low issues

| ID | Issue | File(s) |
|----|-------|---------|
| L-01–L-09 | Scaffold SVGs, WIP CSS, reports gitignore, Lighthouse CI, etc. | See `reports/findings.md` |

---

## 3. Section-by-section audit

### Pages

- **73** `page.tsx` files under `src/app/`
- **306** paths in production build output
- Core: `/`, `/live`, `/favourites` (+ clubs/players)
- WC26: hub, groups, teams, fixtures, standings, venues, bracket, players, match
- PL: hub, table, fixtures, live, clubs, players, statistics, transfers, match
- Articles: `/articles` + 17 slugs (+ 7 legacy static duplicates)
- News: `/news` + category hubs
- Videos: `/videos` (+ legacy `/video/*` redirect)
- Statistics: 8 stub routes (noindex)
- Transfers: 4 stub routes (noindex)
- Legal: about, contact, privacy, terms, cookies, affiliate-disclosure

### Links

- Primary nav: `src/lib/nav.ts` — `MAIN_NAV`, `MOBILE_BOTTOM_TABS`, `FOOTER_LINKS`
- No `/video/` links in `src/` (grep clean) — redirects handle bookmarks
- Footer: Privacy · Terms · Contact · Cookies · Affiliate Disclosure
- Internal match links use `matchHref()` → `/match/[fixtureId]`

### Images & video

| Asset | Path | Status |
|-------|------|--------|
| Hero (locked) | `public/images/football-hero-bg.jpg` | ✅ |
| Hero (reserved) | `public/images/hero-home.png` | ✅ unused |
| Flags | `public/flags/4x3/` (48 SVG) | ✅ |
| Article photos | `public/images/news/...` | ✅ |
| PWA icons | `public/icons/` | ✅ |
| Remote images | `src/lib/images.ts` → `next/image` patterns | ✅ |
| ScoreBat | `src/components/scorebat/ScoreBatEmbed.tsx` | ⚠️ needs token |
| YouTube API | `src/app/api/videos/route.ts` | ✅ 200 |

### APIs

**21 route handlers** under `src/app/api/`

| Endpoint | Prod status | Notes |
|----------|-------------|-------|
| `/api/wc26/scores?live=true` | 200 | Live phase |
| `/api/wc26/scores?results=wc` | 200 | FT results |
| `/api/wc26/top-scorers` | 200 | 20 scorers |
| `/api/pl/standings` | 200 | Pre-season |
| `/api/scores` | 200 | Default matches payload |
| `/api/news` | 200 | RSS feed |
| `/api/videos` | 200 | YouTube |
| `/api/debug/*` | 403 | Prod blocked |

Rate-limit / stale handling: `src/lib/api-football/route-errors.ts`, `src/lib/api-football/cache.ts`

### Performance

| Page | TTFB (probe) | Size |
|------|-------------:|-----:|
| `/` | 387 ms | 58 KB |
| `/live` | 150 ms | 81 KB |
| `/match/fixture-001` | 117 ms | 44 KB |
| `/articles/...` | 154 ms | 73 KB |

- Static WC26 match pages SSG (`generateStaticParams` × 72)
- Hero preload in `src/app/page.tsx`
- Nav prefetch via `src/components/nav/NavLink.tsx`
- AdSense lazyOnload + IntersectionObserver ad push
- **Not run:** Lighthouse mobile, 4× CPU Web Vitals

### SEO

- ✅ `metadataBase` — `src/app/layout.tsx:30`
- ✅ Per-route `generateMetadata` on match, articles, hubs
- ✅ `robots.ts` — disallow `/api/`
- ✅ `sitemap.ts` — 200 URLs live
- ⚠️ ~106 build paths not in sitemap
- ✅ Coming-soon `noindex` — `src/lib/coming-soon-page.tsx:27`
- ✅ JSON-LD on match (`SportsEvent`), articles (`NewsArticle`)
- ✅ Canonical on match pages
- ☐ Manual: Rich Results Test, Facebook Debugger, Search Console

### Mobile

- Bottom tab bar: `src/components/layout/BottomTabBar.tsx`
- `MOBILE_BOTTOM_TABS` in `src/lib/nav.ts`
- Responsive CSS modules on homepage (`src/app/page.module.css`)
- Locked hero rules in `.cursor/rules/homepage-hero-locked.mdc`

### Console / network

Production match page (browser CDP):
- Hydration errors: **false**
- `ins.adsbygoogle`: **1**
- AdSense script requests: **2**
- Console errors: **0** on sampled probe

Third-party (CSP-allowed): GA, AdSense, OneSignal, Sentry ingest, ScoreBat

### Build

```
Next.js 16.2.9 (Turbopack)
✓ Compiled successfully
✓ 306 static pages generated
ƒ Proxy (Middleware) — src/proxy.ts
```

- `npm run lint` — 11 warnings, 0 errors
- `prebuild` — `scripts/sync-wc26-flags.mjs`
- Sentry source maps via `withSentryConfig` in `next.config.ts`

### Routing

| Source | Destination | File |
|--------|-------------|------|
| `/video/*` | `/videos/*` | `next.config.ts:11-12` |
| `/news/articles/*` | `/articles/*` | `next.config.ts:18-22` |
| `/worldcup2026/match/:id` | `/match/:id` | `next.config.ts:29-32` |
| `goalcurrent.live` | `www.goalcurrent.live` | `next.config.ts:34-39` |
| Legacy group paths | `/worldcup2026/groups/x` | `src/proxy.ts` |
| 404 | Custom not-found | `src/app/not-found.tsx` |
| 500 | `error.tsx` + `global-error.tsx` | Sentry capture |

No `src/middleware.ts` — migrated to `proxy.ts` ✅

### Security

| Control | Location | Status |
|---------|----------|--------|
| CSP per-request | `src/proxy.ts`, `src/lib/security/csp.ts` | ✅ |
| X-Frame-Options, nosniff | `next.config.ts:68+` | ✅ |
| API keys server-only | `API_FOOTBALL_KEY`, `SCOREBAT_API_TOKEN` | ✅ |
| Debug routes prod-gated | `src/app/api/debug/*/route.ts` | ✅ 403 |
| `robots.txt` blocks `/api/` | `src/app/robots.ts` | ✅ |
| `ads.txt` | `public/ads.txt` | ✅ |
| Sentry | `sentry.*.config.ts`, `src/instrumentation.ts` | ✅ |

### Accessibility

- Semantic landmarks: header, main, footer, nav regions on homepage
- ARIA on ad slots, status banners, share buttons
- Team flags have alt via `TeamFlag`
- Subscribe popup disabled (no broken readonly field)
- Full axe/Lighthouse a11y audit **not run**

### Lighthouse-style metrics (production probe, not full Lighthouse)

| Metric | Homepage probe |
|--------|---------------:|
| TTFB | ~387 ms |
| HTML size | ~58 KB |
| Console errors | 0 |
| Hydration mismatch | 0 |
| CLS | Not measured (manual DevTools required) |

---

## 4. Priority ranking summary

1. **High** — Expand sitemap; verify AdSense + ScoreBat env on Vercel; configure monitoring; prune legacy duplicate routes
2. **Medium** — Clear ESLint warnings; verify contact form; document API simulate hook
3. **Low** — Delete scaffold SVGs; gitignore local reports; add Lighthouse CI

---

## 5. Action plan (repair entire project)

### Phase 1 — High (pre-tournament launch)

1. Set Vercel env: all `NEXT_PUBLIC_ADSENSE_SLOT_*`, `SCOREBAT_API_TOKEN`, Sentry DSNs
2. Expand `src/app/sitemap.ts` — add statistics, transfers, favourites, `/news` sub-hubs
3. Configure UptimeRobot + Sentry API alerts + Vercel Analytics thresholds
4. Verify ScoreBat embed on a completed match with real feed data
5. Remove or noindex legacy `src/app/video/*` and duplicate match/article pages

### Phase 2 — Medium (week 2)

6. Fix 11 ESLint warnings (`reports/lint-audit-v1.txt`)
7. Migrate `PlCommercialStrip` from `AdSenseUnit` → `AdSlot`
8. Delete dead `SubscribePopup.tsx`, unused `Footer.tsx` shim
9. E2E test `ContactForm.tsx`
10. Document `API_FOOTBALL_SIMULATE` in `docs/ENVIRONMENT.md`

### Phase 3 — Low (ongoing)

11. Delete scaffold SVGs in `public/`
12. Add Lighthouse CI on `/`, `/live`, `/match/fixture-001`
13. Gitignore `build-report-*.txt`
14. Ship statistics/transfers content or keep noindex until ready

### Phase 4 — Content (parallel)

15. PL season-start real data UX when API returns fixtures
16. Bracket page real data (`src/app/worldcup2026/bracket/page.tsx`)
17. Video hub expansion beyond 4 YouTube items

---

## Final TASK summary block

```
TASK: Full website technical audit — GoalCurrent.live v1.0.0
STATUS: COMPLETE
FILES: reports/audit-report.md, reports/findings.md, reports/readiness-score.md, reports/build-audit-v1.txt, reports/lint-audit-v1.txt
RESULT: 88/100 readiness; 26 issues (0 Critical, 5 High, 12 Medium, 9 Low); build pass (306 routes); production core OK
BLOCKERS: Sitemap gap (~106 URLs); AdSense/ScoreBat Vercel env verify; monitoring not configured
NEXT STEP: Phase 1 — Vercel env + sitemap expansion + UptimeRobot/Sentry alerts
```

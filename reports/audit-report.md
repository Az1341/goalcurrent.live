# GoalCurrent.live — Full Technical Audit

**Date:** 23 June 2026 · **Branch:** `main` @ `89baa65` · **Score:** **68 / 100**

Full reports saved to:
- `reports/audit-report.md` — master report
- `reports/findings.md` — every issue with file paths and fixes
- `reports/readiness-score.md` — scorecard
- `reports/build-audit.txt` / `reports/lint-audit.txt` — raw logs

---

## One source of truth

| Item | Value |
|------|--------|
| **What** | GoalCurrent.live website |
| **GitHub** | `Az1341/goalcurrent-live-nextjs` |
| **Branch** | `main` |
| **Vercel** | `goalcurrent-live-nextjs` |
| **Live site** | https://www.goalcurrent.live |
| **Deploy** | `git push origin main` → auto production build |

---

## 1. Summary of all problems

**What works**
- Production build passes (**234 routes**)
- Homepage, live scores, WC26 core, news RSS, PL hub all return **HTTP 200**
- WC26 live API returns real data (live + 45 FT results at audit time)
- Locked hero, ticker, favourites, standings preview verified on production
- No console errors on homepage probe
- Performance: TTFB ~92ms, full load ~841ms
- `sitemap.xml`, `robots.txt`, `manifest.json` return **200** on production
- PWA icons and hero image return **200**

**Top blockers (37 issues total)**

| Priority | Count | Top items |
|----------|------:|-----------|
| **Critical** | 3 | Incomplete sitemap; placeholder AdSense slots; 34 ESLint errors |
| **High** | 9 | Empty WC26 top scorers; duplicate article URLs; many “coming soon” stubs; broken subscribe popup; middleware deprecation |
| **Medium** | 14 | Orphan images; duplicate redirects; CSP too permissive; thin PL pre-season UX |
| **Low** | 11 | Scaffold SVGs; doc naming `.online`; legacy branch noise |

**Broken links:** **0 confirmed 404s** on 27+ tested URLs (redirects on `/video`, `/worldcup2026/favourites` are intentional).

**Broken media:** No broken hero or flag assets. Reserved (do not delete): `public/images/hero-home.png` — approved alternate hero asset, not wired while locked hero is active.

---

## 2. Detailed issue list (with file paths)

### Critical

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| C-01 | Sitemap has **157 URLs** but build generates **234** paths — PL, videos, statistics, transfers, many sub-pages **missing** | `src/app/sitemap.ts:14-34` | Add all indexable routes to sitemap generators |
| C-02 | AdSense slots `1234567890` / `2345678901` on homepage | `src/app/HomeClient.tsx:315,342` | Replace with real AdSense slot IDs |
| C-03 | ESLint **55 problems** (34 errors) — fails `npm run lint` | `reports/lint-audit.txt` | Refactor `setState`-in-effect patterns; fix memo deps |

**ESLint error hotspots:**
- `src/components/AdSenseUnit.tsx:23`
- `src/components/home/HomeFavouritesStrip.tsx:22`
- `src/components/home/HomePlSection.tsx:143,182,190,197`
- `src/components/pl/PlHubClient.tsx:184,192,199,328`
- `src/components/pl/PlFixturesClient.tsx:107,129,132,143`
- `src/lib/use-tournament-stats.ts:38`
- `src/lib/use-wc26-standings.ts:30`
- `src/lib/use-match-detail.ts:75`
- `src/lib/use-wc26-tv-region.ts:25`
- (+ 15 more files in lint log)

### High

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| H-01 | `/api/wc26/top-scorers` → `scorers: []`, `apiAvailable: false` | `src/app/api/wc26/top-scorers/route.ts`, `src/lib/server/wc26-top-scorers.ts` | Overlay fallback from finished match scores |
| H-02 | Two article systems: `/articles/*` vs `/news/articles/*` | `src/data/articles-index.ts`, `src/data/articles.ts`, `src/app/news/articles/[slug]/page.tsx` | One canonical URL + 301 redirects |
| H-03 | `GET /api/scores` → **400** without query params | `src/app/api/scores/route.ts` | Default query or document contract |
| H-04 | Docs still say “GoalCurrent.online” | `docs/ENVIRONMENT.md:1,5` | Rename to `.live` |
| H-05 | Duplicate “News” in `MAIN_NAV` | `src/lib/nav.ts:58` | Remove duplicate entry |
| H-06 | 12+ routes are “Coming soon” stubs (statistics, video sub-pages) | `src/app/statistics/*/page.tsx`, `src/app/video/*/page.tsx` | `noindex` until built |
| H-07 | Bracket shows placeholder copy | `src/components/wc26/BracketSection.tsx:37` | Wire data or hide |
| H-08 | Subscribe popup non-functional (`readonly` email) | `src/components/layout/SubscribePopup.tsx:52-57` | Wire provider or remove |
| H-09 | Middleware deprecated in Next.js 16 | `src/middleware.ts` | Migrate to `proxy` |

### Medium

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| M-01 | Reserved asset `hero-home.png` (not referenced in code) | `public/images/hero-home.png` | **Do not delete.** Keep on disk; wire only with Ahmad approval (locked hero is `football-hero-bg.jpg`) |
| M-02 | Duplicate redirect config | `vercel.json`, `next.config.ts` | Consolidate into `next.config.ts` |
| M-03 | Legacy `/video/*` → `/videos/*` (308) | `src/app/video/*/page.tsx` | Update internal links |
| M-04 | `worldcup2026/favourites` redirects | `src/app/worldcup2026/favourites/page.tsx` | Remove stale links |
| M-05 | PL standings all `played: 0` | `src/app/api/pl/standings/route.ts` | Pre-season empty-state copy |
| M-06 | `TeamFlag` uses `<img>` not `next/image` | `src/components/TeamFlag.tsx:47` | Optimise or document exception |
| M-07 | CSP `unsafe-inline` / `unsafe-eval` | `next.config.ts:4-16` | Tighten after integration audit |
| M-08 | 21 ESLint warnings (unused vars) | Multiple — see lint log | Remove dead code |
| M-09 | Parallel article data files | `src/data/articles.ts`, `src/data/articles-index.ts` | Merge registry |
| M-10 | `/articles` hub missing from sitemap | `src/app/sitemap.ts` | Add to `STATIC_PATHS` |
| M-11 | SSR/client tournament stats timing | `src/lib/use-tournament-stats.ts` | Optional SSR seed |
| M-12 | Contact form backend unverified | `src/components/info/ContactForm.tsx` | End-to-end test |
| M-13 | YouTube limited to 4 videos | `src/app/api/videos/route.ts` | Confirm `YOUTUBE_API_KEY` |
| M-14 | npm `devdir` warning on build | Environment | Clean local npm config |

### Low

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| L-01 | Unused scaffold SVGs | `public/next.svg`, `vercel.svg`, `globe.svg`, `window.svg`, `file.svg` | Delete |
| L-02 | Untracked `build-report.txt` | repo root | Gitignore or delete |
| L-03 | `README.md` vs `ENVIRONMENT.md` naming drift | `docs/ENVIRONMENT.md` | Align to `.live` |
| L-04 | Statistics nav commented out in More sheet | `src/lib/nav.ts:183-189` | Document or restore |
| L-05 | Legacy Vercel `goalcurrent.live` project | Vercel dashboard | Archive project |
| L-06 | Match detail “Loading…” in SSR HTML | `src/lib/use-match-detail.ts` | Server-render summary |
| L-07 | `apple-touch-icon.png` reference | `src/app/layout.tsx:47` | Verify file exists |
| L-08 | NordVPN affiliate generic offer | `src/lib/site-keys.ts:13` | Confirm tracking |
| L-09 | Duplicate ticker marquee items | `src/components/layout/LiveRibbon.tsx` | Cosmetic review |
| L-10 | Coming-soon pages may index | `src/lib/coming-soon-page.tsx` | Add `noindex` |
| L-11 | Remote branch `live-promotion-prep` still exists | Git | Archive after sign-off |

---

## 3. Section-by-section audit

### Pages
- **71** `page.tsx` files; **234** static build paths
- Sections: Core (5), WC26 (11+), PL (11+), News/Articles (8+), Video (10), Statistics (8 stubs), Transfers (4), Legal (6)
- All sampled production pages return **200**

### Links
- Nav in `src/lib/nav.ts` — all resolve
- Mobile bottom tabs at `nav.ts:98-104`
- **0 broken 404s** on 27 tested URLs
- Intentional redirects: `/video` → `/videos` (307/308), `/worldcup2026/favourites` → `/favourites`

### Images & video
| Asset | Status |
|-------|--------|
| `football-hero-bg.jpg` | ✅ Used (locked hero) |
| `hero-home.png` | ✅ Reserved asset (do not delete) |
| WC26 flags (48 SVG) | ✅ |
| Canada article photos (10) | ✅ |
| PWA icons | ✅ 200 on production |
| YouTube `/api/videos` | ✅ 4 videos |

### APIs
| Endpoint | Status | Notes |
|----------|--------|-------|
| `/api/wc26/scores?live=true` | 200 | Working |
| `/api/wc26/scores?results=wc` | 200 | 45 results |
| `/api/wc26/top-scorers` | 200 | **Empty scorers** |
| `/api/pl/standings` | 200 | Pre-season zeros |
| `/api/pl/fixtures` | 200 | Large payload |
| `/api/pl/live` | 200 | Empty |
| `/api/news` | 200 | 20 articles |
| `/api/videos` | 200 | 4 videos |
| `/api/scores` (no query) | 400 | Needs params |

**18 API route files** under `src/app/api/`

### Performance
- Homepage TTFB ~92ms, load ~841ms — **good**
- PL fixtures API large (~179KB) — consider pagination
- Static WC26 pages pre-rendered — **good**
- Vercel CDN cache HIT on repeat visits

### SEO
- ✅ `metadataBase` in `src/app/layout.tsx`
- ✅ Per-page metadata on most routes
- ✅ `robots.txt`, `sitemap.xml` live
- ❌ Sitemap missing ~77 routes (PL, videos, statistics, transfers, `/articles` hub)
- ❌ Duplicate article URL namespaces
- ⚠️ Thin “coming soon” pages may index

### Mobile
- Bottom tab bar in `MOBILE_BOTTOM_TABS` (`src/lib/nav.ts`)
- Locked hero responsive CSS (`src/app/page.module.css`)
- Dedicated 375px QA **recommended**

### Console / network
- **0 console errors** on homepage production probe
- Third-party: GA, AdSense, OneSignal (CSP-allowed)

### Build
- ✅ `npm run build` — pass, 234 pages
- ❌ `npm run lint` — 55 problems (34 errors, 21 warnings)
- ⚠️ Middleware deprecation warning

### Routing
- `src/middleware.ts` — legacy group path 307
- `src/app/video/*` — redirect to `/videos/*`
- `next.config.ts` + `vercel.json` — host redirects to `www.goalcurrent.live`

### Security
- ✅ API keys server-only (`src/lib/server/*`)
- ✅ Security headers (CSP, X-Frame-Options, nosniff)
- ⚠️ CSP permissive (`unsafe-inline`, `unsafe-eval`)
- ✅ `robots.txt` blocks `/api/`
- ✅ `ads.txt` present

### Accessibility
- ✅ H1, landmarks, ARIA regions on homepage
- ❌ Subscribe email field `readonly`
- Colour contrast not lab-tested

### Lighthouse-style metrics (homepage)

| Metric | Value |
|--------|------:|
| TTFB | ~92 ms |
| DOMContentLoaded | ~231 ms |
| Load | ~841 ms |
| Console errors | 0 |

---

## 4. Priority ranking summary

1. **Critical** — Sitemap gaps, AdSense placeholders, ESLint failures
2. **High** — Top scorers API, article URL duplication, stubs indexed, subscribe popup, middleware
3. **Medium** — Orphan assets, CSP, PL empty states, contact form
4. **Low** — Scaffold files, doc cleanup, branch hygiene

---

## 5. Action plan (repair entire project)

### Phase 1 — Week 1 (Critical)
1. Expand `src/app/sitemap.ts` for PL, videos, news sub-hubs, transfers, `/articles`
2. Replace AdSense slot IDs in `src/app/HomeClient.tsx`
3. Fix ESLint errors (hooks + PL components)
4. Canonicalise articles — one URL scheme + redirects

### Phase 2 — Week 2 (High)
5. WC26 top scorers overlay fallback
6. `noindex` on `src/lib/coming-soon-page.tsx`
7. Fix or remove `SubscribePopup.tsx`
8. Update `docs/ENVIRONMENT.md`
9. Remove duplicate News in `src/lib/nav.ts`
10. Migrate `src/middleware.ts` → proxy

### Phase 3 — Weeks 3–4 (Medium)
11. Delete scaffold SVGs only — **keep** `public/images/hero-home.png` (reserved asset)
12. Consolidate redirects into `next.config.ts` only
13. Bracket real data or hide
14. PL pre-season empty-state copy
15. Verify contact form backend
16. Tighten CSP where possible

### Phase 4 — Ongoing (Low)
17. Delete `live-promotion-prep` remote branch
18. Full mobile + Lighthouse CI on key pages
19. Archive legacy Vercel `goalcurrent.live` project

---

## Final TASK summary block

```
TASK: Full website technical audit — GoalCurrent.live
STATUS: COMPLETE
FILES: reports/audit-report.md, reports/findings.md, reports/readiness-score.md, reports/build-audit.txt, reports/lint-audit.txt
RESULT: 68/100 readiness; 37 issues (3 Critical, 9 High, 14 Medium, 11 Low); build pass; production core OK
BLOCKERS: Incomplete sitemap; placeholder AdSense slots; 34 ESLint errors
NEXT STEP: Phase 1 — sitemap expansion, real AdSense IDs, lint fixes, article canonical URLs
```

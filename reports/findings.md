# GoalCurrent.live — Audit Findings (prioritised)

**Audit date:** 2026-06-23  
**Repo:** `Az1341/goalcurrent-live-nextjs` · **Branch:** `main`  
**Vercel:** `goalcurrent-live-nextjs` · **URL:** https://www.goalcurrent.live

---

## Summary counts

| Priority | Count |
|----------|------:|
| Critical | 3 |
| High | 9 |
| Medium | 14 |
| Low | 11 |
| **Total** | **37** |

| Category | Issues |
|----------|-------:|
| SEO / sitemap | 4 |
| APIs / data | 4 |
| Code quality / lint | 6 |
| Content / UX stubs | 5 |
| Monetisation | 2 |
| Security | 2 |
| Performance | 3 |
| Routing / redirects | 4 |
| Assets / media | 3 |
| Documentation / ops | 3 |
| Accessibility | 2 |
| Architecture / duplication | 3 |

---

## Critical

### C-01 — Sitemap omits major site sections
- **Priority:** Critical  
- **Files:** `src/app/sitemap.ts` (lines 14–34 `STATIC_PATHS`)  
- **Evidence:** Production sitemap has **157** URLs. Build generates **234** static paths. Missing: `/premier-league`, `/videos`, all `/statistics/*`, all `/transfers/*`, `/news/transfers`, `/news/premier-league`, `/favourites/clubs`, `/favourites/players`, `/premier-league/clubs/*`, `/worldcup2026/players`, etc.  
- **Impact:** Search engines under-crawl ~45+ live pages.  
- **Fix:** Extend `STATIC_PATHS` and add generators for PL clubs, news sub-hubs, videos, statistics, transfers. Or programmatically derive from route manifest.

### C-02 — AdSense uses placeholder slot IDs on homepage
- **Priority:** Critical  
- **Files:** `src/app/HomeClient.tsx` (lines 315, 342)  
- **Evidence:** `slot="1234567890"` and `slot="2345678901"`.  
- **Impact:** No ad revenue; invalid AdSense units in production.  
- **Fix:** Replace with real slot IDs from Google AdSense dashboard. Verify `ca-pub-8697460993506171` units in `src/components/AdSenseUnit.tsx`.

### C-03 — ESLint fails with 34 errors (CI risk)
- **Priority:** Critical  
- **Files:** See `reports/lint-audit.txt` — primary files:  
  - `src/components/AdSenseUnit.tsx:23`  
  - `src/components/home/HomeFavouritesStrip.tsx:22`  
  - `src/components/home/HomePlSection.tsx:143,182,190`  
  - `src/lib/use-tournament-stats.ts:38`  
  - `src/lib/use-wc26-standings.ts:30`  
  - `src/lib/use-match-detail.ts:75`  
  - `src/lib/use-wc26-tv-region.ts:25`  
  - (+ 20 more in lint log)  
- **Impact:** `npm run lint` exits non-zero; blocks strict CI. React Compiler memo warnings.  
- **Fix:** Refactor `setState`-in-effect patterns (use `useSyncExternalStore`, lazy init, or event-only updates). Fix `prefer-const` in `HomePlSection.tsx`.

---

## High

### H-01 — WC26 top scorers API returns empty data
- **Priority:** High  
- **Files:** `src/app/api/wc26/top-scorers/route.ts`, `src/lib/server/wc26-top-scorers.ts`  
- **Evidence:** Production `GET /api/wc26/top-scorers` → `scorers: []`, `apiAvailable: false`, `configured: true`.  
- **Impact:** Top scorers widgets show “Loading…” on `/worldcup2026`, group pages.  
- **Fix:** Add overlay-based fallback (aggregate goals from finished matches in overlay) when API events unavailable; or document API-football plan limits.

### H-02 — Duplicate article URL systems (SEO duplicate content)
- **Priority:** High  
- **Files:**  
  - `src/data/articles-index.ts` → `/articles/{slug}`  
  - `src/data/articles.ts` + `src/app/news/articles/[slug]/page.tsx` → `/news/articles/{slug}`  
  - `src/app/news/alireza-beiranvand-iran-world-cup-hero/page.tsx` → redirects to `/articles/...`  
- **Evidence:** Nav links to `/news/articles/*` while homepage articles link to `/articles/*`.  
- **Impact:** Split PageRank; confusing canonical URLs.  
- **Fix:** Pick one canonical prefix. Add `rel=canonical` + 301 redirects from deprecated paths.

### H-03 — `/api/scores` returns 400 without query string
- **Priority:** High  
- **Files:** `src/app/api/scores/route.ts` (re-exports `wc26/scores`)  
- **Evidence:** `GET /api/scores` → 400 Bad Request on production.  
- **Impact:** Legacy consumers break; undocumented contract.  
- **Fix:** Document required `?live=true` or `?results=wc`, or default to `results=wc`.

### H-04 — Documentation still references GoalCurrent.online
- **Priority:** High  
- **Files:** `docs/ENVIRONMENT.md` (lines 1, 5)  
- **Impact:** Operator confusion after `.live` unification.  
- **Fix:** Rename to GoalCurrent.live; cross-link `docs/DEPLOY.md`.

### H-05 — `MAIN_NAV` contains duplicate News entry
- **Priority:** High  
- **Files:** `src/lib/nav.ts` (lines 56–60)  
- **Evidence:** `DESKTOP_PRIMARY_NAV` already includes News; `MAIN_NAV` spreads it then adds News again.  
- **Impact:** Duplicate nav items in footer/legacy consumers.  
- **Fix:** Remove duplicate `{ href: "/news", label: "News" }` from `MAIN_NAV`.

### H-06 — Many indexable routes are “Coming soon” stubs
- **Priority:** High  
- **Files:**  
  - `src/app/statistics/*/page.tsx` (7 routes)  
  - `src/app/video/highlights/page.tsx`, `video/podcasts/page.tsx`, `video/press-conferences/page.tsx`, `video/youtube/page.tsx`  
  - `src/lib/coming-soon-page.tsx`  
- **Impact:** Thin content indexed if linked; poor UX if discovered via direct URL.  
- **Fix:** `noindex` on stubs until built, or remove from sitemap/internal links.

### H-07 — Bracket section uses placeholder copy
- **Priority:** High  
- **Files:** `src/components/wc26/BracketSection.tsx` (line 37)  
- **Evidence:** “Bracket pairings are placeholders only — no match data connected yet.”  
- **Impact:** Misleading on `/worldcup2026/bracket`.  
- **Fix:** Wire knockout data or hide section until knockout phase.

### H-08 — Subscribe popup is non-functional placeholder
- **Priority:** High  
- **Files:** `src/components/layout/SubscribePopup.tsx` (lines 52–57)  
- **Evidence:** Email field `readonly`; button labelled “Subscribe (placeholder)”.  
- **Impact:** Users cannot subscribe; trust issue.  
- **Fix:** Integrate mailing provider or hide until ready.

### H-09 — Next.js middleware deprecation warning
- **Priority:** High  
- **Files:** `src/middleware.ts`, build output  
- **Evidence:** “middleware file convention is deprecated. Please use proxy instead.”  
- **Fix:** Migrate legacy group redirect to Next.js 16 `proxy` convention per `node_modules/next/dist/docs/`.

---

## Medium

### M-01 — Reserved asset `hero-home.png` (not orphan-delete)
- **Files:** `public/images/hero-home.png` (exists, no code references yet)  
- **Classification:** **Reserved asset** — Ahmad-marked important; **do not delete**.  
- **Active hero:** `football-hero-bg.jpg` per `.cursor/rules/homepage-hero-locked.mdc`.  
- **Fix:** Keep on disk. Wire into UI only with explicit Ahmad approval; document in asset inventory.

### M-02 — Duplicate redirect config (vercel.json + next.config.ts)
- **Files:** `vercel.json`, `next.config.ts` (redirects blocks)  
- **Fix:** Consolidate into one file (prefer `next.config.ts`).

### M-03 — Legacy `/video/*` routes (308 → `/videos/*`)
- **Files:** `src/app/video/page.tsx`, `src/app/video/*/page.tsx`  
- **Impact:** Extra redirect hop; OK functionally.  
- **Fix:** Update internal links to `/videos` only; keep redirects for bookmarks.

### M-04 — `worldcup2026/favourites` redirects to `/favourites`
- **Files:** `src/app/worldcup2026/favourites/page.tsx`  
- **Fix:** Remove stale links to WC26 favourites path.

### M-05 — PL standings show `played: 0` for all teams
- **Files:** `src/app/api/pl/standings/route.ts`, API-football mapping  
- **Evidence:** Pre-season data from API — expected but confusing on homepage PL section (“No results yet”).  
- **Fix:** Season label / empty state copy when `played === 0`.

### M-06 — React `img` instead of `next/image` for flags
- **Files:** `src/components/TeamFlag.tsx:47`  
- **Fix:** Use optimised images or document SVG flag exception.

### M-07 — CSP allows `unsafe-inline` and `unsafe-eval`
- **Files:** `next.config.ts` (lines 4–16 `INTEGRATION_CSP`)  
- **Fix:** Tighten after AdSense/OneSignal audit; use nonces where possible.

### M-08 — Unused import / variables (21 ESLint warnings)
- **Files:** `src/lib/use-news-feed.ts`, `src/lib/use-wc26-top-scorers.ts`, `src/components/favourites/FavouritesPageContent.tsx`, etc.  
- **Fix:** Remove dead code.

### M-09 — `data/articles.ts` vs `data/articles-index.ts` parallel systems
- **Files:** Both under `src/data/`  
- **Fix:** Merge into single article registry with canonical paths.

### M-10 — Sitemap missing `/articles` index page
- **Files:** `src/app/sitemap.ts` — includes article slugs but not `/articles` hub  
- **Fix:** Add `/articles` to `STATIC_PATHS`.

### M-11 — Homepage WC26 summary may show stale counts before overlay sync
- **Files:** `src/lib/use-tournament-stats.ts`, `src/app/HomeClient.tsx`  
- **Evidence:** Initial SSR may differ from client after overlay; live site shows 45 played (correct after sync).  
- **Fix:** Optional server-side seed from overlay for SSR parity.

### M-12 — Contact form has no backend handler visible
- **Files:** `src/components/info/ContactForm.tsx`  
- **Fix:** Verify Netlify Forms / API route; test submission end-to-end.

### M-13 — YouTube API key optional — videos limited to 4
- **Files:** `src/app/api/videos/route.ts`, `src/lib/youtube-videos.ts`  
- **Evidence:** Production returns 4 videos.  
- **Fix:** Confirm `YOUTUBE_API_KEY` in Vercel if more needed.

### M-14 — `npm warn Unknown env config "devdir"`
- **Files:** npm environment (not repo)  
- **Fix:** Clean local `.npmrc` / env on dev machines.

---

## Low

### L-01 — Default Next/Vercel SVG assets unused
- **Files:** `public/next.svg`, `public/vercel.svg`, `public/globe.svg`, `public/window.svg`, `public/file.svg`  
- **Fix:** Remove scaffold files.

### L-02 — `build-report.txt` untracked in repo root
- **Fix:** Add to `.gitignore` or delete.

### L-03 — `README.md` title updated but ENVIRONMENT.md lags
- **Fix:** Align all docs to `.live`.

### L-04 — Statistics nav links commented out in mobile More sheet
- **Files:** `src/lib/nav.ts` (lines 183–189)  
- **Fix:** Intentional — document or restore when pages ship.

### L-05 — `FOOTBALL_DATA_KEY` on legacy Vercel project only
- **Ops:** Legacy `goalcurrent.live` project disconnected from Git; env vars may diverge.  
- **Fix:** Ensure all keys live on `goalcurrent-live-nextjs` project only.

### L-06 — Match detail client loading states in HTML
- **Files:** `src/lib/use-match-detail.ts`  
- **Impact:** SEO sees “Loading…” until JS runs.  
- **Fix:** Server-render match summary where possible.

### L-07 — Favicon multi-format references
- **Files:** `src/app/layout.tsx` (icons block)  
- **Fix:** Verify all icon sizes exist in `public/icons/`.

### L-08 — Affiliate NordVPN link uses generic offer_id
- **Files:** `src/lib/site-keys.ts`  
- **Fix:** Confirm tracking with affiliate dashboard.

### L-09 — Duplicate homepage ticker match entries (visual)
- **Files:** `src/components/layout/LiveRibbon.tsx`  
- **Evidence:** Snapshot shows duplicate ticker items (wrap animation).  
- **Fix:** Cosmetic — verify intentional marquee duplication.

### L-10 — `statistics/player-rankings` and similar stubs indexed if crawled
- **Fix:** `robots` noindex on coming-soon template.

### L-11 — Git branch `live-promotion-prep` still exists
- **Ops:** Merged to `main`; branch may confuse contributors.  
- **Fix:** Archive/delete remote branch after team confirmation.

---

## Broken links report

**Internal routes (nav/sitemap sample):** No HTTP 404 on 27 production URLs tested (homepage, PL, WC26, news, APIs, redirects).

| URL | Status | Notes |
|-----|--------|-------|
| `/video` | 308 | Redirects to `/videos/` — not broken |
| `/worldcup2026/favourites` | 308 | Redirects to `/favourites` |
| `/news/alireza-beiranvand-iran-world-cup-hero` | 308 | Redirects to `/articles/...` |
| All other sampled routes | 200 | OK |

**Broken internal links:** None confirmed via HTTP probe.  
**Risk links:** Stub pages that resolve 200 but show “coming soon” (not broken, thin content).

---

## Broken / missing media report

| Asset | Referenced in | Local | Production | Issue |
|-------|---------------|-------|------------|-------|
| `/images/football-hero-bg.jpg` | `src/app/page.module.css:50` | ✅ | ✅ 200 | OK (locked hero) |
| `/images/hero-home.png` | — (reserved) | ✅ | ✅ | **Reserved asset — do not delete** |
| `/icons/icon-192.png` | `manifest.json`, `layout.tsx` | ✅ | ✅ 200 | OK |
| `/icons/apple-touch-icon.png` | `layout.tsx:47` | ⚠️ verify | not tested | May 404 if missing |
| Canada article JPGs (9) | `news/articles/football-inspiring-canadas-next-generation/page.tsx` | ✅ | not all tested | OK locally |
| WC26 flags `/flags/4x3/*.svg` | `TeamFlag.tsx` | ✅ 48 files | ✅ | Synced by prebuild |
| PWA screenshots | `manifest.json` | ⚠️ verify | not tested | Check `public/icons/screenshot-*.png` |

**Videos:** YouTube embeds via `/api/videos` — 4 items returned; no broken video IDs detected in API response.

---

## API health (production)

| Endpoint | Status | configured | Notes |
|----------|--------|------------|-------|
| `/api/wc26/scores?live=true` | 200 | true | 1 live match |
| `/api/wc26/scores?results=wc` | 200 | true | 45 FT results |
| `/api/wc26/top-scorers` | 200 | true | **Empty scorers** |
| `/api/wc26/match/[id]` | 200 | — | Match detail (sample fixture-001) |
| `/api/pl/standings` | 200 | true | Pre-season zeros |
| `/api/pl/fixtures` | 200 | true | Large payload |
| `/api/pl/live` | 200 | true | Empty fixtures |
| `/api/news` | 200 | — | 20 RSS articles |
| `/api/videos` | 200 | — | 4 videos |
| `/api/scores` (no query) | **400** | — | Needs query params |

---

## Lighthouse-style metrics (homepage, production probe)

| Metric | Value | Rating |
|--------|------:|--------|
| TTFB | ~92 ms | Good |
| DOMContentLoaded | ~231 ms | Good |
| Load event | ~841 ms | Good |
| Console errors (homepage) | 0 | Good |
| Cache | `X-Vercel-Cache: HIT` on repeat | Good |

*Full Lighthouse lab run not executed in this audit; values from Performance API + manual probe.*

---

## Accessibility notes (homepage snapshot)

| Check | Result |
|-------|--------|
| Single H1 | ✅ “Football live scores & match centre” |
| Landmarks | ✅ `main`, `nav`, `region` labels |
| Featured match region | ✅ `aria-label` |
| Live ticker | ✅ `aria-label="Live scores ticker"` |
| Subscribe email | ⚠️ `readonly` — not submittable |
| Cookie banner | ✅ Decline / Accept buttons |
| Colour contrast | Not lab-tested |

---

## Mobile responsiveness

| Check | Result |
|-------|--------|
| Mobile bottom tab bar defined | ✅ `MOBILE_BOTTOM_TABS` in `src/lib/nav.ts:98–104` |
| Viewport meta | ✅ via Next.js `viewport` export |
| Hero locked compact layout | ✅ `.homeHero` in `page.module.css` |
| Desktop audit viewport | Browser test at desktop width; mobile CSS uses `@media` in `page.module.css`, `master-chrome.module.css` |

**Recommendation:** Run dedicated 375px viewport pass for tab bar overlap and touch targets.

---

## Security notes

| Item | Status |
|------|--------|
| API keys server-only | ✅ `src/lib/server/*` |
| `.env*` gitignored | ✅ |
| CSP headers | ⚠️ Permissive (`unsafe-inline`, `unsafe-eval`) |
| `X-Frame-Options: SAMEORIGIN` | ✅ |
| `robots.txt` blocks `/api/` | ✅ |
| `ads.txt` present | ✅ |

---

## Build report

```
Next.js 16.2.9 — 234 static pages generated
TypeScript: pass
Middleware deprecation warning: present
Exit code: 0
```

Full log: `reports/build-audit.txt`  
Lint log: `reports/lint-audit.txt` (55 problems)

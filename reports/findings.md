# GoalCurrent.live — Audit Findings (all issues)

**Date:** 24 June 2026 · **Commit:** `bdae9c1` · **Tag:** `v1.0.0`

---

## Critical (0)

*None — build passes, production core routes healthy, no hardcoded AdSense IDs, no ESLint errors.*

---

## High (5)

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| H-01 | Sitemap has **200 URLs** but build emits **306** static paths — ~106 routes missing (statistics, transfers, favourites sub-pages, `/news/*` hubs, legacy `/video/*` pages still in build) | `src/app/sitemap.ts:18-120` | Add `STATIC_PATHS` for statistics, transfers, favourites; audit `generateStaticParams` orphans |
| H-02 | AdSense revenue depends on Vercel env — slots blank locally skip render; production RPM unverified | `src/lib/adsense-slots.ts`, `.env.example:28-38` | Set all `NEXT_PUBLIC_ADSENSE_SLOT_*` on Vercel Production |
| H-03 | ScoreBat highlights absent on production match page (no embed HTML) — token unset or no feed match | `src/lib/scorebat/getScoreBatEmbed.ts`, Vercel env | Set `SCOREBAT_API_TOKEN`; verify title matching for WC26 fixtures |
| H-04 | Production monitoring not configured | External | UptimeRobot 1-min ping; Sentry alerts on `/api/*`; Vercel Analytics thresholds |
| H-05 | Duplicate page trees still built despite 308 redirects — crawl budget + bundle waste | `src/app/video/*/page.tsx`, `src/app/worldcup2026/match/[fixtureId]/page.tsx`, `src/app/news/articles/[slug]/page.tsx` | Remove legacy `page.tsx` where redirect is canonical, or `noindex` + thin stubs |

---

## Medium (12)

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| M-01 | ESLint **11 warnings** (unused vars, hook deps) | `src/app/api/pl/fixtures/route.ts:43`, `src/components/favourites/FavouritesPageContent.tsx:105`, `src/components/wc26/GroupsHubContent.tsx:5`, `src/data/wc26/groups.ts:3`, `src/lib/client/useLiveTopScorers.ts:23`, `src/lib/pl/api-core.ts:2,69`, `src/lib/use-news-feed.ts:3`, `src/lib/use-wc26-tv-region.ts:48`, `src/lib/wc26-group-hub.ts:9`, `src/lib/youtube-videos.ts:70` | Remove dead imports; fix hook deps |
| M-02 | **21** coming-soon / under-construction routes (noindex ✅) | `src/lib/coming-soon-page.tsx:27`, `src/app/statistics/*/page.tsx`, `src/app/transfers/*/page.tsx`, `src/app/video/youtube/page.tsx` | Ship content or keep noindex until ready |
| M-03 | Reserved hero asset unused in code | `public/images/hero-home.png` | **Do not delete** — Ahmad-approved alternate; locked hero is `football-hero-bg.jpg` |
| M-04 | `Footer.tsx` re-export unused | `src/components/layout/Footer.tsx` | Import in `Layout.tsx` or delete shim |
| M-05 | `SubscribePopup.tsx` dead file (returns null, not imported) | `src/components/layout/SubscribePopup.tsx` | Delete or wire mailing provider |
| M-06 | `AdSenseUnit.tsx` deprecated but still used by PL strip | `src/components/AdSenseUnit.tsx`, `src/components/pl/PlCommercialStrip.tsx` | Migrate PL to `AdSlot` / `ContentAdSlot` |
| M-07 | CSP `script-src 'unsafe-inline'` required for GA/AdSense/JSON-LD | `src/lib/security/csp.ts` | Document; tighten when nonce strategy available |
| M-08 | PL standings pre-season all zeros | `src/app/api/pl/standings/route.ts` | Season-start empty-state copy (partially done in hub) |
| M-09 | Contact form submission backend unverified | `src/components/info/ContactForm.tsx` | E2E test with Netlify Forms or provider |
| M-10 | Match SSR shows “Loading…” for timeline/stats until client fetch | `src/components/match/MatchDetailSections.tsx`, `src/lib/use-match-detail.ts` | Optional server seed for static fixtures |
| M-11 | npm `devdir` warning on every build | Local npm config | Remove unknown `devdir` from user `.npmrc` |
| M-12 | `API_FOOTBALL_SIMULATE` dev-only — not documented in README | `src/lib/api-football/client.ts:33-52`, `.env.example` | Add to `docs/ENVIRONMENT.md` |

---

## Low (9)

| ID | Issue | File(s) | Fix |
|----|-------|---------|-----|
| L-01 | Unused scaffold SVGs | `public/next.svg`, `public/vercel.svg`, `public/globe.svg`, `public/window.svg`, `public/file.svg` | Delete |
| L-02 | WIP CSS file | `src/components/layout/master-chrome.module.css.colour-wip` | Delete or merge |
| L-03 | Untracked build/lint reports in repo root | `build-report-task*.txt`, `reports/build-audit-full.txt` | Add to `.gitignore` |
| L-04 | Duplicate ticker marquee items (cosmetic) | `src/components/layout/LiveRibbon.tsx` | Review animation duplication |
| L-05 | `TeamFlag` uses `<img>` not `next/image` | `src/components/TeamFlag.tsx` | Document exception (SVG flags) or migrate |
| L-06 | Statistics nav commented in More sheet | `src/lib/nav.ts` | Restore or document |
| L-07 | NordVPN affiliate tracking unverified | `src/lib/site-keys.ts` | Confirm `NORDVPN_HREF` params |
| L-08 | Empty `vercel.json` | `vercel.json` | Keep `{}` or add project settings |
| L-09 | Manual Web Vitals / Lighthouse not in CI | — | Add Lighthouse CI on `/`, `/live`, `/match/fixture-001` |

---

## Verified healthy (no issue)

- Homepage hero **LOCKED** — `public/images/football-hero-bg.jpg`, `src/app/HomeClient.tsx`
- Flags on teams — `TeamFlag` used across 20+ components
- Mobile bottom tab bar — `src/components/layout/BottomTabBar.tsx`, `src/lib/nav.ts`
- Custom 404 — `src/app/not-found.tsx`
- Error boundary — `src/app/error.tsx`, `src/app/global-error.tsx`
- Share buttons — `src/components/ui/ShareButtons.tsx` on articles + match
- API-Football error banners — `src/components/system/ApiFootballStatusBanner.tsx`
- Debug APIs blocked in production — `src/app/api/debug/*/route.ts` → **403**
- `robots.txt` — Allow `/`, Disallow `/api/`
- Redirects — `next.config.ts:10-51` (video, articles, wc26 match, apex hosts)

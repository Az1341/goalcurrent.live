# GC-WC26-ARCHIVE-INVENTORY-001 — World Cup Route and Content Inventory

**UK date/time:** 2026-07-20 22:10 BST  
**Branch:** `feature/wc26-archive-private-preview`  
**Baseline main SHA:** `2a6de49a97e9a5d4a98aa4134b9d67563ba28250`  
**Status:** INVENTORY ONLY — no deletes or redirects in this task  
**Traffic/SEO importance:** GA4 Admin volumes **NOT VERIFIED**; importance inferred from uniqueness and sitemap inclusion only.

## Classification legend

KEEP · CONVERT · CONSOLIDATE · REDIRECT · REMOVE FROM NAVIGATION · RETAIN AS HISTORICAL DATA · NOT VERIFIED

---

## A. Primary archive routes (`src/app/[locale]/worldcup2026`)

| Path | Type | Current purpose | SEO importance | Live wording | Data source | Recommended action | Redirect target | Risk | Required test |
|------|------|-----------------|----------------|--------------|-------------|--------------------|-----------------|------|---------------|
| `/[locale]/worldcup2026` | Page | Tournament hub | High (sitemap + nav) | Present-tense hub; live scoreboard language | Local typed data + API overlays | **CONVERT** to archive hub | — | Breaking hub UX | Metadata + archive label + a11y |
| `/.../groups` | Page | Groups hub | High | Group-stage browsing | `src/data/wc26` + standings libs | **CONVERT** (final standings framing) | — | Stale live copy | Standings consistency |
| `/.../groups/[group]` | Page | Single group | Medium | Per-group fixtures/standings | Same | **CONVERT** | — | Wrong tense | Group A–L smoke |
| `/.../fixtures` | Page | Full schedule | High | Mix of upcoming/today/live language in messages | Fixtures + confirmed results + API | **CONVERT** to results/archive schedule | — | Misleading “today” | Fixtures archive tests |
| `/.../match/[fixtureId]` | Page | Match centre | High (deep links) | Live centre framing | Match APIs + SSOT | **CONVERT** to historical match report; **KEEP** URL | — | Losing backlinks | Match result consistency |
| `/.../bracket` | Page | Knockout bracket | High | Knockout live polling/countdown | Bracket libs + `BracketLivePolling` | **CONVERT**; retire live poll on archive | — | Unfinished slots | Bracket final-state tests |
| `/.../standings` | Page | Standings | High | Live overlay language | Standings libs + confirmed | **CONVERT** | — | Inconsistent tables | Final standings tests |
| `/.../teams` | Page | Teams directory | Medium | Tournament teams | `teams.ts` | **KEEP** / light **CONVERT** labels | — | Low | Locale + flags |
| `/.../teams/[teamId]` | Page | Team profile | Medium | Team WC26 profile | Team data + history | **KEEP** URL; archive framing | — | Broken team links | Team page smoke |
| `/.../venues` | Page | Venues | Medium | Host venues | `venues.ts` | **KEEP** | — | Low | Locale |
| `/.../players` | Page | Players hub | Medium | Players listing | Top scorers + related | **CONVERT** / awards framing | — | Thin content | Top scorers consistency |
| `/.../news/morocco-knock-out-netherlands-on-penalties` | Article | Editorial | High unique | Past event article | Editorial body | **KEEP** | — | SEO loss if removed | article_open reuse |
| `/.../loading.tsx` | UI | Loading state | N/A | — | — | **KEEP** | — | — | — |

---

## B. Related content hubs and aliases

| Path | Type | Purpose | Action | Notes |
|------|------|---------|--------|-------|
| `/[locale]/news/world-cup` | Hub | WC news | **CONVERT** label to archive news; **KEEP** URL | |
| `/[locale]/videos/world-cup` | Hub | WC videos | **KEEP** / archive label | |
| `/[locale]/video/world-cup` | Hub | Legacy video path | **CONSOLIDATE** / evidence redirect if duplicate | Confirm duplicate vs videos |
| `/[locale]/live` | Page | Live scores (site-wide) | Do not delete; **REMOVE** WC26-as-lead prominence | Shared infrastructure |
| `/[locale]/match/[fixtureId]` | Page | Generic match route | **KEEP** if still linked; map WC IDs carefully | Risk of dual match URLs |

---

## C. GoalCurrent WC26 articles (retain URLs)

| Path | Action |
|------|--------|
| `/articles/spain-world-cup-2026-champion-masterclass` | **KEEP** |
| `/articles/england-6-4-france-third-place-recap` | **KEEP** |
| `/articles/england-france-third-place-preview` | **KEEP** (historical; past-tense framing later) |
| `/articles/england-argentina-world-cup-semifinal-analysis` | **KEEP** |
| `/articles/england-advance-to-face-mexico-round-of-16` | **KEEP** |
| `/articles/world-cup-2026-june-22-recap` | **KEEP** |
| `/articles/world-cup-2026-june-23-recap` | **KEEP** |
| `/articles/world-cup-2026-june-27-recap` | **KEEP** |
| `/articles/world-cup-2026-june-27-group-stage-finale` | **KEEP** |
| `/articles/world-cup-2026-june-30-recap` | **KEEP** |
| `/articles/world-cup-2026-july-1-recap` | **KEEP** |
| `/articles/world-cup-2026-july-3-recap` | **KEEP** |
| `/articles/world-cup-2026-teams-already-out` | **KEEP** (title may need archive note; do not invent renames without SEO plan) |
| `/articles/fifa-world-cup-2026-head-to-head-rule-early-elimination` | **KEEP** |
| `/articles/alireza-beiranvand-iran-world-cup-hero` | **KEEP** |
| `/news/alireza-beiranvand-iran-world-cup-hero` | **KEEP** / **CONSOLIDATE** if duplicate of articles path — **NOT VERIFIED** which is canonical |

Template `articles/_templates/world-cup-matchday-recap.page.tsx`: **RETAIN** as authoring aid; not a public route.

---

## D. API endpoints

| Path | Type | Purpose | Action | Risk |
|------|------|---------|--------|------|
| `/api/wc26/fixtures` | API | Fixtures feed | **RETAIN** temporarily for retained pages; prefer curated for archive reads | Unnecessary API-Football calls |
| `/api/wc26/knockout-fixtures` | API | Knockout feed | Same | Same |
| `/api/wc26/scores` | API | Scores sync | Retire live polling from archive UI; endpoint may remain | Cost/rate limits |
| `/api/wc26/match/[fixtureId]` | API | Match detail | Retain until archive uses stored data only | Same |
| `/api/wc26/top-scorers` | API | Scorers | Prefer final curated when available | Drift vs SSOT |
| `/api/debug/wc26` | Debug | Debug | **REMOVE FROM NAVIGATION**; restrict in prod if exposed | Info leak — **NOT VERIFIED** prod exposure |

---

## E. Data and libraries (historical retention)

| Path | Type | Action |
|------|------|--------|
| `src/data/wc26/*` | Static tournament data | **RETAIN AS HISTORICAL DATA** |
| `src/data/wc26-confirmed-results.json` | SSOT results | **RETAIN AS HISTORICAL DATA** — includes final M104 ESP 1–0 ARG (AET), winner `esp` |
| `src/data/wc26Standings.ts` | Standings helper data | **RETAIN** |
| `src/lib/wc26*` / `src/lib/wc26/**` | Domain logic | **RETAIN**; convert live helpers to archive mode later |
| `src/lib/server/wc26-*` | Server fetch | Audit in Task 09; do not delete blindly |
| `src/components/wc26/**` | UI | **CONVERT** presentation; keep components |
| `tests/wc26/**` | Tests | **KEEP**; extend for archive |

Verified final (repository SSOT, not external re-fetch): Match 104 Spain beat Argentina 1–0 AET (`knockoutResults`). Do not invent awards beyond repo evidence.

---

## F. Navigation and homepage

| Item | Path/evidence | Live wording | Action |
|------|---------------|--------------|--------|
| Mobile bottom tab WC26 | `MOBILE_BOTTOM_TABS` in `src/lib/nav.ts` | `wc26` | **REMOVE FROM NAVIGATION** as primary live tab; archive link via More/history |
| Desktop WC26 dropdown | `MasterHeader` + `DESKTOP_WC26_DROPDOWN` | Active competition | **REMOVE FROM NAVIGATION** prominence; archive entry elsewhere |
| More sheet submenu `wc26` | `MORE_SHEET_LEVEL1` | Active | **CONVERT** label to archive |
| `MAIN_NAV` includes `/worldcup2026` | `nav.ts` | Active | **CONVERT** / demote |
| `LiveRibbon` | `LiveRibbon.tsx` | WC fixtures href | Retire WC26 live ribbon behaviour |
| Homepage modules | `HomeClient`, `HomeHero`, `HomeWc26StandingsPreview`, `HomeChampionSnippet`, `HomeLiveMatchCards`, `HomeTodaysMatches` | Lead competition / live | Demote WC26; optional single archive card |
| `Wc26ResultsSync` in `Layout.tsx` | Global sync | Live | Retire or gate for archive era |

---

## G. Locales, SEO, analytics, robots

| Item | Evidence | Action |
|------|----------|--------|
| Messages `wc26` / `worldCup2026` keys | `messages/*.json` (all locales) | **CONVERT** copy to archive tense; keep keys where possible |
| Sitemap paths | `src/lib/seo/sitemap-static-paths.ts` | **KEEP** retained archive URLs; update titles via metadata later |
| Metadata on hub | `worldcup2026/page.tsx` present tense | **CONVERT** |
| Structured data EventSeries | Hub JSON-LD | Ensure not claimed as live ongoing event |
| `page_view` / `article_open` | Existing analytics | Do **not** duplicate emitters |
| robots | Site robots API | **NOT VERIFIED** WC26-specific rules in this pass — inspect before Task 07 |

---

## H. Live-state dependencies (for Task 09)

| Dependency | Location | Recommended action |
|------------|----------|--------------------|
| `BracketLivePolling` | `components/wc26/bracket` | Disable on archive |
| `useCountdown` | bracket | Disable post-completion |
| `Wc26ResultsSync` | layout | Gate/off for WC26 |
| `useLiveScores` / scores API | client libs | Stop WC26 archive page polling |
| Top scorers live hooks | `use-wc26-top-scorers` | Prefer final snapshot |
| Homepage live WC cards | home v5 | Remove live WC prominence |
| Cron `/api/cron/refresh-content` | `vercel.json` | Do not remove general cron; WC-specific refresh audit **NOT VERIFIED** |

---

## I. Items explicitly not destroyed in this task

No redirects implemented. No files deleted. No nav changes. No API removals.

## J. Evidence limitations

- Per-URL traffic: **NOT VERIFIED**
- Production HTML currently served: **NOT VERIFIED** in this task (inventory from repository)
- External FIFA confirmation of every award beyond SSOT scores: **NOT VERIFIED** — omit inventing awards
- Whether `/video/world-cup` vs `/videos/world-cup` both receive traffic: **NOT VERIFIED**

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
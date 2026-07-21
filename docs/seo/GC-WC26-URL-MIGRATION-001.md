# GC-WC26-URL-MIGRATION-001 — World Cup URL and Redirect Map

**UK date/time:** 2026-07-21 13:20 BST  
**Branch:** `feature/wc26-archive-private-preview`  
**Rule:** Permanent redirects only when a definitive replacement exists. No homepage dump. No chains.

## Retention (no redirect)

| URL pattern | Reason |
|-------------|--------|
| `/worldcup2026` | Archive hub (converted) |
| `/worldcup2026/groups` (+ `/[group]`) | Unique group archive |
| `/worldcup2026/fixtures` | Full schedule/results archive |
| `/worldcup2026/standings` | Final standings |
| `/worldcup2026/bracket` | Final bracket |
| `/worldcup2026/teams` (+ `/[teamId]`) | Team archive |
| `/worldcup2026/venues` | Venues |
| `/worldcup2026/players` | Retained placeholder → links to scorers |
| `/worldcup2026/news/morocco-knock-out-netherlands-on-penalties` | Unique editorial |
| `/news/world-cup` | News hub (label archive later) |
| `/videos/world-cup` | Videos hub |
| `/articles/*` WC26 articles listed in inventory | Unique SEO assets |
| `/match/:fixtureId` | Canonical match centres after existing redirect |

## Evidence-backed redirects (implemented in `next.config.ts`)

| Source | Destination | Permanent | Evidence |
|--------|-------------|-----------|----------|
| `/video` | `/videos` | yes | Legacy singular path; destination page exists |
| `/video/:path*` | `/videos/:path*` | yes | Includes `/video/world-cup` → `/videos/world-cup` |
| `/worldcup2026/favourites` | `/favourites` | yes | Favourites are global, not WC-only |
| `/worldcup2026/match/:fixtureId` | `/match/:fixtureId` | yes | Locale page also `redirect()`; single match centre |
| `/news/alireza-beiranvand-iran-world-cup-hero` | `/articles/alireza-beiranvand-iran-world-cup-hero` | yes | Article lives under `/articles` |
| `/news/articles` · `/news/articles/:slug` | `/articles` · `/articles/:slug` | yes | Editorial consolidation |

Locale-aware behaviour: next-intl + host redirects coexist; path redirects apply per Next config. Do not add a second hop from `/videos/world-cup` onward.

## Explicitly not redirected

| Candidate | Decision | Reason |
|-----------|----------|--------|
| All `/worldcup2026/*` → `/` | Rejected | Would destroy SEO and archive IA |
| `/live` → archive | Rejected | Live remains general football infrastructure |
| Unverified short links | Rejected | No evidence in repository |

## Canonical consistency

- Archive hub canonical: `/worldcup2026`
- Match canonical: `/match/:fixtureId` (after 301 from `/worldcup2026/match/:fixtureId`)
- Articles: self-canonical under `/articles/:slug`
- Internal links should prefer final destinations

## Chain / loop scan notes

- `/video/world-cup` → `/videos/world-cup` (one hop). Locale page also redirects to the same destination — not a third URL.
- `/worldcup2026/match/:id` → `/match/:id` only.

## Implementation note (Batch 004 Task 07)

No additional 301s were invented. Existing evidence-backed redirects in `next.config.ts` are documented and covered by unit tests. Navigation demotion is Task 08.

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
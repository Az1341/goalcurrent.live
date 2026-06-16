# Internal link audit (Phase 10I P0)

Audit date: post Phase 10H checkpoint. Crawl scope: static routes + WC26 SSG patterns.

## Fixed in P0

| Issue | Was | Now |
|-------|-----|-----|
| Homepage editorial 404 | `/news/football-inspiring-canadas-next-generation` | `/news` (under construction stub) |
| Footer Terms/Privacy/Cookies/Affiliate | All → `/about` | Dedicated `/terms`, `/privacy`, `/cookies`, `/affiliate-disclosure` |
| Cookie banner policy link | `/about` | `/cookies` |

## Valid internal routes (sample verified via build SSG)

- WC26 hub, groups A–L, 48 teams, 72 matches
- Live, favourites, fixtures, standings, venues, bracket
- About, contact, news (stub)

## Known stubs (not 404)

| Route | Behaviour |
|-------|-----------|
| `/news` | Under construction |
| `/about`, `/contact` | Under construction |
| `/worldcup2026/bracket` | Placeholder panel — no knockout data |

## Intentional external / affiliate

| Target | Notes |
|--------|-------|
| NordVPN footer CTA | Placeholder `aff_id=placeholder` — replace before monetization |
| Social links | External URLs in footer |

## Competition strip

Premier League / UCL / Europa / International → `/live` (WC26 live centre today). Not 404.

## Remaining low-priority gaps (P1, not fixed)

- Favourite competitions — no deep link to `/worldcup2026`
- Full legal copy — placeholder summaries only
- Homepage client page — no per-URL canonical (root layout covers `/`)

## Orphan check

No orphan app routes found. API routes excluded from sitemap and robots allow list.

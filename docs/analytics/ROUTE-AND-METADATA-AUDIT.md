# Route and metadata audit

Audit date: 2026-07-19. Branch: goalcurrent-v2-rebuild.

## Route classification (high traffic)

| Route | Class | Action |
|-------|-------|--------|
| / | canonical | Homepage title normalized |
| /live | canonical | Live Scores title |
| /match/[fixtureId] | canonical | Stable match titles |
| /worldcup2026/match/[fixtureId] | redirect | next.config + app redirect to /match/[fixtureId] |
| /worldcup2026/* hub | canonical | World Cup 2026 hub |
| /articles/[slug] | canonical | ArticleViewTracker |
| /videos | canonical | Videos title (no duplicate branding) |
| /video/* | redirect | to /videos/* |
| /news/articles/* | redirect | to /articles/* |
| goalcurrent.online host | redirect | to goalcurrent.live |

## Metadata fixes applied

- buildStableMatchTitle for match pages (no TBD/Winner/Loser in titles)
- normalizePageTitleText in buildPageMetadata
- Homepage pipe separator pattern
- Videos hub title uses layout template only

## 404

- src/app/[locale]/not-found.tsx (client) — title follows layout default; no GA pollution on non-production hosts

## Placeholder match routes

- Unknown fixture ids: notFound() on /match/[fixtureId]

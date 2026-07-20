# GC-SEO-001 — Production SEO audit

**Date:** 2026-07-20 ~16:10 BST  
**Mode:** Audit only — no fixes  
**Sample host:** https://www.goalcurrent.live

## HTTP status probes

| URL | Status |
|-----|--------|
| `/` | 200 |
| `/robots.txt` | 200 |
| `/sitemap.xml` | 200 |
| `/articles` | 200 |
| `/live` | 200 |
| `/articles/spain-world-cup-2026-champion-masterclass` | 200 |
| unknown path | **404** |

## Findings

### Pass / present

- Root layout metadata: `metadataBase`, Open Graph, Twitter (`src/app/[locale]/layout.tsx`).
- Article sample has `title`, `meta description`, `link rel=canonical`, hreflang alternates (en/fa/ar/fr/…).
- Open Graph: `og:title`, `og:description`, `og:url`, `og:image`, `og:type=article`.
- Twitter: `summary_large_image` + title/description/image.
- JSON-LD `NewsArticle` / `@graph` present on static article.
- `robots.txt` and `sitemap.xml` served (rewrites to `/api/robots`, `/api/sitemap`).
- Unknown URL returns 404.
- Redirects configured in `next.config.ts` (`SITE_REDIRECTS`).

### Issues / risks (no fix in this task)

| Severity | Finding |
|----------|---------|
| Medium | Canonical / `og:url` use **apex** `https://goalcurrent.live/...` while traffic often hits **www**. Ensure apex↔www strategy is intentional to avoid soft duplicates. |
| Medium | Article `og:image` / twitter image often **site screenshot** (`/icons/screenshot-desktop.png`) rather than article hero art — weaker share cards. |
| Low | `article:published_time` observed as human string (`19 July …`) rather than strict ISO-8601 in HTML sample — may hurt rich-result parsers. |
| Low | Homepage cache headers show `s-maxage=30` in one probe while config also sets no-store for some routes — verify intended CDN behaviour for home. |
| Info | Duplicate title/description scan not exhaustively run across all locales; recommend periodic crawl. |

## Verdict

**CONDITIONAL PASS** — core SEO surface healthy; host canonical consistency and OG image specificity need founder/product decisions.
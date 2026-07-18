# Homepage performance (Lighthouse)

## Changes shipped (4e44012+)

| Change | File | Expected effect |
|--------|------|-----------------|
| Lazy-load below-fold sections | `HomeClient.tsx` | Smaller initial JS bundle; faster first paint |
| `HomeTrendingClips` client-only | `HomeClient.tsx` | YouTube/embed code not in SSR path |
| Skeleton placeholders | `HomeClient.tsx` | Stable layout while chunks load |
| `revalidate = 30` | `[locale]/page.tsx` | Less rebuild churn vs 15s |

Sections deferred: `HomeTodaysMatches`, `HomeLatestNews`, `HomeTrendingClips`, `HomeTeamsLeagues`.  
Eager: hero, live ribbon, header/footer chrome.

## How to measure

```bash
npm run build
npm run start -- -p 4877
node scripts/lighthouse-home.mjs http://localhost:4877
# or production:
npm run lighthouse:home
```

Output: `docs/perf/HOMEPAGE-PERF.md` (this file, overwritten with scores) + `docs/perf/lighthouse-home.latest.json`

Playwright E2E now runs `npm run build` before `next start` so perf-related bundles match production.

## Baseline note

Automated Lighthouse on Windows CI may fail on Chrome temp cleanup (EPERM). PageSpeed Insights API can rate-limit (429). Run locally or use [PageSpeed Insights](https://pagespeed.web.dev/analysis?url=https://goalcurrent.live) for production checks.

Track **LCP**, **TBT**, and **TTI** before/after lazy-load deploys. Target: lower TBT and faster LCP vs pre-4e44012 baseline where hero was blocked by eager clip/news bundles.

## Expected gains (lazy-load track)

| Metric | Direction | Why |
|--------|-----------|-----|
| TBT | ↓ | Less JS parsed/executed on first load |
| LCP | ↓ or stable | Hero no longer waits on news/clips bundles |
| FCP | ↓ slightly | Smaller main-thread work before first paint |
| Speed Index | ↓ | Above-fold paints sooner with skeletons |

Record a fresh Lighthouse run after deploy and paste scores into the table below.

| Run date | URL | Perf | LCP | TBT | CLS |
|----------|-----|------|-----|-----|-----|
| _pending local run_ | https://goalcurrent.live | — | — | — | — |

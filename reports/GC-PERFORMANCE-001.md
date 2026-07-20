# GC-PERFORMANCE-001 — Production performance audit

**Date:** 2026-07-20 BST · **Mode:** Opportunities only — no implementation

## Observations

- Next.js App Router + Turbopack production builds on Vercel (`dpl_*` chunk URLs).
- Homepage HTML includes many `/_next/static/chunks/*.js` script tags (article sample showed 15+ async chunks) — expected for feature-rich app, but room to reduce above-the-fold JS.
- Fonts: Inter variable preloaded (woff2) — good; watch CLS from late font swap.
- Images: hero SVGs / remote sports CDNs; Next image pipeline present; verify `priority` only on LCP candidates.
- Service worker (`sw.js`) registered after analytics consent — can help repeat visits; risk of stale shell if cache versioning lags.
- Live/scores pages are dynamic — TTFB sensitive to API upstreams (`API_FOOTBALL`, RSS).
- No `@vercel/speed-insights` in package — Lab metrics not auto-collected in-app.

## Lab metrics

Field Lighthouse / CrUX not run in this audit session (no PageSpeed API key). Recommend founder CI or Search Console CWV.

## Optimisation opportunities (prioritised)

| Priority | Opportunity |
|----------|-------------|
| P1 | Measure LCP/INP/CLS on `/`, `/live`, article detail with PageSpeed + field data |
| P1 | Audit LCP element on home (hero vs champion banner) and ensure single priority image |
| P2 | Route-level code split for WC26 bracket / heavy calendars (already large client modules) |
| P2 | Defer non-critical third parties (OneSignal `lazyOnload` already; keep GA after consent) |
| P2 | Reduce duplicate CSS chunk count if build analysis shows unused |
| P3 | Consider removing or gating SW on first visit for clearer TTFB debugging |
| P3 | Prefetch only high-intent nav targets to avoid wasted bandwidth |

## Verdict

**CONDITIONAL** — architecture capable; need measured CWV before claiming performance PASS.
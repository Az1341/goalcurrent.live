# GC-GA4-AUDIT-008 — Repository search classification

**Date:** 2026-07-20 (BST)  
**Scope:** `src/`, `tests/analytics/`, `docs/analytics/`  
**Verdict:** No duplicate application `page_view` implementation.

## Search terms

`gtag` · `page_view` · `GoogleAnalytics` · `dataLayer` · `history` · `pushState` · `replaceState` · `navigation` · `analytics` · `collect`

## Classification table (application-relevant)

| File | Term(s) | Class | Notes |
|------|---------|-------|-------|
| `src/components/analytics/GA.tsx` | gtag, dataLayer, config | **expected** | Single script + init guard |
| `src/lib/analytics/transport.ts` | gtag, dataLayer, page_view | **expected** | Sole `gtag('event','page_view')` |
| `src/components/analytics/AnalyticsRouteListener.tsx` | page_view, sendPageView, usePathname | **expected** | Sole SPA page_view caller |
| `src/lib/analytics/events.ts` | sendAnalyticsEvent | **expected** | Custom events only |
| `src/lib/analytics/config.ts` | analytics host gate | **expected** | |
| `src/lib/analytics/*` | schemas, dedupe, internal | **expected** | |
| `src/types/integrations.d.ts` | gtag, dataLayer | **expected** | Types |
| `src/components/analytics/*Tracker*.tsx` | track* | **expected** | Custom events |
| `AffiliateOutboundLink.tsx`, `FavouriteButton.tsx`, headers/locale | track* | **expected** | |
| `src/lib/security/csp.ts` | googletagmanager / analytics hosts | **expected** | CSP allowlist |
| `MobileBackBar.tsx` | `window.history.length` | **expected** | UX back; not analytics |
| Layout/nav `usePathname` | navigation | **expected** | UI routing; not GA |
| `pushState` / `replaceState` in `src/` | — | **absent** | No direct history API analytics |
| `GoogleAnalytics` component string | — | **absent** | |
| GTM container ID / `GTM-` | — | **absent** | |
| `@vercel/analytics` | — | **absent** | |
| Docs under `docs/analytics/` | many | **expected** | Documentation |
| `tests/analytics/*` | many | **expected** | Regression tests |

## Duplicate application implementation check

| Question | Result |
|----------|--------|
| More than one `sendPageView(` call site outside transport/index? | **No** — only `AnalyticsRouteListener.tsx` |
| More than one `gtag('event','page_view'` in src? | **No** — only `transport.ts` |
| Second gtag.js script injection? | **No** — single tag in `GA.tsx` |
| Un-guarded double `config`? | **No** — `__gc_gtag_init` in GA + transport |
| App-level `pushState` page_view listener? | **No** |

## Residual production duplicate

Classified as **Google platform behaviour** (Enhanced Measurement history page views), not a second app implementation. See `GA4-ENHANCED-MEASUREMENT.md`.

## Conclusion

**PASS** — repository contains a single intentional SPA `page_view` pipeline. No unexpected duplicate application emitter found.
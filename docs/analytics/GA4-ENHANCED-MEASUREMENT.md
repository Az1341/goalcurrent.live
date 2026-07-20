# GA4 Enhanced Measurement — SPA page_view assumptions

**Document ID:** GC-GA4-ADMIN-001  
**Updated:** 2026-07-20 (BST)  
**Production commit at audit:** `30cddd2`  
**Measurement ID:** `G-X84HCE5KGT`

## Purpose

Document how GoalCurrent.live controls `page_view` in code versus what GA4 Admin Enhanced Measurement still does automatically — and what the founder must change in Admin.

## Current application configuration (code)

| Setting | Value | Location |
|--------|--------|----------|
| Measurement ID | `G-X84HCE5KGT` (override `NEXT_PUBLIC_GA_ID`) | `src/lib/analytics/config.ts` |
| Host allowlist | `www.goalcurrent.live`, `goalcurrent.live` only | `src/lib/analytics/config.ts` |
| Consent gate | Scripts load only after `gc_cookie_consent_v1=accepted` | `src/components/analytics/GA.tsx` |
| Script load | Single `gtag/js?id=…` | `GA.tsx` |
| Init guard | `window.__gc_gtag_init` | `GA.tsx`, `transport.ts` |
| `gtag('config', …)` | `send_page_view: false` | `GA.tsx`, `transport.ts` |
| Manual SPA `page_view` | One per pathname via route listener | `AnalyticsRouteListener.tsx` → `sendPageView` |
| Remount dedupe | `shouldSkipDuplicateEvent` TTL 2500 ms | `AnalyticsRouteListener.tsx` |
| GTM container | Not used | — |
| `@vercel/analytics` | Not used | — |

### Important assumption (corrected)

Setting `send_page_view: false` **only** disables the automatic page_view that normally fires when the Google tag **loads**.

It does **not** disable GA4 **Enhanced Measurement → Page changes based on browser history events**.

For App Router SPAs that call the History API, Enhanced Measurement can still emit a second `page_view` after client navigations — even when the app already sends a manual `page_view`.

## Production evidence (GC-GA4-ROOTCAUSE-007)

On `www.goalcurrent.live` after client navigation (e.g. `/videos` → `/live`):

1. Exactly **one** application call: `gtag('event','page_view',{ page_path, page_title, page_location })`.
2. Collect #1 (~immediate): includes `dp` (from `page_path`).
3. Collect #2 (~5–6 s later): `page_view` **without** `dp`, initiator stack entirely inside `googletagmanager.com/gtag/js` (`CQ.flush`) — no app frames.

Conclusion: residual duplicates are **Google platform behaviour**, not a second app caller. Raising the remount TTL would only mask the symptom.

Official reference: [Measure pageviews](https://developers.google.com/analytics/devguides/collection/ga4/views) (Enhanced Measurement history events are independent of `send_page_view`).

## Required GA4 Admin changes

| # | Admin path | Action | Owner |
|---|------------|--------|--------|
| 1 | Admin → Data collection and modification → Data streams → Web stream for goalcurrent.live | Open stream | Founder |
| 2 | Enhanced measurement → gear / settings | Edit Page views | Founder |
| 3 | Page views → Show advanced settings | **Disable** “Page changes based on browser history events” | Founder |
| 4 | Save | Confirm other Enhanced measurement toggles as preferred | Founder |

Optional (keep unless product says otherwise):

- Leave “Page loads” enabled for full document loads.
- Keep outbound clicks / file downloads / video engagement only if product wants them (app already tracks some affiliate clicks manually).

## Screenshots required from founder

Capture and store (e.g. under founder ops notes; do not commit PII):

1. Data stream overview showing measurement ID `G-X84HCE5KGT`.
2. Enhanced measurement panel (before change).
3. Page views advanced settings with “Page changes based on browser history events” **off**.
4. Enhanced measurement panel (after save).
5. Optional: DebugView after one client navigation showing a **single** `page_view`.

## Implementation notes (engineering)

- **Do not** “fix” this by increasing `PAGE_VIEW_REMOUNT_TTL_MS`.
- Keep manual `AnalyticsRouteListener` page_view as the SPA source of truth.
- Keep `send_page_view: false` on every `config` call.
- After Admin change, re-verify on production with Network: one `page_view` collect per client route (with `dp`), no delayed second collect without `dp`.
- Founder click-by-click guide: `docs/analytics/GA4-FOUNDER-ACTION-PACK-ENHANCED-MEASUREMENT.md` (GC-GA4-ADMIN-002).

## Documentation status

| Topic | Doc | Status |
|-------|-----|--------|
| Enhanced Measurement / SPA duplicates | This file | Current |
| Integration map | `GA4-AUDIT.md` | Cross-linked |
| Validation | `GA4-VALIDATION-REPORT.md` | Cross-linked |
| Founder steps | Founder Action Pack | GC-GA4-ADMIN-002 |

## Related task IDs

- `GC-GA4-LIVE-VERIFY-005` — live verify
- `GC-GA4-FIX-006` — static `article_open` + remount TTL
- `GC-GA4-ROOTCAUSE-007` — residual duplicate root cause
- `GC-GA4-ADMIN-001` — this document
- `GC-GA4-ADMIN-002` — founder action pack
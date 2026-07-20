# Founder Action Pack — Disable history-based Enhanced Measurement page views

**Document ID:** GC-GA4-ADMIN-002  
**Date:** 2026-07-20 (BST)  
**Property / stream:** GoalCurrent.live web · Measurement ID `G-X84HCE5KGT`  
**Why:** Production SPA navigations currently get a second delayed `page_view` from GA4 Enhanced Measurement (missing `dp`). App already sends one manual `page_view`. See `GA4-ENHANCED-MEASUREMENT.md` (GC-GA4-ADMIN-001 / ROOTCAUSE-007).

**Do not change application code for this fix.**

---

## Goal

Disable only:

**Enhanced measurement → Page views → Page changes based on browser history events**

Leave other Enhanced measurement options as you prefer unless noted.

---

## Prerequisites

- Founder Google account with **Editor** (or Admin) access to the GA4 property that owns `G-X84HCE5KGT`.
- Desktop browser (Chrome/Edge recommended).
- ~10 minutes.

---

## Click-by-click procedure

### A. Open the correct property

1. Go to [https://analytics.google.com/](https://analytics.google.com/).
2. Top-left property picker → select the **GoalCurrent.live** (or production) GA4 property.
3. **Screenshot required:** property name visible in the header.

### B. Open the web data stream

1. Left rail → **Admin** (gear).
2. Under **Data collection and modification** → **Data streams**.
3. Click the **Web** stream for `goalcurrent.live` / `www.goalcurrent.live`.
4. Confirm **Measurement ID** shows `G-X84HCE5KGT`.
5. **Screenshot required:** stream details with Measurement ID.

### C. Open Enhanced measurement settings

1. On the stream details page, find **Enhanced measurement**.
2. Ensure the master Enhanced measurement toggle remains **On** (unless you intentionally turn everything off — not recommended).
3. Click the **cog / settings** icon on the Enhanced measurement row (not only the on/off switch).
4. **Screenshot required:** Enhanced measurement settings panel **before** change.

### D. Disable history-based page changes

1. In the settings list, find **Page views** (sometimes labelled under Page views / page changes).
2. Expand **Page views** → **Show advanced settings** (wording may be “Show advanced settings” / chevron).
3. Locate: **Page changes based on browser history events** (or equivalent: history change / SPA page changes).
4. **Turn this option OFF**.
5. Leave **Page loads** (full page loads) **ON** unless you have a separate reason to disable it.
6. Click **Save** (or Done / Apply — use the primary save control for the panel).
7. **Screenshot required:** advanced Page views settings with history-based option **off**.
8. Return to stream overview → **Screenshot required:** Enhanced measurement panel **after** save.

### E. Exit

1. Close Admin and return to Reports if desired.
2. Store screenshots in your private ops folder (do not commit secrets or account emails to git).

---

## Rollback

If page_view volume drops unexpectedly or SPA navigations stop appearing:

1. Admin → Data streams → same web stream → Enhanced measurement settings.
2. Re-enable **Page changes based on browser history events**.
3. Save.
4. Note: re-enabling will restore the **duplicate** behaviour while the app still sends manual SPA `page_view`. Prefer fixing verification first rather than leaving both on long-term.

---

## Verification procedure (after Admin save — wait up to 30 minutes for tagging settings to propagate)

### Network (preferred)

1. Open a **private/incognito** window → https://www.goalcurrent.live/
2. Accept analytics cookies.
3. DevTools → Network → filter `collect` → Preserve log.
4. Client-navigate: `/` → `/live` → `/videos` (no full reload).
5. For each navigation, expect:
   - **One** `page_view` collect with `dp` matching the path.
   - **No** second `page_view` ~5–6 seconds later **without** `dp`.
6. **Screenshot required:** Network list for one navigation (one `page_view`).

### DebugView (if available)

1. Install GA Debugger or use debug mode as you normally do.
2. Admin → DebugView.
3. Perform the same client navigations.
4. Expect one `page_view` per route change.
5. **Screenshot required:** DebugView timeline.

### Pass / fail

| Result | Meaning |
|--------|---------|
| One manual-style `page_view` with `dp` per SPA nav; no delayed duplicate | **PASS** |
| Delayed second `page_view` without `dp` still present after 30+ min | **FAIL** — confirm stream ID, that save applied, hard-refresh, retry; escalate to engineering with screenshots |

---

## What engineering will not do for this issue

- Will not increase the 2.5s remount TTL to hide Google duplicates.
- Will not remove manual `AnalyticsRouteListener` page_view (SPA source of truth).
- Will not deploy a code workaround for Admin configuration.

---

## Related docs

- `docs/analytics/GA4-ENHANCED-MEASUREMENT.md` (GC-GA4-ADMIN-001)
- `docs/analytics/GA4-AUDIT.md`
- Task `GC-GA4-ROOTCAUSE-007`
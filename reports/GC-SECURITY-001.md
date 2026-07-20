# GC-SECURITY-001 — Security audit

**Date:** 2026-07-20 BST · **Mode:** Report only — no fixes

## Headers (production www)

| Header | Observed |
|--------|----------|
| Strict-Transport-Security | `max-age=63072000` |
| Content-Security-Policy | Present (proxy/`csp.ts`) |
| X-Content-Type-Options | `nosniff` |
| X-Frame-Options | `SAMEORIGIN` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | geolocation/mic/camera denied |

## Findings

| Severity | Area | Finding |
|----------|------|---------|
| Medium | CSP | `script-src` includes `'unsafe-inline'` (documented for Next/GA/JSON-LD). Prefer nonces long-term. |
| Medium | CSP | `img-src` includes broad `https:` — intentional for news thumbs; increases XSS image surface. |
| Medium | Debug API | `src/app/api/debug/api-football/route.ts` exists — confirm production auth/disable. |
| Low | Cookies | Consent in `localStorage` (`gc_cookie_consent_v1`); GA cookies post-consent only (verified earlier). |
| Low | CSRF | Mostly read APIs; cron uses `CRON_SECRET` — good pattern. |
| Info | Secrets | Keys via env (`API_FOOTBALL_KEY`, `YOUTUBE_API_KEY`, `CRON_SECRET`) — do not commit. |
| Info | Auth | Firebase optional; OneSignal fallback — review auth cookie flags if sessions expand. |
| Pass | HSTS | Present |
| Pass | Frame ancestors | `frame-ancestors 'self'` + XFO |

## Rate limiting

Server cache / rate-limit helpers present in lib tests — confirm applied on expensive public API routes.

## Verdict

**CONDITIONAL PASS** — solid baseline headers; tighten CSP and lock down debug routes.
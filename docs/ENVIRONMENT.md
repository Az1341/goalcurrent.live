# GoalCurrent.live — environment setup

## Overview

GoalCurrent.live is a Next.js 16 app deployed from **`main`** on Vercel project **`goalcurrent.live`**.

World Cup 2026 **fixture metadata** (teams, groups, venues, kickoffs) lives in `src/data/wc26/` and is the single source of truth.

**Live scores, match events, lineups, and statistics** are fetched server-side from [api-football](https://www.api-football.com/) when `API_FOOTBALL_KEY` is set. Without the key, the site runs in an honest scheduled state — no hardcoded results.

---

## Required variables (production)

Set on Vercel project **`goalcurrent.live`** (Production + Preview):

| Variable | Scope | Description |
|----------|-------|-------------|
| `API_FOOTBALL_KEY` | Server only | api-sports.io key for live scores and match detail |
| `YOUTUBE_API_KEY` | Server only | YouTube Data API v3 for video ingestion |
| `CRON_SECRET` | Server only | Bearer token for `/api/cron/refresh-content` |

## Optional variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `FOOTBALL_DATA_KEY` | Server only | Secondary football data source |
| `GNEWS_API_KEY` | Server only | Secondary news source (skipped when unset) |
| `SCOREBAT_API_TOKEN` | Server only | ScoreBat video highlights |

See `.env.example` for the full template including AdSense and Sentry.

**Security:** never prefix API keys with `NEXT_PUBLIC_`. Keys must only be read in server code and API routes.

---

## Local development

1. Clone **https://github.com/Az1341/goalcurrent.live** and install:

   ```bash
   npm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env.local
   ```

3. Add keys to `.env.local` as needed (all optional locally):

   ```
   API_FOOTBALL_KEY=your_key_here
   YOUTUBE_API_KEY=your_key_here
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Verify API (when `API_FOOTBALL_KEY` is set):

   - `http://localhost:3000/api/wc26/scores?results=wc` → `"configured": true`
   - `http://localhost:3000/api/wc26/match/fixture-001` → JSON payload

Without a key, endpoints return `configured: false` — expected behaviour.

---

## Vercel setup

1. Open Vercel project **`goalcurrent.live`**.
2. Confirm **Settings → Git → Production Branch** is **`main`**.
3. **Settings → Environment Variables** — add keys for Production and Preview.
4. Redeploy after changes.

### Smoke tests (Preview or Production)

| Check | Expected |
|-------|----------|
| `GET /api/wc26/scores?results=wc` | `200`, `configured: true` when key set |
| `GET /api/news` | `200`, articles returned |
| `GET /api/videos` | `200`, videos returned |
| `GET /api/cron/refresh-content` (with Bearer token) | `200`, `ok: true` |

---

## Build notes

- `npm run prebuild` syncs WC26 flag SVGs from lipis/flag-icons (requires network at build time).

---

## Related docs

- [DEPLOY.md](./DEPLOY.md) — production branch, cron, and deploy workflow
- [SITEMAP-ROUTES.md](./SITEMAP-ROUTES.md) — route inventory for SEO audit
- `src/data/wc26/DATA_VERIFICATION.md` — WC26 data SSOT rules

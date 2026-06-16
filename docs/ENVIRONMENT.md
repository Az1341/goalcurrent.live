# GoalCurrent.online — environment setup

## Overview

GoalCurrent.online is a Next.js 16 app. World Cup 2026 **fixture metadata** (teams, groups, venues, kickoffs) lives in `src/data/wc26/` and is the single source of truth.

**Live scores, match events, lineups, and statistics** are fetched server-side from [api-football](https://www.api-football.com/) when `API_FOOTBALL_KEY` is set. Without the key, the site runs in an honest scheduled state — no hardcoded results.

---

## Required variables

| Variable | Scope | Environments | Description |
|----------|-------|--------------|-------------|
| `API_FOOTBALL_KEY` | **Server only** | Production, Preview (recommended for testing) | api-sports.io key for `/api/wc26/scores` and `/api/wc26/match/[fixtureId]` |

**Security:** never use `NEXT_PUBLIC_API_FOOTBALL_KEY`. The key must only be read in `src/lib/server/*` and API routes.

---

## Optional variables

None are required today. See `.env.example` for the template.

---

## Local development

1. Clone the repo and install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file:

   ```bash
   cp .env.example .env.local
   ```

3. Add your api-football key to `.env.local` (optional for local work):

   ```
   API_FOOTBALL_KEY=your_key_here
   ```

4. Start the dev server:

   ```bash
   npm run dev
   ```

5. Verify API (when key is set):

   - `http://localhost:3000/api/wc26/scores?results=wc` → `"configured": true`
   - `http://localhost:3000/api/wc26/match/fixture-001` → JSON payload (events may be empty pre-tournament)

Without a key, both endpoints return `configured: false` and empty data — expected behaviour.

---

## Vercel setup

1. Link the project to Vercel (if not already linked).
2. Open **Project → Settings → Environment Variables**.
3. Add:

   | Name | Value | Environments |
   |------|-------|--------------|
   | `API_FOOTBALL_KEY` | Your api-football key | Production, Preview |

4. Redeploy after adding or changing the variable.

### Smoke tests (Preview or Production)

| Check | Expected |
|-------|----------|
| `GET /api/wc26/scores?results=wc` | `200`, `configured: true` when key set |
| `GET /api/wc26/scores?live=true` | `200`, `phase: "pre-tournament"` before 11 Jun 2026 UTC kickoff |
| Homepage / Live Centre | Scheduled fixtures; scores only when overlay has API data |
| Match detail | Honest empty states when no events yet |

---

## Build notes

- `npm run prebuild` syncs 48 WC26 flag SVGs from lipis/flag-icons (requires network at build time).
- Production build generates **148 static routes** including 72 match and 48 team pages.

---

## Related docs

- `docs/SITEMAP-ROUTES.md` — route inventory for SEO audit
- `src/data/wc26/DATA_VERIFICATION.md` — WC26 data SSOT rules

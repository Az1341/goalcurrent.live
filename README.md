# GoalCurrent.live

Next.js app for **https://goalcurrent.live** — fixtures, live centre, standings, and match detail.

**Repository:** [github.com/Az1341/goalcurrent.live](https://github.com/Az1341/goalcurrent.live) · **Vercel:** `goalcurrent.live` · **Branch:** `main`

## Quick start

```bash
npm install
cp .env.example .env.local   # optional: add API_FOOTBALL_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

See **[docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)** for:

- `API_FOOTBALL_KEY` (server-side, optional locally)
- Vercel environment setup on project **`goalcurrent.live`**
- API smoke tests

## Build

```bash
npm run build
npm start
```

Prebuild syncs WC26 flag SVGs (`scripts/sync-wc26-flags.mjs`).

## Deploy

**This is the only live repo.** Production deploys from **`main`** to Vercel project **`goalcurrent.live`** → https://goalcurrent.live

Full guide: **[docs/DEPLOY.md](docs/DEPLOY.md)**

| What | Where |
|------|--------|
| GitHub | `Az1341/goalcurrent.live` |
| Production branch | `main` |
| Vercel project | `goalcurrent.live` |
| Domain | `goalcurrent.live` |

Push to `main` → Vercel auto-deploys. Set `API_FOOTBALL_KEY`, `YOUTUBE_API_KEY`, `FOOTBALL_DATA_KEY`, and `CRON_SECRET` in the **`goalcurrent.live`** Vercel project (Production + Preview).

**Do not** commit `.env.local` or real API keys.

# GoalCurrent.live

Next.js app for **https://www.goalcurrent.live** — FIFA World Cup 2026 fixtures, live centre, standings, and match detail.

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
- Vercel environment setup
- API smoke tests

## Build

```bash
npm run build
npm start
```

Prebuild syncs WC26 flag SVGs (`scripts/sync-wc26-flags.mjs`).

## Deploy

**Canonical setup:** see **[docs/DEPLOY.md](docs/DEPLOY.md)**.

- **Repo:** `Az1341/goalcurrent-live-nextjs`
- **Branch:** `main` → auto-deploys **www.goalcurrent.live**
- **Vercel project:** `goalcurrent-live-nextjs` only

Set `API_FOOTBALL_KEY` in Vercel Production and Preview before expecting live scores.

**Do not** commit `.env.local` or real API keys.

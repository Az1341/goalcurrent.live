# GoalCurrent.online

Next.js app for **GoalCurrent.online** — FIFA World Cup 2026 fixtures, live centre, standings, and match detail.

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

Deploy via Vercel. Set `API_FOOTBALL_KEY` in Production and Preview before expecting live scores.

**Do not** commit `.env.local` or real API keys.

## Related repos

- **GoalCurrent.live** (`ashna4all`) — separate codebase; not modified from this repo.

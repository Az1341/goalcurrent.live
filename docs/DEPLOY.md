# GoalCurrent.live — deployment (single source of truth)

Use this doc only. Ignore older notes about `goalcurrent-live-nextjs-v2`, duplicate repos, or `live-promotion-prep` as production.

## Canonical setup

| Item | Value |
|------|--------|
| **GitHub repo** | https://github.com/Az1341/goalcurrent-live-nextjs |
| **Production branch** | `main` |
| **Vercel project** | `goalcurrent-live-nextjs` |
| **Production URL** | https://www.goalcurrent.live |
| **Local folder** | This repo (`goalcurrent-live-nextjs`) |

## Workflow

1. Work on a feature branch from `main`, or commit directly to `main` when approved.
2. `git push origin main`
3. Vercel builds and deploys **production** automatically (no manual promote, no second repo).

Preview deployments are created for other branches and pull requests.

## Do not use

- **`AZafarani/goalcurrent-live-nextjs-v2`** — not connected to production; causes confusion.
- **Vercel project `goalcurrent.live`** — legacy duplicate; disconnected from Git. Do not reconnect.
- **`live-promotion-prep`** — merged into `main`; do not treat as production anymore.

## Emergency CLI deploy

Only if Git deploy is broken:

```bash
npx vercel deploy --prod --yes
```

Requires Vercel CLI login and `.vercel/project.json` linked to `goalcurrent-live-nextjs`.

## Environment

Set `API_FOOTBALL_KEY` in Vercel → Project → Settings → Environment Variables (Production + Preview). See [ENVIRONMENT.md](./ENVIRONMENT.md).

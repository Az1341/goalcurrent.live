# GoalCurrent.live — deployment

**Plan #003 — 26 June 2026** · Single repo · Single Vercel project · Single domain.

## Canonical setup

| Item | Value |
|------|--------|
| **GitHub repo** | https://github.com/Az1341/goalcurrent.live |
| **Production branch** | `main` |
| **Vercel project** | `goalcurrent.live` |
| **Production URL** | https://goalcurrent.live |
| **Local folder** | `goalcurrent.live` |

Update local remote after cloning or renaming:

```bash
git remote set-url origin https://github.com/Az1341/goalcurrent.live.git
```

## Rules

- **Only `main` deploys to production.**
- **Only this repo** (`goalcurrent.live`) is the live codebase.
- **Only the Vercel project `goalcurrent.live`** serves https://goalcurrent.live.
- **Only that project** runs the daily content cron.

## Workflow

1. Branch from `main`, or commit directly to `main` when approved.
2. `git push origin main`
3. Vercel project **`goalcurrent.live`** builds and deploys production automatically.

Other branches and pull requests get Preview deployments only.

## Vercel configuration

| Setting | Value |
|---------|--------|
| Git repository | `goalcurrent.live` |
| Production branch | `main` |
| Production domain | `goalcurrent.live` |

### Environment variables (Production + Preview)

Set these on the **`goalcurrent.live`** Vercel project:

| Variable | Purpose |
|----------|---------|
| `API_FOOTBALL_KEY` | Live scores, lineups, statistics |
| `YOUTUBE_API_KEY` | Video hub ingestion |
| `FOOTBALL_DATA_KEY` | Secondary football data |
| `CRON_SECRET` | Authorizes `/api/cron/refresh-content` |

Redeploy after adding or changing variables.

### Cron

`vercel.json` registers:

- **Path:** `/api/cron/refresh-content`
- **Schedule:** `0 6 * * *` (06:00 UTC daily)
- **Auth:** `Authorization: Bearer <CRON_SECRET>`

## Content cache warm

PowerShell:

```powershell
Invoke-RestMethod -Uri "https://goalcurrent.live/api/cron/refresh-content" `
  -Headers @{ Authorization = "Bearer YOUR_CRON_SECRET" }
```

Healthy response includes `debug.youtubeKeyPresent: true` and `sources.videos` containing `"YouTube"`.

## Emergency CLI deploy

Only if Git deploy is broken:

```bash
npx vercel deploy --prod --yes
```

Requires Vercel CLI login and `.vercel/project.json` linked to **`goalcurrent.live`**.

## Related

- [ENVIRONMENT.md](./ENVIRONMENT.md) — local `.env.local` and API smoke tests

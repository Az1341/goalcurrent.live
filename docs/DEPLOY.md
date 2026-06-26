# GoalCurrent.live — deployment

**Plan #007 — 26 June 2026** · Post-rename remote sync.

## Post-rename sync (GitHub UI rename done)

```bash
git remote set-url origin https://github.com/Az1341/goalcurrent.live.git
git remote -v
git push origin main
```

GitHub redirects `goalcurrent-live-nextjs` → `goalcurrent.live` automatically after rename.

## Pre-flight checklist

- [x] Docs/config use `goalcurrent.live` only (no legacy repo names)
- [ ] GitHub repo renamed to `goalcurrent.live` in UI
- [ ] `git remote set-url origin https://github.com/Az1341/goalcurrent.live.git`
- [ ] `git push origin main` succeeds
- [ ] Vercel project `goalcurrent.live` linked to repo `goalcurrent.live`
- [ ] Production branch = `main`

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
git remote -v   # confirm fetch/push point at goalcurrent.live
```

## Vercel reconnect (after GitHub rename)

1. Vercel → project **`goalcurrent.live`** → **Settings → Git**
2. Connect repository **`goalcurrent.live`** (GitHub redirects the old name automatically)
3. Set **Production Branch** to **`main`**
4. **Settings → Domains** → `goalcurrent.live`
5. **Settings → Environment Variables** → confirm keys on this project only
6. Redeploy from `main` and warm cron (see below)

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

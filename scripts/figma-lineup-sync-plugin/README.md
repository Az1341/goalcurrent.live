# GoalCurrent Figma Lineup Sync

Sync World Cup final lineups from API-Football into the Figma broadcast board at
[vV10C5mvxJ2wlb27PyxEt3](https://www.figma.com/design/vV10C5mvxJ2wlb27PyxEt3).

## How it works

| Step | Tool | Role |
|------|------|------|
| 1 | **API-Football** | Fetch `/fixtures/lineups` when announced |
| 2 | **Figma REST API** | Read file tree, map layer names → node ids |
| 3 | **Figma Plugin** | Apply text updates (`node.characters`) |

Figma REST API is **read-only for text layers**. The companion plugin performs writes.

## Setup

1. Add env vars (see `.env.example`):

   ```bash
   FIGMA_TOKEN=your_figma_pat
   API_FOOTBALL_KEY=your_api_sports_key
   FIGMA_FILE_KEY=vV10C5mvxJ2wlb27PyxEt3   # optional
   API_FOOTBALL_FIXTURE_ID=1234567          # optional override
   ```

2. Import the plugin once in Figma:
   **Plugins → Development → Import plugin from manifest…**
   → `scripts/figma-lineup-sync-plugin/manifest.json`

## Match-day commands

```bash
# Validate layers + export payload (no plugin server)
npm run sync:figma-lineups -- --dry-run

# Single fetch when lineups are already out
npm run sync:figma-lineups -- --once

# Poll until lineups drop, serve plugin bridge (recommended)
npm run sync:figma-lineups -- --poll --serve
```

Then in Figma: **Plugins → Development → GoalCurrent Lineup Sync → Sync from localhost**

## Layer naming (your Figma file)

**Pitch starters** — frame `pitch/arg-gk`, child text `arg-gk-name`, `arg-gk-number`:

- Argentina: `arg-gk`, `arg-def-1…4`, `arg-mid-1…3`, `arg-fwd-1…3`
- Spain: `esp-gk`, `esp-def-1…4`, `esp-mid-1…2`, `esp-att-1…3`, `esp-fwd-1`

**Subs (desktop):** `subs/arg-sub-1-name` … `subs/arg-sub-7-name` (same for `esp-`)

**Subs (mobile):** `subs/arg-subs-list`, `subs/esp-subs-list` (multiline)

**Match info:** `header/match-kickoff`, `header/match-venue`

The script maps API-Football grid positions (`row:col`) and `pos` (G/D/M/F) onto these slots.

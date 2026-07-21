# GC-WC26-LIVE-RETIREMENT-001 — Live World Cup Behaviour Retirement

**UK date/time:** 2026-07-21 14:10 BST  
**Branch:** feature/wc26-archive-private-preview only

## Summary

With the tournament complete (verified final in curated SSOT), WC26-specific live polling and sync are disabled in archive mode while general football infrastructure (/live, Premier League APIs, shared SWR helpers) remains.

## Changes

| Area | Change |
|------|--------|
| Wc26ResultsSync | No network when isWc26TournamentComplete() |
| useLiveScores(enabled) | Optional disable |
| BracketLivePolling | archiveMode skips polls (Task 06) |
| BracketPageClient | No lineup bar in archive |
| MatchDetailContent | No countdown/live card in archive |
| Homepage WC hero | Empty when archive complete |
| Nav prominence | Demoted (Task 08) |

## Endpoints retained temporarily

/api/wc26/fixtures, scores, match/[id], top-scorers, knockout-fixtures — retained for pages that still need them until curated-only reads are verified. Archive UI must not poll scores when gated.

## Not removed

Historical data under src/data/wc26*; shared /live; general cron refresh-content.

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
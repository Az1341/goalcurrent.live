# GC-WC26-HISTORICAL-TEST-DATA-001 — WC26 Historical Fixtures for Future SEPANAI Pilot

**UK date/time:** 2026-07-21 14:20 BST  
**Status:** Documentation + deterministic offline fixtures only  
**Prohibition:** No AI provider calls, no Supabase Auth, no SEPANAI generation, no paid services in Batch 004.

## Why historical matches are safer

Completed matches have fixed scores and pairings. Private tests can validate explanation pipelines against known outcomes without live odds drift or unfinished fixtures.

## Suitable matches (verified in repository SSOT)

| Match | fixtureId | Result (SSOT) | Why suitable |
|-------|-----------|---------------|--------------|
| Final M104 | fixture-104 | ESP 1–0 ARG AET; winner esp | Champion narrative; lineups file exists |
| Third place M103 | fixture-103 | FRA 4–6 ENG; winner eng | High-event scoreline for structure tests |

Source: `src/data/wc26-confirmed-results.json`. Lineups reference: `src/data/wc26/final-lineups-esp-arg.ts` (final only).

## Required match facts for pilot fixtures

- fixtureId, matchNumber, stage, home/away team ids
- Final scores + matchStatus (ft/aet/pen) + penalties when present
- winnerTeamId from SSOT
- Evidence provenance path
- Optional events/statistics only when present in repo (omit if absent — do not invent)

## Deterministic offline pack

`tests/fixtures/wc26/sepanai-historical-matches.json`

Loads without network. Schema version 1.

## Expected explanation scenarios (future — not executed now)

1. Final winner confirmation with AET note  
2. Third-place high-scoring recap structure  
3. Evidence-gated refusal when match not in pack  

## Validation rules

- Scores must match SSOT exactly  
- No fabricated tactics  
- No personal user data  
- No public AI generation during this batch  

## Data limitations

- Events/statistics arrays may be empty in the offline pack  
- Awards beyond winner/runner-up are NOT VERIFIED in this pack  
- Live API payloads are out of scope for these fixtures  

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
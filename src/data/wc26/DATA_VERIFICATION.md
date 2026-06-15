# WC26 Official Data Verification Plan

**GoalCurrent.online — Phase 6**

This document defines how official FIFA World Cup 2026 data will be verified **before** it replaces placeholder content in `src/data/wc26/`. No real data may be committed until every item in the [Acceptance checklist](#10-acceptance-checklist-before-any-real-data-is-committed) is satisfied.

**Scope:** static typed data in `src/data/wc26/` and related types in `src/types/`.  
**Out of scope for this phase:** APIs, live scores, match results, standings calculation, deployment, and any connection to `goalcurrent.live`.

---

## Ground rules (non-negotiable)

| Rule | Requirement |
|------|-------------|
| Fixture source | Official fixture data must **not** be guessed, inferred, or copied from unofficial schedules |
| Match filter | **No friendly matches.** **No non-WC matches.** Only FIFA World Cup 2026 tournament fixtures (104 matches) |
| Scores | **No hardcoded scores** in teams, groups, fixtures, or standings data files |
| Standings | **No standings entered manually.** All standings displayed later must be **calculated** from verified fixtures/results |
| Kickoff storage | **All kickoff times stored in UTC** (`kickoffUtc` as ISO 8601 in `Fixture`) |
| Kickoff display | Pages derive **visitor-local time** at render time (UK local time is one derived view, not a stored field) |

---

## 1. Official source priority

Use sources in this order. If two sources conflict, stop and resolve before committing — do not pick arbitrarily.

| Priority | Source | Use for |
|----------|--------|---------|
| **1 (primary)** | [FIFA World Cup 2026 — official competition pages](https://www.fifa.com) | Final draw, group composition, official match schedule, venues, team list |
| **2 (secondary)** | FIFA published draw documents / official PDFs / official press releases linked from FIFA | Cross-check draw pots, group assignments, knockout structure |
| **3 (tertiary)** | Host organising committee official sites (USA · Mexico · Canada) | Venue names, cities, stadium capacity — only when aligned with FIFA |
| **4 (validation only)** | Reputable broadcasters with official FIFA accreditation (e.g. BBC Sport WC hub) | Spot-check kickoff dates and pairing — **never** as sole source for fixtures |
| **Rejected** | Wikipedia alone, fan wikis, API-football / third-party schedules without FIFA cross-check, archived friendly or qualifier fixtures, `goalcurrent.live` or any live site data | Must not be used to populate static official data |

**Documentation requirement:** For each data import batch, record the source URL, document title, and retrieval date in the commit message or a short `CHANGELOG` entry under `src/data/wc26/`.

---

## 2. How teams will be verified

**Target file:** `src/data/wc26/teams.ts`  
**Target type:** `Team` in `src/types/team.ts`

### Checks

1. **Count:** Exactly **48** teams in `WC26_TEAMS`.
2. **Identity:** Each team has a stable `id` (lowercase slug, e.g. `mex`, `eng`), official `name` as published by FIFA, and FIFA `code` (three letters, uppercase).
3. **Group assignment:** Each team's `groupId` matches the official draw — verified against source priority 1 or 2.
4. **Uniqueness:** No duplicate `id`, `code`, or `name`.
5. **Referential integrity:** Every `teamId` referenced in `groups.ts` and `fixtures.ts` exists in `teams.ts`.
6. **No extras:** No placeholder names (e.g. "Group A Placeholder 1") remain in production data.
7. **No results:** Team records contain **no** scores, points, or form strings.

### Verification steps

- [ ] Export official 48-nation list from FIFA source
- [ ] Compare name + code field-by-field against `WC26_TEAMS`
- [ ] Run `getTeamById` for every `teamId` in groups and fixtures — all must resolve
- [ ] Confirm `WC26_TEAM_COUNT === 48` and array length matches

---

## 3. How groups A–L will be verified

**Target file:** `src/data/wc26/groups.ts`  
**Target type:** `Group` in `src/types/group.ts`

### Checks

1. **Count:** Exactly **12** groups (`a` through `l`), matching `WC26_GROUP_IDS`.
2. **Size:** Each group has exactly **4** `teamIds` (`TEAMS_PER_GROUP === 4`).
3. **Draw accuracy:** Team membership per group matches the official FIFA draw — no team in two groups.
4. **Coverage:** Union of all group `teamIds` equals the full set of 48 teams — no omissions or duplicates.
5. **Labels:** `label` is `Group A` … `Group L` via `groupLabel(id)`.
6. **No standings:** Group files contain membership only — no points, ranks, or manual table rows.

### Verification steps

- [ ] Build a 12×4 matrix from FIFA draw and compare to `WC26_GROUPS`
- [ ] Assert `WC26_GROUP_COUNT === 12`
- [ ] Assert every team appears exactly once across all groups
- [ ] Spot-check Groups A, F, and L (first, middle, last) against primary source

---

## 4. How venues will be verified

**Target file:** `src/data/wc26/venues.ts`  
**Target type:** `Venue` in `src/types/venue.ts`

### Checks

1. **Count:** Exactly **16** venues (`WC26_VENUE_COUNT === 16`).
2. **Host nations:** Each venue `country` is `USA`, `Mexico`, or `Canada` only.
3. **Official names:** Stadium `name` and `city` match FIFA / host committee naming (not informal nicknames unless FIFA uses them).
4. **Capacity:** If `capacity` is set, it matches official stadium spec — omit rather than guess if uncertain.
5. **Referential integrity:** Every `venueId` in fixtures exists in `WC26_VENUES`.
6. **IDs:** Stable slugs (e.g. `venue-miami`) — do not change after first official commit without migration note.

### Verification steps

- [ ] Compare venue list to FIFA official host city / stadium list
- [ ] Confirm 16 distinct `id` values
- [ ] Cross-check each fixture's `venueId` resolves via `getVenueById`

---

## 5. How fixtures will be verified

**Target file:** `src/data/wc26/fixtures.ts`  
**Target type:** `Fixture` in `src/types/fixture.ts`

### Checks

1. **Count:** Exactly **104** tournament fixtures when the full slate is loaded (`WC26_TOURNAMENT.fixtureCount`).
2. **Official schedule only:** Every row traceable to FIFA published schedule — **never guessed**.
3. **Stage values:** `stage` is one of the defined `FixtureStage` values; group fixtures include `groupId` and `matchday` (1–3); knockout fixtures have no `groupId`.
4. **Participants:** `homeTeamId` and `awayTeamId` refer to valid teams; for group stage, both teams belong to the stated `groupId`.
5. **Venue:** `venueId` is valid and plausible for the host city assigned by FIFA.
6. **Status:** Pre-tournament data uses `scheduled` (or `postponed` / `cancelled` only if officially announced).
7. **No scores:** Fixtures must **not** include `homeScore`, `awayScore`, `status: 'FT'`, or any result field.
8. **No friendlies / non-WC:** Reject any match not part of the 2026 World Cup tournament.
9. **Uniqueness:** Stable `id` per fixture; no duplicate home/away/kickoff triplets unless officially a rematch (knockout only).
10. **Matchday logic:** Group stage: 24 matches per matchday × 3 matchdays = 72; knockout stages account for remaining 32.

### Verification steps

- [ ] Obtain official 104-match schedule from priority-1 source
- [ ] Compare count, dates, pairings, and venues field-by-field
- [ ] Validate all `teamId` and `venueId` references
- [ ] Confirm no placeholder synthetic fixtures (e.g. `buildGroupOpeners` output) remain
- [ ] Group-stage sanity: each team plays exactly 3 group matches (verify programmatically before commit)

---

## 6. How UTC kickoff times will be checked

**Storage field:** `Fixture.kickoffUtc` — ISO 8601 with `Z` suffix or explicit UTC offset.

### Checks

1. **Format:** Valid ISO 8601 parseable by `new Date(kickoffUtc)` without NaN.
2. **Timezone:** Stored instant is the **official FIFA kickoff in UTC** — not local stadium time stored incorrectly.
3. **Tournament window:** All kickoffs fall between `WC26_TOURNAMENT.startUtc` and `WC26_TOURNAMENT.endUtc` (adjust bounds if FIFA publishes exact window).
4. **No local storage:** Do **not** add parallel fields like `kickoffUk`, `kickoffEst`, or `kickoffLocal` to data files.
5. **Consistency:** Same match re-verified from two official documents must yield the same UTC instant.

### Verification steps

- [ ] For a sample of 10 fixtures across time zones (US East, US West, Mexico, Canada), convert official published local kickoff to UTC and compare to `kickoffUtc`
- [ ] Run a script (local only, not committed as API) that validates ISO format for all 104 fixtures
- [ ] Document any DST edge cases (June–July 2026) explicitly in commit notes

**Current helper (display UTC only):** `formatKickoffUtc` in `src/lib/wc26-format.ts` — official data phase may add a separate UK formatter; storage remains UTC.

---

## 7. How UK local time will be derived

UK time is **never stored** in data files. It is derived at display time from `kickoffUtc`.

### Rules

1. **Source of truth:** `kickoffUtc` only.
2. **Derivation:** Use `Intl.DateTimeFormat` (or equivalent) with `timeZone: 'Europe/London'` for UK local display.
3. **BST vs GMT:** June–July 2026 is **British Summer Time (UTC+1)** — formatter must use IANA zone `Europe/London`, not a fixed `+1` offset.
4. **Labelling:** UI must label derived time clearly (e.g. "BST" or "UK time") so it is not confused with UTC or US local.
5. **Visitor-local (future):** Browser `Intl` with user locale/timezone for "visitor-local time later" — separate from UK view; still derived from UTC, not stored.

### Verification steps

- [ ] Pick 5 fixtures; manually verify UK time using [time.gov.uk](https://www.time.gov.uk) or equivalent against formatter output
- [ ] Include one late-evening US West Coast kickoff to confirm correct UK next-day rollover
- [ ] Confirm no `kickoffUk` field exists in types or data

---

## 8. How data errors will be prevented

### TypeScript & structure

- All data conforms to strict types in `src/types/` — no `any`, no optional score fields on fixtures.
- `readonly` arrays and `satisfies` where appropriate when building fixtures.
- Single import surface: `src/data/wc26/index.ts`.

### Pre-commit checks (run locally before merge)

| Check | Method |
|-------|--------|
| Build passes | `npm.cmd run build` |
| Referential integrity | Every `teamId` / `venueId` in groups + fixtures resolves |
| Counts | 48 teams, 12 groups, 16 venues, 104 fixtures |
| No scores in data | Grep `src/data/wc26/` for forbidden patterns: `score`, `goals`, `FT`, `homeScore`, `awayScore`, `points:` (except type definitions and zero templates) |
| No placeholders | Grep for `Placeholder`, `TBD`, `buildGroupOpeners` in production data files |
| UTC only | Grep for forbidden local time fields in data/types |
| Standings | `WC26_PLACEHOLDER_STANDINGS` rows remain zero until calculation phase — no manual point injection |

### Process

1. **Two-person rule (recommended):** One person imports from FIFA source; another independently verifies the same fields.
2. **Small commits:** Separate commits for teams/groups, venues, fixtures — easier to revert.
3. **No drive-by edits:** Official data commits touch only `src/data/wc26/` and types if required — no page logic mixed in.
4. **Changelog:** Note source URL and verification date per batch.

---

## 9. How future API data will be compared against static official data

When APIs are added in a **later phase** (not Phase 6), live/API data must not overwrite static official metadata without validation.

### Comparison strategy

1. **Static baseline:** Committed `src/data/wc26/` is the **canonical schedule** for fixture identity (id, teams, venue, official UTC kickoff).
2. **API role (future):** APIs may supply **live status and results only** — not re-define the official draw or schedule unless FIFA publishes a change.
3. **Field mapping:** Document API field → `Fixture` / result overlay mapping in a future `API_INTEGRATION.md` — not in this phase.
4. **Diff checks (future):** On API load, compare:
   - `homeTeamId` / `awayTeamId` vs API team ids
   - `kickoffUtc` vs API timestamp (allow small tolerance only if API documents UTC; flag drift > 60 minutes)
   - `venueId` vs API venue
5. **Mismatch handling:** Log and surface "schedule drift" in dev; do **not** silently replace static official data. Schedule changes require a deliberate data commit from FIFA sources.
6. **Independence:** `goalcurrent.live` API responses must **never** be used to validate or populate `goalcurrent.online` static data.

### Results overlay (future)

- Match results attach to `fixture.id` — never create parallel fixture rows from API.
- Standings computed from results + verified group fixtures — never merged from API snapshot tables.

---

## 10. Acceptance checklist before any real data is committed

Complete **all** items before replacing placeholder data in `src/data/wc26/`.

### Source & scope

- [ ] Primary FIFA source identified, URL recorded, retrieval date noted
- [ ] No fixture, team, or venue data was guessed
- [ ] No friendly or non-WC matches included
- [ ] No data copied from `goalcurrent.live` or any third-party API as primary source

### Teams (`teams.ts`)

- [ ] 48 teams with official names and FIFA codes
- [ ] Each team assigned to correct group per official draw
- [ ] No placeholder team names remain
- [ ] No scores or form data in team records

### Groups (`groups.ts`)

- [ ] 12 groups (A–L), 4 teams each
- [ ] Every team appears exactly once
- [ ] Draw matches FIFA official draw document

### Venues (`venues.ts`)

- [ ] 16 official host stadiums
- [ ] Names, cities, and countries verified
- [ ] All fixture `venueId` references resolve

### Fixtures (`fixtures.ts`)

- [ ] 104 official tournament fixtures
- [ ] All `kickoffUtc` values verified against FIFA schedule in UTC
- [ ] Group stage: correct `groupId`, `matchday`, and pairings
- [ ] Knockout stage: correct `stage` and pairings (no groupId)
- [ ] No scores, results, or finished statuses
- [ ] Placeholder generator (`buildGroupOpeners`) removed or replaced with official static array

### Standings

- [ ] No manual standings rows with non-zero values committed
- [ ] `WC26_PLACEHOLDER_STANDINGS` remains zero until calculation phase is implemented
- [ ] Team understands: **standings = calculated from fixtures/results later**

### Time

- [ ] All kickoffs stored as UTC ISO 8601 only
- [ ] UK local time derivation tested with `Europe/London` (BST)
- [ ] No local kickoff fields added to data layer

### Technical

- [ ] `npm.cmd run build` passes with zero TypeScript errors
- [ ] Referential integrity script/check passes (all ids resolve)
- [ ] Grep guardrails pass (no scores, no placeholders in production data)
- [ ] Pages still import from `src/data/wc26/index.ts` only

### Sign-off

- [ ] Verifier name / date recorded
- [ ] Commit message references FIFA source and verification checklist completion

---

## File map (reference)

| Concern | Types | Data | Display (later) |
|---------|-------|------|-----------------|
| Teams | `src/types/team.ts` | `src/data/wc26/teams.ts` | Teams page, group pages |
| Groups | `src/types/group.ts` | `src/data/wc26/groups.ts` | Groups hub, group pages |
| Venues | `src/types/venue.ts` | `src/data/wc26/venues.ts` | Venues page, fixtures list |
| Fixtures | `src/types/fixture.ts` | `src/data/wc26/fixtures.ts` | Fixtures page, group pages |
| Standings | `src/types/standing.ts` | computed later — not manual | Standings page |
| Import surface | — | `src/data/wc26/index.ts` | all WC26 pages |

---

*Document version: Phase 6 — verification plan only. No official data committed under this phase.*

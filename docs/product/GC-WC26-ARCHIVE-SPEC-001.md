# GC-WC26-ARCHIVE-SPEC-001 — World Cup 2026 Permanent Archive Architecture

**UK date/time:** 2026-07-20 22:20 BST  
**Mandatory label:** World Cup 2026 Archive  
**Status:** SPEC — implementation follows on this branch under private-preview rules

## Product decision

The tournament is finished. GoalCurrent must not present World Cup 2026 as a current live competition. The site consolidates coverage into a permanent historical archive while preserving valuable URLs and verified match data for future SEPANAI private testing (no AI activation in Batch 004).

## Archive hub

**Canonical hub URL:** `/worldcup2026` (locale-prefixed via existing `/[locale]` routing)

**H1 / primary label:** World Cup 2026 Archive

### Required sections on the hub

1. Tournament summary  
2. Champion and final  
3. Final bracket (link)  
4. Final standings (link)  
5. Match results (link)  
6. Top scorers and awards (link; omit unverified awards)  
7. Important statistics (link / summary from verified repo stats only)  
8. Key moments (curated links to retained articles/matches; no invented narrative)  
9. GoalCurrent tournament articles  
10. Selected match reports  
11. Tournament timeline (high-level dates from `WC26_TOURNAMENT` only)  
12. Historical-data notice  

### Mandatory chrome

- Archive badge/label: **World Cup 2026 Archive**
- Archived-data timestamp (ISO date of curated SSOT / page build note)
- Historical-data notice: content is historical; not live coverage
- Breadcrumbs: Home → World Cup 2026 Archive → (section)
- Link back to hub from all archive section pages

## Page hierarchy

`
/worldcup2026                          Archive hub (CONVERT)
├── /bracket                           Final bracket
├── /standings                         Final group / tournament standings presentation
├── /fixtures                          Results & full schedule (archive framing)
├── /match/[fixtureId]                 Historical match centre (KEEP URL)
├── /groups                            Groups index (final)
├── /groups/[group]                    Group detail (final)
├── /teams · /teams/[teamId]           Teams (KEEP)
├── /venues                            Venues (KEEP)
├── /players                           Scorers / players (archive)
└── /news/...                          Retained WC editorial under hub where already present
`

Articles under `/articles/*` remain at existing URLs and are linked from the hub.

## URL retention plan

| Class | Plan |
|-------|------|
| Hub and primary sections | Retain paths; convert content |
| Match centres | Retain `/worldcup2026/match/[fixtureId]` |
| Unique articles | Retain |
| Duplicate/obsolete hubs | Map in Task 07 only with evidence |
| Never | Blind redirect-all to homepage |

## Canonical URLs

- Hub canonical: locale-aware absolute `/worldcup2026`
- Section pages: self-canonical to their archive URLs
- Articles: existing article canonicals unchanged unless Task 07 evidence requires consolidation

## Breadcrumbs

`Home > World Cup 2026 Archive > {Section}`

Use existing `Wc26Breadcrumb` with updated labels.

## Internal linking

- Hub links to bracket, standings, fixtures/results, players/scorers, teams, venues, selected articles
- Section pages link back to hub
- Match pages link to hub + related article when evidenced
- Homepage may show **one** historical archive card — not a live hero

## Mobile layout

- Max content width 1320px; no sidebar
- Primary colour burgundy `#7B0D1E`
- Stack: label → H1 → summary → champion/final → section cards → articles → notice
- Flags retained on team/match rows
- Touch targets and focus states preserved

## Empty / error states

- Missing verified fact: omit or show “Unavailable in archive data” — never invent
- Unknown fixtureId: existing not-found behaviour
- Provider outage: serve curated SSOT; do not imply live failure of an ongoing tournament

## Archive labelling and tense

- Past tense in titles/descriptions (“completed”, “final result”, “archive”)
- No countdowns, “today’s matches”, “upcoming”, or live tournament alerts on archive surfaces
- JSON-LD must not claim an ongoing live sports event series as current

## Accessibility

- One H1 per page; logical heading order
- Landmarks via `main`
- Keyboard operable cards/links; visible focus
- Screen-reader text for scores and penalties
- Respect reduced-motion for any remaining animation

## Metadata

- Title pattern: `World Cup 2026 Archive | {Section} | GoalCurrent`
- Descriptions in past tense
- Open Graph mirrors archive framing

## Structured data

- Prefer historical `SportsEvent` / completed event framing where used
- Do not emit live `EventScheduled` status for finished matches when status helpers exist (`sports-event-status`)

## Localisation

- All `messages/*.json` `wc26` / nav strings updated for archive labels
- `npm run i18n:check` must remain green
- Existing locale routing unchanged

## Archived-data timestamp

Display a visible timestamp sourced from curated data revision (e.g. confirmed-results file date or explicit constant `WC26_ARCHIVE_DATA_AS_OF`). Document the constant in code comments. Do not pretend real-time sync.

## Champion / final (repository evidence only)

From `src/data/wc26-confirmed-results.json` knockout result match 104:

- Spain (`esp`) defeated Argentina (`arg`)
- Score 1–0 after extra time (`matchStatus`: `aet`)

Do not invent Golden Ball or other awards without verified repository fields.

## Out of scope for this spec

- SEPANAI generation, Supabase Auth, paid APIs
- Wholesale deletion of WC26 data
- Merging to `main` or public deploy

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
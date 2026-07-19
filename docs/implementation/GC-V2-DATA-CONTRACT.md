# GC-V2 Data Contract

**Document:** GC-V2-DATA-CONTRACT  
**Branch:** `goalcurrent-v2-rebuild`  
**Migration:** `20260719180000_gc_v2_initial.sql`

Field-level contracts for GoalCurrent v2 intelligence data. The existing WC26 SSOT (`src/data/wc26/*`, `fixture-NNN` slugs) remains for live pages until ingestion is proven; Supabase stores the canonical API-Football identity.

---

## 1. Canonical fixture identity

| Field | Type | Rule |
|-------|------|------|
| `matches.id` | `integer` PK | API-Football `fixture.id` — **canonical** |
| `matches.local_fixture_id` | `text` unique nullable | Bridge to existing slugs, e.g. `fixture-104` |
| `matches.home_team_id` / `away_team_id` | `integer` FK → `teams.id` | Never infer from names or array order |
| `matches.competition_id` | `integer` FK → `competitions.id` | API league id |

**Invariant:** Every brief, event, statistic, lineup row, and feedback record resolves to the same `matches.id`. URL routes may display `local_fixture_id` but must resolve to the API integer before any write.

**Bridge rule:** Populate `local_fixture_id` explicitly from `src/lib/wc26-fixture-match.ts` / overlay logic — never derive from kickoff date or fixture list index.

---

## 2. Match status and scores

### Raw provider fields (always stored)

- `api_status_short` — e.g. `1H`, `2H`, `FT`, `AET`, `PEN`, `PST`
- `api_status_long` — provider long label
- `elapsed_minute`, `extra_minute`

### Normalised enum `match_status`

`unknown` | `not_started` | `in_play` | `paused` | `finished` | `extra_time` | `penalties` | `postponed` | `cancelled` | `suspended` | `interrupted` | `abandoned` | `awarded` | `walkover`

**Rules:**

1. Unknown API codes map to `unknown`, not `not_started`.
2. Raw short/long values are always persisted even when normalised.
3. `provider_updated_at` is set on every successful ingestion upsert.

### Score columns (all nullable until known)

| Column | Meaning |
|--------|---------|
| `home_score` / `away_score` | Current displayed score |
| `halftime_*` | Half-time |
| `fulltime_*` | End of 90 minutes |
| `extratime_*` | After extra time |
| `penalty_*` | Shootout only |
| `winner_team_id` | API `teams.*.winner` when supplied |

Public UI must show penalties and extra time when `status` is `penalties` or `extra_time`.

---

## 3. Event fingerprint

API-Football may omit stable `api_event_id`. Identity is:

```text
event_fingerprint = SHA-256 hex of JSON tuple:
  [match_id, team_id, minute, minute_extra, event_type, detail, player_id, assist_id]
```

- Unique constraint: `(match_id, event_fingerprint)`
- Ingestion upserts by fingerprint; events missing from latest payload are marked `is_active = false`
- Optional `provider_payload` stores raw event JSON for diagnosis

---

## 4. Brief lifecycle

| Status | Meaning | Public visible |
|--------|---------|----------------|
| `draft` | Generated or edited, not reviewed | No |
| `in_review` | Ready for editorial QA | No |
| `published` | Live on site | Yes |
| `archived` | Retired canonical URL may 404 or redirect | No |

**Transitions (server-enforced):**

- `draft` → `in_review` — editor save with all four sections present
- `in_review` → `published` — requires title, slug, match, thesis, publisher_id, `published_at`, quality validation
- `published` → `archived` — admin/editor unpublish
- `archived` → `draft` — admin reopen

Each brief has exactly one row per `section_type`: `thesis`, `evidence`, `key_moment`, `verdict`.

---

## 5. Feedback and anonymous identity

### Authenticated users

- `user_id = auth.uid()`, `anonymous_identity IS NULL`
- Partial unique index: `(section_id, user_id) WHERE user_id IS NOT NULL`

### Anonymous users

- Server API route validates published brief + section ownership
- `anonymous_identity = HMAC-SHA256(GOALCURRENT_ANON_FEEDBACK_SECRET, section_id + browser_token)`
- `browser_token` — random UUID stored in `httpOnly` cookie or returned once on first visit
- Partial unique index: `(section_id, anonymous_identity) WHERE anonymous_identity IS NOT NULL`
- Inserts use service role after HMAC verification (RLS bypass)

**Prohibited:** client-supplied `user_id`; trusting `brief_id` without verifying `section_id` belongs to that brief; exposing raw `anonymous_identity` or `browser_token` in public APIs.

---

## 6. Editorial timezone

Environment variable: `GOALCURRENT_EDITORIAL_TIMEZONE` (IANA, default `Europe/London`).

Used for:

- "Today's Explanation" featured brief selection
- Editorial calendar date boundaries
- Publication date display labels on brief cards

Do **not** use the Vercel runtime region timezone for editorial day boundaries.

---

## 7. Related types

- Supabase row types: `src/types/database.ts`
- Application DTOs: `src/types/domain.ts`
- Live overlay (legacy): `src/types/fixture-overlay.ts`

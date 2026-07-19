# GC-V2 Repository Audit

**Document:** GC-V2-REPOSITORY-AUDIT  
**Branch:** `goalcurrent-v2-rebuild`  
**Date:** 2026-07-19  
**Production domain:** https://www.goalcurrent.live

---

## 1. Framework and toolchain

| Item | Value |
|------|--------|
| Next.js | 16.2.9 (`package.json`) |
| React | 19.2.4 |
| TypeScript | ^5, `strict: true` (`tsconfig.json`) |
| Package manager | npm 11.13.0 (`package-lock.json`) |
| Node | >=20.9.0 |
| Path alias | `@/*` → `src/*` |
| i18n | `next-intl` — 9 locales, `localePrefix: "as-needed"` |
| Proxy | `src/proxy.ts` (Next.js 16 proxy, replaces middleware) |
| Deploy target | **Vercel** (`vercel.json`, `docs/DEPLOY.md`) |
| Monitoring | `@sentry/nextjs` |

**Note:** Workspace Netlify skills do not match the live deployment path; Vercel is canonical.

---

## 2. Route inventory (summary)

All user-facing pages live under `src/app/[locale]/` (~88 `page.tsx` routes).

| Area | Examples |
|------|----------|
| Home | `/` |
| Live scores | `/live` |
| Match centre | `/match/[fixtureId]` |
| World Cup hub | `/worldcup2026/*` (fixtures, bracket, standings, groups, teams, players, venues) |
| Premier League | `/premier-league/*` |
| Editorial articles | `/articles`, `/articles/[slug]` (~25 static article pages) |
| News RSS hub | `/news/*` |
| Video | `/videos/*` |
| Favourites | `/favourites/*` |
| Legal | `/privacy`, `/terms`, `/cookies`, etc. |

Legacy redirects are handled in `next.config.ts` and `src/proxy.ts` (e.g. `/worldcup2026/match/*` → `/match/*`).

---

## 3. API routes (29 handlers)

Under `src/app/api/`:

- **WC26:** `/api/wc26/scores`, `fixtures`, `match/[fixtureId]`, `knockout-fixtures`, `top-scorers`
- **Premier League:** `/api/pl/*` (fixtures, live, match, standings, teams, players, statistics, transfers, etc.)
- **Content:** `/api/news`, `/api/articles`, `/api/videos`
- **Ops:** `/api/cron/refresh-content`, `/api/sitemap`, `/api/sitemap-news`, `/api/robots`
- **Firebase:** `/api/firebase/fcm-token`
- **Debug:** `/api/debug/api-football`, `/api/debug/wc26`

No Supabase Edge Functions exist today. No `supabase/` directory.

---

## 4. Database and persistence

| Layer | Location | Role |
|-------|----------|------|
| WC26 SSOT | `src/data/wc26/*`, `wc26-confirmed-results.json` | FIFA schedule, teams, venues, confirmed knockout results |
| Editorial (code-first) | `src/data/articles.ts`, `src/data/editorial/*` | Static article index + structured editorial modules |
| Runtime overlay | `src/types/fixture-overlay.ts`, API routes | Live scores, events, lineups from API-Football |
| JSON cache | `src/utils/cache/*.json`, `store.ts` | Cron-refreshed RSS/news/video snapshots |
| Optional Redis | `@upstash/redis` | Cross-instance API rate limiting |

**Gap for v2:** Intelligence briefs, editorial theses, AI evidence, and user feedback require Postgres (Supabase) — greenfield in this repo.

---

## 5. Match data model (current)

### Canonical local fixture identity

- **Primary key:** `fixture.id` string (e.g. `fixture-104`) in `src/types/fixture.ts`
- **FIFA match number:** `matchNumber` 1–104
- **API bridge:** `apiFixtureId` on overlay entries (`src/types/fixture-overlay.ts`)

### WC26 static fixture

```typescript
interface Fixture {
  id: string;
  matchNumber: number;
  stage: FixtureStage;
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  venueId: VenueId;
  kickoffUtc: string;
  status: "scheduled" | "postponed" | "cancelled";
}
```

### Runtime overlay

- Scores, elapsed, API status, penalties via `FixtureOverlayEntry` / `Wc26ApiMatch`
- Match detail payload: `src/types/match-detail.ts` (events, lineups, statistics, player stats)

### API-Football integration

| Module | Path |
|--------|------|
| Core client | `src/lib/api-football/client.ts` |
| Errors / cache | `src/lib/api-football/errors.ts`, `cache.ts` |
| WC26 server | `src/lib/server/wc26-api-football.ts`, `wc26-match-detail.ts`, `wc26-fixtures.ts` |
| Fixture matching | `src/lib/wc26-fixture-match.ts`, `wc26-fixture-overlay.ts` |
| Status normalisation | `src/lib/wc26-match-status.ts` |
| PL layer | `src/lib/pl/*` |

Base URL: `https://v3.football.api-sports.io` (`src/lib/pl/constants.ts`).  
Env: `API_FOOTBALL_KEY` (server-only).

---

## 6. Authentication

**Current:** Firebase Web Auth (Google, Apple) — optional, client-side.

| File | Role |
|------|------|
| `src/lib/firebase/client.ts` | Sign-in, FCM |
| `src/lib/firebase/admin.ts` | Token verify, topic subscribe |
| `src/contexts/FirebaseAuthContext.tsx` | Client state |
| `src/app/api/firebase/fcm-token/route.ts` | Push registration |

**v2 requirement:** Supabase Auth with roles (`reader`, `editor`, `admin`) for editorial pipeline. Firebase can remain for FCM/push; editorial roles must not rely on client-only Firebase checks.

---

## 7. Editorial / intelligence (current)

| Present | Absent |
|---------|--------|
| Static articles (`ARTICLE_INDEX`, TSX pages) | Intelligence briefs |
| Structured editorial modules (`src/data/editorial/`) | AI generation pipeline |
| RSS ingestion + cron refresh | Supabase-backed drafts |
| SEO / sitemap for articles | Brief feedback system |
| Matchday recap template | Explanation engine |

---

## 8. Tests and scripts

| Command | Result (baseline 2026-07-19) |
|---------|------------------------------|
| `npm run test:unit` | **76/76 pass** |
| `npm run build` | **Pass** |
| `npm run lint` | **Fail** — ESLint flat config plugin collision (`jsx-a11y` redefined) |
| `npx tsc --noEmit` | **Fail** — UTF-16 corruption in `tests/e2e/articles-404-pl.spec.ts` |

Playwright E2E under `tests/e2e/`. Design verification: `npm run verify:design`.

---

## 9. Fixture identity defect class (audit focus)

Risk areas inspected:

| Risk | Current mitigation |
|------|-------------------|
| Wrong teams on wrong page | `getFixtureById(fixtureId)` SSOT; match pages keyed by URL `fixtureId` |
| API↔local mismatch | `resolveApiFixtureIdForLocal`, team-name + kickoff fallbacks in `wc26-api-fixture-id.ts` |
| Array-index joins | Lineup grid uses `grid_position`, not array index |
| Stale static results | `wc26-confirmed-results.json` + overlay merge |
| Cache key collisions | Per-fixture API cache keys in route handlers |
| Duplicate fixture stores | SSOT in `src/data/wc26/fixtures.ts`; overlay is additive |

**v2 rule:** API-Football `fixture.id` (integer) becomes canonical DB primary key for `matches`; local `fixture-NNN` slugs map via explicit bridge table or column — never inferred from date or array order.

---

## 10. Package vs repository conflicts

| Package assumption | Repository reality | v2 action |
|-------------------|-------------------|-----------|
| `app/(site)/page.tsx` | `src/app/[locale]/page.tsx` | Add brief surfaces under `src/app/[locale]/briefs/` |
| `lib/supabase-client.ts` (sync) | No Supabase | Split async clients: `src/lib/supabase/{browser,server,admin,proxy}.ts` |
| Single `schema.sql` | No DB | Versioned `supabase/migrations/*` with corrected score/status model |
| Synchronous `cookies()` | Next.js 16 async cookies | Async server Supabase client |
| Supabase-only auth | Firebase optional today | Supabase Auth for editorial; keep Firebase for push |
| `match_status` enum only | API uses short codes (1H, 2H, AET, PEN) | Store raw + normalised + `unknown` state |
| Event `api_event_id` | API may omit stable IDs | Add `event_fingerprint` hash (package correction §4.8) |
| Netlify deployment | Vercel production | Deploy Supabase Edge Functions separately; Next.js on Vercel |

---

## 11. Reusable assets

- API-Football client and WC26 matching logic (`src/lib/api-football/*`, `src/lib/server/wc26-*`)
- Match detail types (`src/types/match-detail.ts`)
- Lineup grid parsing (`src/lib/match-lineup-grid.ts`)
- i18n routing and proxy (`src/proxy.ts`, `src/i18n/*`)
- Article SEO components (patterns for brief pages)
- Playwright + unit test infrastructure
- Vercel cron for scheduled jobs (extend for brief ingestion triggers)

---

## 12. Migration risks

1. **Dual auth** during transition — editorial must enforce Supabase session server-side.
2. **Dual fixture IDs** — must bridge `fixture-104` ↔ API integer without breaking `/match/fixture-104`.
3. **Existing live site** — v2 brief routes are additive; do not remove WC26 SSOT until ingestion proven.
4. **Lint / tsc baseline defects** — fix corrupted e2e spec and ESLint config early on this branch.
5. **Secrets** — `OPENAI_API_KEY`, Supabase service role, existing `API_FOOTBALL_KEY` must stay server-only.

---

## 13. Production defects discovered (baseline)

| ID | Severity | Description |
|----|----------|-------------|
| AUD-001 | Medium | `npm run lint` broken (duplicate `jsx-a11y` plugin in ESLint flat config) |
| AUD-002 | Low | `tests/e2e/articles-404-pl.spec.ts` appears UTF-16 encoded; breaks bare `tsc` |
| AUD-003 | Info | No intelligence/brief subsystem — expected greenfield for v2 |

---

## 14. Gate A readiness

| Criterion | Status |
|-----------|--------|
| Audit completed | Yes (this document) |
| Working functionality documented | Yes (§2–7) |
| Baseline build recorded | See `GC-V2-BASELINE-BUILD.md` |
| Migration plan documented | §10–12 + build sequence in package |
| No unreviewed destructive deletion | No deletions on this branch yet |

**Gate A:** PASS (audit phase)

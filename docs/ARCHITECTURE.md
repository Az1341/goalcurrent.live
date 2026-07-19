# GoalCurrent v2 — System Architecture

## Overview

GoalCurrent v2 adds a **Contextual Explanation Engine** on top of the existing live football site at [goalcurrent.live](https://www.goalcurrent.live). The engine transforms verified match data into post-match intelligence briefs that answer *why did this happen?*

The v2 stack integrates into the **existing** Next.js 16 repository (`src/` layout), deploys on **Vercel**, persists intelligence data in **Supabase Postgres**, and reuses the proven **API-Football** client under `src/lib/api-football/`.

See [GC-V2-DATA-CONTRACT.md](./implementation/GC-V2-DATA-CONTRACT.md) for field-level contracts.

---

## Repository layout (adapted from v2 package)

| Package assumption | This repository |
|------------------|-----------------|
| `app/(site)/page.tsx` | `src/app/[locale]/page.tsx` + future `src/app/[locale]/briefs/*` |
| `lib/supabase-client.ts` | `src/lib/supabase/{browser,server,admin,proxy}.ts` (async cookies) |
| `types/*.ts` | `src/types/*.ts` with `@/*` alias |
| `supabase/schema.sql` | `supabase/migrations/*.sql` |
| Netlify deploy | **Vercel** (`vercel.json`, `docs/DEPLOY.md`) |

Existing WC26 routes (`/match/[fixtureId]`, `/live`, `/worldcup2026/*`) and API routes (`/api/wc26/*`) remain until Supabase ingestion is certified.

---

## Component diagram

```text
┌──────────────────────────────────────────────────────────────────────┐
│                     Vercel — Next.js 16 (src/app)                     │
│                                                                       │
│  ┌─────────────┐  ┌──────────────────┐  ┌─────────────────────────┐ │
│  │ Site (RSC)  │  │ Brief detail     │  │ Editorial UI            │ │
│  │ [locale]/   │  │ [locale]/briefs/ │  │ [locale]/brief-editor/  │ │
│  └──────┬──────┘  └────────┬─────────┘  └────────────┬────────────┘ │
│         │                  │                         │              │
│         └──────────────────┼─────────────────────────┘              │
│                            │                                          │
│         ┌──────────────────▼──────────────────┐                       │
│         │ src/lib/supabase/* + explanation    │                       │
│         │ src/lib/api-football/client.ts      │                       │
│         └──────────────────┬──────────────────┘                       │
└────────────────────────────┼──────────────────────────────────────────┘
                             │
┌────────────────────────────▼──────────────────────────────────────────┐
│                         Supabase (Postgres + Auth)                       │
│  competitions │ teams │ venues │ matches │ match_events               │
│  match_statistics │ match_lineups │ editorial_theses │ ai_evidence      │
│  briefs │ brief_sections │ brief_feedback │ users                       │
│                                                                          │
│  Edge Functions (Deno, separate deploy):                                 │
│    fetch-match-data  — API-Football → Postgres upsert                   │
│    generate-brief    — OpenAI structured output → draft brief           │
└───────────────┬───────────────────────────────┬─────────────────────────┘
                │                               │
                ▼                               ▼
     ┌────────────────────┐          ┌─────────────────────┐
     │ API-Football REST  │          │ OpenAI (OPENAI_MODEL)│
     │ API_FOOTBALL_KEY   │          │ JSON schema validated│
     └────────────────────┘          └─────────────────────┘
```

---

## Data flow

1. **Ingestion** — Scheduler or Vercel cron triggers `fetch-match-data` (Edge Function) with service credentials.
2. **Fetch** — Function calls API-Football (same base URL as `src/lib/pl/constants.ts`) for fixtures, events, statistics, lineups.
3. **Transform** — Map to corrected schema: canonical `matches.id`, `local_fixture_id` bridge, extended status/scores, `event_fingerprint`.
4. **Upsert** — Atomic match bundle into Supabase (transaction or RPC).
5. **Thesis** — Editor saves human thesis → `editorial_theses`.
6. **Generate** — Editor triggers `generate-brief`; Edge Function loads match + thesis, calls OpenAI, validates JSON, inserts `briefs` + `brief_sections` + `ai_evidence`.
7. **Review** — `src/app/[locale]/brief-editor/[id]` (server-auth enforced) for edit, reorder, regenerate section, publish.
8. **Publish** — `status = published`, `slug` set; public reads via RLS.
9. **Feedback** — Per-section reactions; authenticated or anonymous (HMAC identity).

---

## Contextual Explanation Engine

Domain-neutral core (future: FAMVI, SepanAI adapters):

| Layer | Location | Role |
|-------|----------|------|
| Request/response types | `src/types/domain.ts` | `ExplanationRequest`, `ExplanationResponse` |
| Validation + prompt | `src/lib/explanation-engine/*` | Zod schemas, OpenAI call |
| Football adapter | `src/lib/football-adapter/*` | Match rows → evidence items |

The engine knows theses, evidence, and section structure — not football-specific terms.

---

## Authentication

| Concern | Implementation |
|---------|----------------|
| Editorial roles | Supabase Auth + `public.users.role` (`reader` | `editor` | `admin`) |
| Server enforcement | `is_editor()`, `is_admin()` in RLS; route handlers verify session |
| Push / optional sign-in | Existing Firebase (`src/lib/firebase/*`) remains for FCM |
| Profile creation | `handle_new_user` trigger (`security definer`, fixed `search_path`) |

Never assign `editor`/`admin` from client-only code.

---

## API-Football integration (existing)

| Module | Path |
|--------|------|
| HTTP client | `src/lib/api-football/client.ts` |
| WC26 server | `src/lib/server/wc26-api-football.ts`, `wc26-match-detail.ts` |
| Fixture bridge | `src/lib/wc26-fixture-match.ts`, `wc26-api-fixture-id.ts` |
| Status normalisation | `src/lib/wc26-match-status.ts` → extended in ingestion layer |

v2 ingestion must produce identical team/score identity to live overlay routes for the same `matches.id`.

---

## Supabase tables (summary)

| Table | Purpose |
|-------|---------|
| `competitions`, `teams`, `venues` | Canonical FK targets |
| `matches` | API fixture PK + `local_fixture_id` + full scores/status |
| `match_events` | Fingerprinted events |
| `match_statistics` | Raw + normalised stats per team |
| `match_lineups` | Player id + role keyed lineups |
| `editorial_theses` | Human framing for AI |
| `ai_evidence` | Traceable evidence rows |
| `briefs`, `brief_sections` | Intelligence brief content |
| `brief_feedback` | Section-level reactions |
| `users` | Auth profile + role |

---

## Environment variables

| Variable | Scope | Purpose |
|----------|-------|---------|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Server + public | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Ingestion, anonymous feedback |
| `API_FOOTBALL_KEY` | Server only | Live + ingestion (existing) |
| `OPENAI_API_KEY`, `OPENAI_MODEL` | Server only | Brief generation |
| `GOALCURRENT_EDITORIAL_TIMEZONE` | Server | Editorial "today" boundary |
| `GOALCURRENT_ANON_FEEDBACK_SECRET` | Server only | HMAC for anonymous feedback |

See `.env.example` and `FOUNDER_ACTION_REQUIRED.md`.

---

## Deployment

- **Next.js app:** Vercel project `goalcurrent.live`, production branch `main`; v2 work on `goalcurrent-v2-rebuild`.
- **Supabase:** Migrations via `supabase/migrations/`; Edge Functions deployed with Supabase CLI separately.
- **Cron:** Extend Vercel cron (`/api/cron/*`) to trigger ingestion windows; Edge Function validates shared secret.

---

## Security highlights

- RLS on all public tables; drafts hidden from anon/authenticated readers.
- Service role never imported in client bundles.
- Edge Functions require scheduler secret or editor JWT.
- Feedback: partial unique indexes on `user_id` and `anonymous_identity`.
- AI content rendered via sanitised Markdown only (no raw `dangerouslySetInnerHTML`).

---

## Related documents

- [GC-V2-REPOSITORY-AUDIT.md](./implementation/GC-V2-REPOSITORY-AUDIT.md)
- [GC-V2-DATA-CONTRACT.md](./implementation/GC-V2-DATA-CONTRACT.md)
- [GC-V2-BASELINE-BUILD.md](./implementation/GC-V2-BASELINE-BUILD.md)
- [DEPLOY.md](./DEPLOY.md)

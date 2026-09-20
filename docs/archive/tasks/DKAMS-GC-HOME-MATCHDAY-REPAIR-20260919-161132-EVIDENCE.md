# DKAMS-GC-HOME-MATCHDAY-REPAIR-20260919-161132 ? Evidence Report

**UK date/time:** 20.09.2026 11:43:47 BST (Europe/London)
**Verdict:** BLOCKED (implementation complete for founder review; Playwright local webServer + Aikido sign-in + protected preview verification pending)
**Baseline SHA:** 09389adae99c89a0a60bd7a7a922eb81f6f7bd52
**Final head SHA:** 42336b8 (branch `fix/gc-home-matchday-repair-20260919`)
**PR:** https://github.com/Az1341/goalcurrent.live/pull/84 (draft)
**NOT MERGED AND NOT PUBLICLY DEPLOYED**

## Root causes (confirmed)
1. `orderPlForFeatured` concatenated live/today/other then globally sorted by kickoff, destroying live-first priority and allowing historical FT into featured slots.
2. Homepage subscribed only to PL and rendered promotions before today's matches.
3. `PlMatchCard` null-coalesced missing LIVE/FT scores to `0`.
4. UCL/FA Cup had no dedicated match hub routes (cards could only deep-link to PL/UNL hubs).

## Files changed
- `src/lib/home/matchday.ts` ? pure selection/normalisation/scores/routing
- `src/lib/client/useHomeMatchdayFixtures.ts` ? parent multi-comp SWR owner
- `src/app/[locale]/HomeClient.tsx` ? scoreboard above promos; countdown below
- `src/components/home/v5/HomeTodaysMatches.tsx` ? filters, groups, show-all, states
- `src/components/home/v5/HomeLiveMatchCards.tsx` ? MatchdayMatchCard + fixed scores
- `src/components/home/v5/HomeHero.tsx` ? passes matchdayCards into featured
- `src/components/home/home-v5.module.css` ? matchday UI styles
- `src/app/[locale]/champions-league/match/[fixtureId]/page.tsx` + `UclMatchClient.tsx`
- `src/app/[locale]/fa-cup/match/[fixtureId]/page.tsx` + `FacupMatchClient.tsx`
- `messages/{en,de,es,fr,it,nl}.json` ? `home.matchday.*`
- Unit/e2e/contract tests listed in commits

## Acceptance criteria
| Criterion | Evidence |
|---|---|
| Live-first priority | Unit `home-matchday-selection` ? LIVE beats earlier historical FT; historical FT excluded |
| Today identified + filters | HomeTodaysMatches All/Live/Finished/Upcoming + date/TZ label |
| Multi-comp representation | useHomeMatchdayFixtures PL/UCL/FA Cup/UNL; per-feed error isolation |
| Honest scores | formatMatchdayScore null?0; true 0-0 preserved; unit covered |
| Dedicated hubs | PL/UNL existing; UCL/FA Cup minimal pages; matchdayHubHref per card |
| Promos below scoreboard | HomeClient order + community-shield contract test updated |
| Loading/error/empty | Explicit section states; never silent null section |
| Date rollover / stale | 60s now tick; stale warning uses fetchedAt; unknown if absent |
| Shared cache / no per-card fan-out | Parent hook only; FE-010 updated; +3 competition list requests at hub poll cadence |
| Tests on reported head | Unit/i18n/design/build PASS on 42336b8; Playwright BLOCKED locally |

## Competition coverage matrix
| Comp | Live scores API | Dedicated hub | Homepage feed |
|---|---|---|---|
| Premier League | `/api/pl/fixtures` | `/premier-league/match/{id}` | Yes |
| Champions League | `/api/ucl/fixtures` | `/champions-league/match/{id}` (minimal, fixtures-backed) | Yes |
| FA Cup | `/api/facup/fixtures` | `/fa-cup/match/{id}` (minimal, fixtures-backed) | Yes |
| Nations League | `/api/unl/fixtures` | `/nations-league/match/{id}` | Yes |

UCL/FA Cup hubs are schedule/score from fixtures list ? no new events/lineups provider work (in scope residual: richer detail when product invests).

## Commands and outcomes
- `npx tsx --test tests/lib/home-matchday-selection.test.mjs` ? PASS 6/6
- Related contract tests (FE-010, subscription, favourites, community-shield) ? PASS
- `npm run i18n:check` ? PASS
- `npm run verify:design` ? PASS
- `npx tsc --noEmit` ? PASS (exit 0)
- `npm run build` ? PASS
- `npx playwright test tests/e2e/home-matchday.spec.ts` ? FAIL: Timed out waiting 180000ms from config.webServer
- Aikido scan ? BLOCKED (sign-in required)

## Request / cache comparison
- Before: 1 homepage fixtures subscription (`/api/pl/fixtures`, hub poll ~75s, visibility-aware)
- After: 4 subscriptions (`pl`, `ucl`, `facup`, `unl`) at parent; FA Cup/UNL already pause poll when no live. Expected +3 list requests per open homepage session at hub cadence when live/active ? **provider/Vercel spend measured: unknown** (not profiled against paid quota in this session). Do not claim zero cost.

## Preview / protection
- Draft PR #84 will receive Vercel preview when CI builds.
- Deployment Protection evidence: **not verified in this session**. If protection unavailable, treat as preview blocker per policy.

## Observed live vs mocked
- Audit card already observed live PL homepage behaviour on 19 Sep.
- This implementation validated with **offline unit fixtures** and production **build**. Playwright journey uses mocks but did not execute due to webServer timeout.

## Remaining risks
1. Playwright not green locally ? re-run on CI or with ready `npm run dev`.
2. UCL/FA Cup hubs lack lineups/events (explicit residual gap).
3. Extra competition list polling increases API-Football cache pressure.
4. Unrelated dirty `public/flags/4x3/*.svg` left uncommitted (not part of this change).

## Rollback
- Revert branch / close PR #84; restore main at `09389adae99c89a0a60bd7a7a922eb81f6f7bd52`.

## Archive
- Task card archived at `docs/archive/tasks/DKAMS-GC-HOME-MATCHDAY-REPAIR-20260919-161132.txt`
- This report: `docs/archive/tasks/DKAMS-GC-HOME-MATCHDAY-REPAIR-20260919-161132-EVIDENCE.md`

## Founder review checkpoint
Ready for Ahmad to review protected private preview of PR #84 / SHA `42336b8` after Playwright CI + protection evidence.
**No merge / no public deployment authorised by this card.**

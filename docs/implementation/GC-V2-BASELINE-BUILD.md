# GC-V2 Baseline Build Record

**Branch:** `goalcurrent-v2-rebuild`  
**Commit baseline:** parent of first v2 implementation commit  
**Date:** 2026-07-19  
**Environment:** Windows 11, Node v24.16.0, npm from `package-lock.json`

---

## Commands executed

```bash
npm run test:unit
npm run lint
npx tsc --noEmit
npm run build
```

---

## Results

| Check | Exit code | Outcome |
|-------|-----------|---------|
| `npm run test:unit` | 0 | **PASS** — 76 tests, 0 failures |
| `npm run build` | 0 | **PASS** — Next.js 16.2.9 production build completed |
| `npm run lint` | 1 | **FAIL** — `ConfigError: Cannot redefine plugin "jsx-a11y"` |
| `npx tsc --noEmit` | 2 | **FAIL** — invalid characters in `tests/e2e/articles-404-pl.spec.ts` (encoding) |

---

## Notes

- Production build success confirms the existing site compiles on this branch before v2 schema work.
- Lint and bare TypeScript checks need repair on `goalcurrent-v2-rebuild` (tracked as AUD-001, AUD-002 in repository audit).
- v2 milestones must keep `npm run build` green after each commit.

---

## Unit test summary (passing)

Suites include: WC26 kickoff/timezone, bracket, lineups, confirmed results, scorebat embed parsing, player stats dedupe, API sync guards, i18n URL rules, content cache fallbacks.

---

## Build artefact

Next.js build output includes static/SSG pages for all locale routes and dynamic API route handlers under `src/app/api/`. Proxy (middleware) active via `src/proxy.ts`.

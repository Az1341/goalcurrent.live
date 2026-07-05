# GC-P1-20260705-075226 — Phase 1 Safety Net Summary

**Task:** GC-P1-20260705-075226 (PLATFORM_RECOVERY_ROADMAP Phase 1)  
**Branch:** `gc-p1-safety-net`  
**Date:** 2026-07-05  
**Status:** PASSED locally

## Context notes

- `/reports/gc-arch-001/` (EXECUTIVE_SUMMARY, PLATFORM_RECOVERY_ROADMAP) was **not present** in this repo clone; Phase 1 scope was implemented from the task specification directly.
- No color/theme CSS, SSOT/data-layer, or dark-mode changes were made.

## What was added

### Playwright E2E harness
- Dev dependencies: `@playwright/test`, `@axe-core/playwright`
- `playwright.config.ts` — dedicated port **4877**, `next start` by default (set `PLAYWRIGHT_DEV=1` to use `next dev`)
- Shared helpers: `tests/e2e/helpers/test-utils.ts`
- Functional specs (`tests/e2e/`):
  - `homepage.spec.ts` — hero + main nav + logo
  - `live-journey.spec.ts` — home → `/live` → match detail
  - `standings.spec.ts` — `/worldcup2026/standings` table headers
  - `favourites.spec.ts` — featured-match favourite persists after reload
  - `locale-ar.spec.ts` — AR locale via header language menu (hover) + RTL smoke

### Accessibility gate
- `runAxeScan()` in every functional spec
- **Fails** on axe `serious` / `critical` violations
- **Warns** on `moderate` / `minor`
- **Deferred (warn-only):** `color-contrast` — pre-existing brand contrast debt; fixing requires CSS changes (out of scope for Phase 1)

### Visual regression
- `tests/e2e/visual-regression.spec.ts` — 9 baselines at **390 / 1440 / 1920 px**
- Pages: homepage, WC26 standings, match detail (`fixture-001`)
- Snapshots: `tests/e2e/visual-regression.spec.ts-snapshots/*-visual-win32.png`

### npm scripts
| Script | Purpose |
|--------|---------|
| `npm run test:unit` | i18n + content + wc26 node tests (56 tests) |
| `npm run test:e2e` | Playwright functional + axe specs |
| `npm run test:visual` | Playwright screenshot regression |
| `npm run test:visual:update` | Regenerate visual baselines |

### CI
- `.github/workflows/ci.yml` — on PR/push to `main`: lint, `tsc`, i18n check, unit tests, build, Playwright e2e + visual
- **Lint gate:** CI fails only on ESLint errors in `*.ts` / `*.tsx` files changed vs `origin/main`; full-repo `npm run lint` still runs as a non-blocking informational step. Full-repo lint cleanup (**62 pre-existing errors**) is tracked as separate follow-up work, not part of Phase 1.

### Dependency audit
- `reports/gc-p1-20260705-075226/npm-audit-findings.md`

## Local verification (2026-07-05)

> **Correction:** An earlier draft of this summary claimed `npm run test:visual` passed **9/9**. That was wrong. GC-P1V-20260705-090237 re-ran the suite and found **8/9** — only `homepage at 390px` failed (70 659 pixels different, ratio 0.04). The failure was traced to dynamic homepage content (live-score ticker, featured match, match lists, RSS news timestamps, PL API section), not a layout/CSS regression. The homepage visual spec now masks those regions and freezes motion before capture; see GC-P1F-20260705-090936 re-verification below.

| Check | Result (GC-P1V) | Result (GC-P1F fix) |
|-------|-----------------|---------------------|
| `npm run test:unit` | **56/56 pass** | *(unchanged — not re-run)* |
| `npm run test:e2e` | **5/5 pass** | *(unchanged — not re-run)* |
| `npm run test:visual` | **8/9 pass** — fail: `homepage at 390px` | **9/9 pass** (GC-P1F, two consecutive runs — see below) |
| `npx tsc --noEmit` | **clean** | *(unchanged — not re-run)* |
| `npm run build` | **pass** | *(unchanged — not re-run)* |
| `npm run lint` | **62 errors / 25 warnings (pre-existing)** — not introduced by Phase 1 files | CI gate scoped to changed files only |

### GC-P1F fix (2026-07-05) — homepage-390 visual regression

**Root cause (not a layout bug):** Diff images showed changing live-score ticker/results, featured-match kickoff state, RSS news relative timestamps (`45 mins ago`, etc.), and skeleton-vs-loaded height for dynamic `import()` sections (PL API, news feed). On 390px, a cold first navigation also captured mid-load skeletons, shifting layout below masked regions (~47k–69k diff pixels).

**Stabilization applied in `tests/e2e/visual-regression.spec.ts`:**
- `page.emulateMedia({ reducedMotion: 'reduce' })` before capture
- `networkidle` + wait until `sectionSkeleton` / `newsSkeleton` / PL loading text are gone
- **Mask** (Playwright `mask` option): featured match, live-scores ticker, Live Now / Latest Results / Upcoming Fixtures columns, WC standings preview, PL section, WC26 games-played summary, Latest News
- **Double navigation** on homepage: first visit warms client bundles/API cache, second visit is screenshotted

**Re-verification (`npm run test:visual`, two consecutive full runs):** **9/9 pass** both times.

## Commands to run everything

```bash
npm ci
npm run build
npx playwright install chromium

npm run test:unit
npm run test:e2e
npm run test:visual

npm run lint
npx tsc --noEmit
npm run i18n:check
```

Regenerate visual baselines after intentional UI changes:

```bash
npm run test:visual:update
```

Use dev server instead of production (not recommended — React dev `eval` blocked by site CSP):

```bash
set PLAYWRIGHT_DEV=1
npm run test:e2e
```

## Still manual / follow-up

- **Full RTL accessibility audit** (Arabic/Persian copy, mirrored layouts, screen-reader flow) — separate task per ACCESSIBILITY_AUDIT guidance
- **color-contrast axe violations** — enable as a hard gate after design fixes
- **Cross-OS visual baselines** — ~~current snapshots are `win32`; CI (ubuntu) may need linux baselines~~ **Resolved (GC-P1VIS):** `*-linux.png` baselines generated on Actions ubuntu-latest; `*-win32.png` retained for local Windows runs
- **Monorepo lockfile warning** — Next.js picks parent `package-lock.json`; consider `outputFileTracingRoot` / `turbopack.root` in a future infra task
- **Full-repo ESLint cleanup (62 pre-existing errors)** — tracked as separate follow-up work, not part of Phase 1; CI only gates on changed `*.ts` / `*.tsx` files
- **npm audit breaking upgrades** — see `npm-audit-findings.md`; do not run `npm audit fix --force` without approval
- **i18n parity (`wc26.bracket.lastUpdated`)** — pre-existing `main` debt (key added to `en.json` for bracket timestamp UI in `BracketPageClient.tsx` but never propagated to other locales). Fixed minimally in GC-P1I18N to unblock CI: one key added to 8 locale files. European locales (de, es, fr, it, nl, pt) use standard short UI translations; ar/fa use standard UI phrases consistent with their localized bracket sections — **native-speaker review recommended** for ar/fa. Broader i18n parity gaps (e.g. many keys still English in non-en files) remain separately-tracked debt, not audited here.

## PR

Branch pushed for human review — **no PR opened** per task instructions.
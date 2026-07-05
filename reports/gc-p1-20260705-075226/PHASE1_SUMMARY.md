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

### Dependency audit
- `reports/gc-p1-20260705-075226/npm-audit-findings.md`

## Local verification (2026-07-05)

| Check | Result |
|-------|--------|
| `npm run test:unit` | **56/56 pass** |
| `npm run test:e2e` | **5/5 pass** |
| `npm run test:visual` | **9/9 pass** |
| `npx tsc --noEmit` | **clean** |
| `npm run build` | **pass** |
| `npm run lint` | **62 errors / 25 warnings (pre-existing)** — not introduced by Phase 1 files |

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
- **Cross-OS visual baselines** — current snapshots are `win32`; CI (ubuntu) may need linux baselines or `maxDiffPixelRatio` tuning on first CI run
- **Monorepo lockfile warning** — Next.js picks parent `package-lock.json`; consider `outputFileTracingRoot` / `turbopack.root` in a future infra task
- **npm audit breaking upgrades** — see `npm-audit-findings.md`; do not run `npm audit fix --force` without approval

## PR

Branch pushed for human review — **no PR opened** per task instructions.
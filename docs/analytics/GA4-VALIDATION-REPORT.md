# GA4 validation report

Date: 2026-07-19
Branch: goalcurrent-v2-rebuild

## Automated

| Check | Result |
|-------|--------|
| npm run test:unit | 101/101 pass (includes tests/analytics/*) |
| npm run build | Pass (Next.js 16.2.9) |
| npx tsc --noEmit | Fail (baseline UTF-16 in unrelated e2e file per prior audit) |
| npm run lint | Fail (baseline jsx-a11y plugin redefine) |

## Host gating (unit tests)

- localhost blocked
- *.vercel.app blocked
- www.goalcurrent.live and goalcurrent.live allowed

## Manual (founder)

- GA4 DebugView on production after cookie accept: not run in this session (no GA4 admin credentials in CI)
- Verify gtag network calls only on www.goalcurrent.live

## Preview / localhost

- GA scripts do not load without production host + cookie consent (code review + gating tests)

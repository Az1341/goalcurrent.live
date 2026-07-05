# npm audit findings — GC-P1-20260705-075226

**Command:** `npm audit --production` (`npm audit --omit=dev`)  
**Date:** 2026-07-05  
**Branch:** `gc-p1-safety-net`

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Moderate | 8 (production tree) |

No Critical or High vulnerabilities in the production dependency tree. Do **not** auto-apply `npm audit fix --force`.

## Critical / High

_None._

## Moderate (production)

### postcss (via next@16.2.9)
- **Vulnerable range:** `<8.5.10` (nested)
- **Advisory:** GHSA-qx2v-qp2m-jg93
- **Fix offered by audit:** `next@9.3.3` via `--force`
- **Type:** Breaking major downgrade — **not semver-safe**

### uuid (transitive via firebase-admin / Google Cloud)
- **Vulnerable range:** `<11.1.1`
- **Advisory:** GHSA-w5hq-g745-h8pq
- **Fix offered:** `firebase-admin@10.3.0` via `--force`
- **Type:** Breaking major downgrade — **not semver-safe**

### Transitive chain (gaxios, teeny-request, retry-request, @google-cloud/storage)
- Resolve when `firebase-admin` publishes a non-breaking update.

## Human approval required

| Package | Forced fix risk |
|---------|-----------------|
| `next` | Downgrade to v9 — breaks app |
| `firebase-admin` | Downgrade to v10 — breaks server Firebase |

**Do not run `npm audit fix --force` without explicit approval.**
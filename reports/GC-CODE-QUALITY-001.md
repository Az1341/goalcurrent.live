# GC-CODE-QUALITY-001 — Code quality review

**Date:** 2026-07-20 BST · **Scope:** whole project (static review)

## Metrics (approximate)

- ~508 TypeScript/TSX files under `src/`
- Analytics module well-factored (`config` / `transport` / `events` / trackers)
- WC26 domain is densest area (fixtures, bracket, standings, overlays)

## Prioritised remediation

| Priority | Item |
|----------|------|
| P1 | Split oversized WC26 client views (fixtures calendar / bracket) into presentational + data hooks |
| P1 | Keep UTF-8 encoding guardrails (Windows/OneDrive UTF-16 regressions already bitten CI) |
| P2 | Reduce duplication between PL and WC26 API route handlers (shared factory) |
| P2 | Continue extracting SEO helpers; avoid per-article metadata drift |
| P2 | ESLint flat-config already fixed jsx-a11y redefine — keep CI lint gate green |
| P3 | Dead-code pass: unused exports via knip/ts-prune in a dedicated chore |
| P3 | Document architectural boundaries: `src/lib/wc26` vs UI components |

## SOLID / architecture

- Analytics: good SRP and host gating.
- Content/news: mixed RSS + editorial static articles — clear but watch dual paths.
- i18n: next-intl navigation helpers used consistently.

## Verdict

**CONDITIONAL** — maintainable core; WC26 surface is the main complexity hotspot.
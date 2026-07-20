# GC-BATCH-004-BASELINE-001 — Batch 004 Baseline and Batch 003 Verification

**UK date/time:** 2026-07-20 21:55 BST  
**Batch:** GC-EXECUTION-BATCH-004  
**Working branch:** `feature/wc26-archive-private-preview`  
**Status:** VERIFIED BASELINE (docs only — no implementation claimed)

## Source control baseline

| Item | Value | Classification |
|------|-------|----------------|
| Starting `origin/main` SHA | `2a6de49a97e9a5d4a98aa4134b9d67563ba28250` | VERIFIED COMPLETE |
| Local `HEAD` after branch create | `2a6de49a97e9a5d4a98aa4134b9d67563ba28250` | VERIFIED COMPLETE |
| Working tree | clean | VERIFIED COMPLETE |
| Batch 004 branch | `feature/wc26-archive-private-preview` created from `origin/main` | VERIFIED COMPLETE |
| Main tip message | `docs(phase2): source-lock failure — block blueprint batch` | VERIFIED COMPLETE |

## Batch 003 status (independent confirmation)

| Item | Value | Classification |
|------|-------|----------------|
| Branch | `docs/gc-sepan-foundation-001` | VERIFIED COMPLETE |
| Branch head | `5c1e03f` (`docs(sepanai): record batch 003 verification`) | VERIFIED COMPLETE |
| Commits ahead of main | 13 (12 task commits + verification close-out) | VERIFIED COMPLETE |
| PR | [#10](https://github.com/Az1341/goalcurrent.live/pull/10) | VERIFIED COMPLETE |
| PR state | `OPEN` | VERIFIED COMPLETE |
| `mergedAt` | `null` | VERIFIED COMPLETE |
| PR #10 unmerged | **YES — confirmed unmerged** | VERIFIED COMPLETE |
| Batch 003 files on `main` | `docs/sepanai/` absent on `origin/main` | VERIFIED COMPLETE |
| Batch 003 files on foundation branch | 14 markdown files under `docs/sepanai/` | VERIFIED COMPLETE |

### Batch 003 commit list (`origin/main..origin/docs/gc-sepan-foundation-001`)

1. `0d8247e` docs(sepanai): add authorised pilot source pack  
2. `8ac0f7a` docs(sepanai): reconcile current GoalCurrent pilot state  
3. `9e06055` docs(sepanai): register architecture conflicts and sources of truth  
4. `59dbc0c` docs(sepanai): add pilot authentication ADR  
5. `2db458e` docs(sepanai): define membership-gated AI pilot PRD  
6. `3129145` docs(sepanai): define v1 provider-neutral explanation contract  
7. `e6d8aa3` docs(sepanai): reconcile minimum pilot data model  
8. `fe8e9b1` docs(sepanai): complete official-source provider and cost study  
9. `e4cf1d7` docs(sepanai): complete pilot privacy and security review  
10. `88472d5` docs(sepanai): define pilot analytics and success framework  
11. `d034942` docs(sepanai): create controlled pilot build roadmap  
12. `4053d6a` docs(sepanai): deliver founder decision package  
13. `5c1e03f` docs(sepanai): record batch 003 verification  

Verification report path on Batch 003 branch: `docs/sepanai/GC-SEPAN-BATCH-003-VERIFICATION.md` (exists on foundation branch; **not** on main).

Reported Batch 003 verification (from prior batch report; not re-run in Task 01): unit 102/102, i18n pass, build pass. Task 01 does **not** claim those tests were re-executed on this branch.

## Production and deployment configuration

| Item | Evidence | Classification |
|------|----------|----------------|
| Production URL (product) | `https://goalcurrent.live` (Batch 003 pack / product standard) | VERIFIED PARTIAL (HTTP live probe not run in Task 01) |
| GitHub `homepage` field | `http://goalcurrent.online/` | CONFLICTING with product URL — recorded, not resolved here |
| Default branch | `main` | VERIFIED COMPLETE |
| `vercel.json` | Crons only (`/api/cron/refresh-content`) | VERIFIED COMPLETE |
| Local `.vercel/project.json` | Present (local link metadata) | VERIFIED PARTIAL |
| Preview deployment behaviour | Vercel Git integration expected for non-`main` branches | NOT VERIFIED without Vercel dashboard/API confirmation in Task 01 |
| Preview access protection (password/SSO) | — | NOT VERIFIED |
| Netlify as primary host | Not indicated as primary; `vercel.json` present | NOT VERIFIED for production host identity beyond prior project practice |

## Current test baseline (scripts present on main)

From `package.json` on this checkout:

- `npm run test:unit`
- `npm run i18n:check`
- `npm run build`

Task 01 did **not** execute these commands (docs-only baseline; no code modification). Pass/fail numbers from Batch 003 are historical reports, not Task 01 results.

## Batch 004 separation rules (confirmed for this batch)

- Do **not** merge PR #10 during Batch 004.
- Do **not** combine Batch 003 and Batch 004 into one PR.
- SEPANAI implementation remains blocked pending Founder Decision Pack approval.
- Batch 004 must not activate AI providers, Supabase Auth, SEPANAI generation, or paid services.

## Evidence limitations

- Live production HTTP responses not fetched in Task 01.
- Vercel project protection / deployment protection settings not inspected via dashboard in Task 01.
- Batch 003 unit/i18n/build results not re-run on `feature/wc26-archive-private-preview`.
- Analytics or traffic importance for WC26 routes not available without GA4 Admin access (**NOT VERIFIED**).

## Explicit statements

- No merge performed.
- No deployment performed.
- No production code modified in Task 01.
- No proposed archive work reported as implemented.

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
# GC-WC26-FOUNDER-REVIEW-PACK-001 — Protected Private-Preview Founder Review

**UK date/time:** 2026-07-21 15:15 BST  
**Status:** AWAITING FOUNDER PRIVATE-PREVIEW REVIEW  
**Working branch:** `feature/wc26-archive-private-preview`  
**Starting main SHA (Batch 004 baseline):** `2a6de49a97e9a5d4a98aa4134b9d67563ba28250`

## Executive summary

Batch 004 converts World Cup 2026 from a live competition presentation into a permanent **World Cup 2026 Archive**, demotes WC26 from primary navigation, retires archive-mode live polling, documents redirects, and preserves offline historical fixtures for a future SEPANAI pilot (no AI activation).

Publication is **not** authorised until Ahmad reviews a **protected** private preview and gives Explicit Founder Approval.

## Incident note (required transparency)

During Task 08, commits were briefly present on `main` without Founder Approval. Content on `main` was subsequently restored toward the pre-archive tree (hub again uses live scoreboard module; `archive.ts` absent on `origin/main`). **Batch 004 work continues only on this feature branch.** PR #10 (Batch 003) remains unmerged.

## Before / after route map

| Before | After |
|--------|-------|
| `/worldcup2026` live hub + scoreboard | Archive hub + champion/final from SSOT |
| WC26 mobile bottom tab + desktop dropdown | Articles tab; WC26 via More → archive submenu |
| Bracket live polling | Disabled when tournament complete |
| Homepage champion “Breaking” live framing | Single historical archive card |
| Global Wc26ResultsSync always on | Gated off when archive complete |

## Pages changed (high level)

- Archive hub, section chrome, bracket client/polling, match detail countdown gates, nav, homepage modules, live retirement sync, redirects documentation, historical fixtures, governance policy, reports.

## Pages retained

All primary `/worldcup2026/*` section URLs, articles, `/match/:id` (canonical), news/videos world-cup hubs.

## Redirects

Documented in `docs/seo/GC-WC26-URL-MIGRATION-001.md` (existing evidence-backed `next.config.ts` redirects; no homepage dump).

## Live behaviour retired

See `reports/GC-WC26-LIVE-RETIREMENT-001.md`.

## SEO protections

Archive metadata; retained sitemap paths; match 301 to canonical match centres.

## Test results

- Unit: **115/115 PASS**
- i18n: **PASS**
- Build: **PASS** (Clarity.tsx restored for compile)

## Known limitations / blockers

1. **Protected private preview URL: NOT VERIFIED** — Vercel API returned 403 for team scope `az-team-1`. Do **not** treat any public preview link as completed private preview until Ahmad confirms Deployment Protection.
2. Screenshots at 390 / 1440 / 1920: **NOT CAPTURED** — blocked on verified protected preview.
3. Playwright a11y/visual suites: **NOT RUN** in this batch shell.
4. Clarity commits mixed onto feature history — restored file for build only; product scope remains WC26 archive.

## Protected private-preview URL

**NOT VERIFIED — BLOCKER requiring Ahmad’s Vercel action (Deployment Protection + shareable protected preview for this branch).**

Access instructions: After enabling protection, open the branch preview for `feature/wc26-archive-private-preview`, review `/worldcup2026` and navigation on mobile/desktop.

## Rollback plan

1. Do not merge this PR.  
2. If any preview misleads users: disable the preview deployment in Vercel.  
3. If main were ever contaminated again: restore to known-good SHA `2a6de49` (or current approved production tip) via Founder-authorised ops.  
4. Feature branch can be deleted without affecting production while unmerged.

## Draft PR URL

See batch close-out (created as draft, separate from PR #10).

## Complete commit list (from baseline `2a6de49`)

ca650c9 test(wc26): certify archive SEO accessibility and regression coverage
f6deed2 test(sepanai): preserve verified WC26 historical fixtures for future pilot
169a469 perf(wc26): retire obsolete live tournament behaviour safely
31be078 feat(navigation): move World Cup 2026 into archive navigation
067364f feat: wire Microsoft Clarity on production head
0a9fb9b fix(wc26): add evidence-backed archive redirects and canonical map
36f1f80 fix: encode Microsoft Clarity component as UTF-8
05542b1 chore(wc26): remove unrelated Clarity changes from archive branch
189ce4e feat(wc26): consolidate final tournament results and archive pages
4904645 feat(wc26): convert World Cup hub into completed tournament archive
e5af14c docs(wc26): define permanent World Cup archive architecture
434cc40 docs(wc26): inventory World Cup routes content and dependencies
a88b530 docs(governance): add mandatory private-preview release policy
b9b567f docs(batch004): verify baseline and Batch 003 status

## Founder review checklist

- [ ] Archive hub approved  
- [ ] Champion/final presentation approved  
- [ ] Bracket approved  
- [ ] Results approved  
- [ ] Navigation approved  
- [ ] Homepage priority approved  
- [ ] Mobile layout approved  
- [ ] Desktop layout approved  
- [ ] Archive wording approved  
- [ ] Redirect plan approved  
- [ ] Public deployment approved or rejected  

## Required final status

**AWAITING FOUNDER PRIVATE-PREVIEW REVIEW**

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
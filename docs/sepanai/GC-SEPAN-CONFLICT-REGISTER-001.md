# GC-SEPAN-CONFLICT-REGISTER-001 — Architecture Conflicts

**UK date/time:** 2026-07-20 21:35 BST  
**Branch:** docs/gc-sepan-foundation-001  
**Status:** PROPOSED dispositions — Founder Approval where noted

| ID | Conflict | Evidence | Risk | Source of truth | Required decision | Recommended disposition | Owner | Status |
|----|----------|----------|------|-----------------|-------------------|-------------------------|-------|--------|
| C01 | Firebase Auth vs Supabase Auth | Main Firebase paths; rebuild Supabase deps | Dual login / identity split | Main Firebase for members | Keep one member auth | Keep Firebase; Supabase Auth disabled for members (ADR) | Founder | OPEN |
| C02 | Firebase identity vs Supabase users table | Rebuild migration users; Firebase UIDs | Duplicate person records | Firebase UID + `member_identity_links` | Adapter mapping | Internal identity adapter; no Supabase Auth | Founder | OPEN |
| C03 | main vs diverged rebuild | 28/11 divergence; merge base `2f95c37` | Breaking prod if wholesale merge | `main` | Selective port only | Fresh branch from main; port reusable pieces | Eng | OPEN |
| C04 | Upstash rate limit vs AI budget control | `src/lib/rate-limit` vs proposed ledger | Confusing limits | Keep Upstash for HTTP; separate AI budget ledger | Distinct systems | Do not replace Upstash with budget ledger | Eng | PROPOSED |
| C05 | GA4 events vs pilot events | Existing page_view/article_open vs new pilot events | Duplicate emitters | Existing GA4 pipeline for page/article | Add only new pilot events | Never re-add page_view/article_open | Eng | PROPOSED |
| C06 | Football API feeds vs Supabase match store | Main live APIs; rebuild match tables | Dual stores / staleness | Current product data path on main until designed migration | Whether Supabase stores match snapshots | Pilot may store explanation-linked match snapshots only — OPEN for full store | Founder/Eng | OPEN |
| C07 | Direct OpenAI in generate-brief vs SEPANAI boundary | Rebuild `generate-brief` + OpenAI | Vendor lock-in | Approved SEPANAI boundary direction | Provider-neutral API | Port prompts/quality selectively; wrap behind SEPANAI | Eng | PROPOSED |
| C08 | Editorial pages vs brief workflow | Existing articles vs rebuild briefs | Process collision | Existing editorial pages remain; briefs are additive | How briefs relate to articles | Separate explanation_briefs workflow; no silent overwrite of articles | Eng | PROPOSED |
| C09 | .env.example vs new services | Main env has Firebase/Upstash; rebuild adds Supabase/OpenAI | Secret sprawl | Document on branch; no secrets in git | Which vars for pilot | Add only after Founder Approval; never commit values | Founder/Eng | OPEN |
| C10 | Production deploy vs private feature-flagged pilot | Vercel main auto-deploy | Accidental public AI | Feature flags + no gen on page read | Pilot behind flags | Private flag default off until approval | Eng | PROPOSED |

## Rules

- No whole-branch merge of `goalcurrent-v2-rebuild`.
- Assumptions are labelled PROPOSED; live dashboards remain NOT VERIFIED.
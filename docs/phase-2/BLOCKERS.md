# Phase 2 — Blockers

**Document:** docs/phase-2/BLOCKERS.md  
**Batch:** GC-EXECUTION-BATCH-002  
**Created:** 2026-07-20 21:10 BST  
**Status:** ACTIVE — EXECUTION STOPPED

## Blocking condition

Per SOURCE-LOCK RULE: no completed factual research pack exists in the repository or was supplied with this batch. The batch text is an execution prompt, not a research pack. Previous questionnaire / architecture / tech recommendations are discarded and must not be used as facts.

**Do not manufacture the blueprint. Do not write architecture, schema, API, roadmap, cost, or risk documents as if research facts exist.**

## Missing source areas

Until a completed pack is supplied, every area below is missing:

1. Product scope facts (European leagues/competitions retained features — detail beyond KEEP flags)
2. Provider identity, contracts, SLAs, rate limits, coverage, substitution rules
3. Competition and season catalogue facts
4. Licensing (football data, advanced statistics, copyright, database rights)
5. User / persona / adoption facts and traffic baselines
6. Commercial / monetization / pricing facts
7. Operational capacity, headcount, editorial/moderation volumes
8. Risk catalogue **Section 10** of the research pack (all risk facts)
9. Cost inputs with verified supplier prices
10. Legal/GDPR/consent/age-related factual requirements
11. Fantasy / predictions / community rulesets as researched facts
12. SepanAI / FAMVI boundary facts beyond the governing definition in the batch prompt
13. Notification / analytics / moderation vendor facts (if any)
14. Deployment constraints grounded in research (vs discarded prior strategy)

## Task status (all blocked)

| Task | Document ID | Status |
|------|-------------|--------|
| 01 | GC-P2-ARCH-001 | **BLOCKED** |
| 02 | GC-P2-DATA-001 | **BLOCKED** |
| 03 | GC-P2-API-001 | **BLOCKED** |
| 04 | GC-P2-ROADMAP-001 | **BLOCKED** |
| 05 | GC-P2-CERT-001 | **BLOCKED** |
| 06 | GC-P2-DEPLOY-001 | **BLOCKED** |
| 07 | GC-P2-SCALE-001 | **BLOCKED** |
| 08 | GC-P2-SEPAN-001 | **BLOCKED** |
| 09 | GC-P2-RISK-001 | **BLOCKED** |
| 10 | GC-P2-MASTER-001 | **BLOCKED** |

## Required to unblock

1. Supply a **completed factual research pack** (documents with facts, dated sources, Section 10 risks, providers, licensing, users, commercial, operations).
2. Place files under a clear path (recommended: `docs/phase-2/research/`).
3. Update `RESEARCH-SOURCE-REGISTER.md` with every source.
4. Re-run GC-EXECUTION-BATCH-002 from Task 01 only after source lock **PASS**.

## What was intentionally not created

- Master system architecture
- Database schema / ERD / SQL
- OpenAPI
- Sprint roadmap
- Certification gates
- Deployment strategy
- Scalability design
- SepanAI integration design
- Risk mitigation architecture
- Cost model / master blueprint

Creating those without the research pack would violate SOURCE-LOCK and invent unsupported facts.
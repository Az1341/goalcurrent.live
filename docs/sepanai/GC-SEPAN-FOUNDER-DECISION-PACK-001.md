# GC-SEPAN-FOUNDER-DECISION-PACK-001 — Founder Decision Pack

**UK date/time:** 2026-07-20 22:10 BST  
**Audience:** Ahmad Zafarani (Founder)  
**Status:** AWAITING FOUNDER RESPONSES  
**Rule:** Implementation remains blocked until approvals below.

## Executive verdict

Batch 003 delivers a complete GoalCurrent × SEPANAI **foundation documentation and decision package** on branch `docs/gc-sepan-foundation-001`. The incorrect empty-source blocker is **RESOLVED**. Current `main` remains the implementation source of truth; `goalcurrent-v2-rebuild` is partial reusable work only. Recommended pilot posture: Firebase + identity adapter; paid Gemini 2.5 Flash-Lite; low spend ceilings; no automatic provider fallback; Basic intelligence; editorial approval mandatory; marketing consent optional. Live credentials and dashboards remain **NOT VERIFIED** and do not block this documentation batch.

**NOT MERGED AND NOT DEPLOYED.**

## Required decisions

### 1. Authentication: Firebase plus internal adapter for pilot
- **Recommendation:** APPROVE Option C (Firebase member auth + internal identity adapter).
- **Reason:** Existing Firebase implementation on main; lowest migration risk for private pilot; avoids dual login.
- **Cost/risk:** Adapter complexity modest; delayed full IdP consolidation.
- **Consequence of rejection:** Forces Option A-only (weaker data linkage) or Option B (high migration risk).
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 2. Supabase Auth: disabled for member login
- **Recommendation:** APPROVE — do not expose Supabase Auth to members.
- **Reason:** Prevents dual-auth and identity duplication during pilot.
- **Cost/risk:** Supabase used (if at all) as data plane only after selective port.
- **Consequence of rejection:** Dual login / conflicting user stores.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 3. Rebuild branch: selective port only
- **Recommendation:** APPROVE — never wholesale-merge `goalcurrent-v2-rebuild`.
- **Reason:** Diverged from main; Firebase vs Supabase conflict; behind main.
- **Cost/risk:** Manual port effort; avoids large regression.
- **Consequence of rejection (wholesale merge):** High production break risk.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 4. Provider: Gemini 2.5 Flash-Lite candidate
- **Recommendation:** APPROVE as primary pilot candidate (`gemini-2.5-flash-lite`).
- **Reason:** Lowest predictable cost per official pricing pack; suitable for Basic intelligence.
- **Cost/risk:** ~$0.0014/explanation planning estimate; recheck pricing before signup.
- **Consequence of rejection:** Re-open cost study; delay pilot.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 5. Provider tier: paid low-cost recommended over free for privacy
- **Recommendation:** APPROVE paid tier for pilot.
- **Reason:** Official pricing table indicates free-tier content may improve Google products; paid does not.
- **Cost/risk:** Small paid spend vs free-tier data-use exposure. Requires final owner/legal review.
- **Consequence of rejection:** Must explicitly accept free-tier terms with non-personal data only.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 6. Private monthly ceiling: proposed £2
- **Recommendation:** APPROVE £2 private-test ceiling with 60/80/100% thresholds.
- **Reason:** Caps solo-founder downside during private testing.
- **Cost/risk:** May halt generation early; cached content remains.
- **Consequence of rejection:** Unbounded or higher spend risk.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 7. Public-pilot monthly ceiling: proposed £5
- **Recommendation:** APPROVE £5 after private success.
- **Reason:** Controlled public exposure without material spend.
- **Cost/risk:** Still requires stop-at-100% automation.
- **Consequence of rejection:** Delay public pilot or set alternate ceiling.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 8. Automatic fallback: disabled
- **Recommendation:** APPROVE — no automatic paid/provider fallback.
- **Reason:** Prevents silent cost spikes and multi-provider data exposure.
- **Cost/risk:** Generation stops on outage; cache serves.
- **Consequence of rejection:** Need explicit multi-provider policy and budgets.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 9. Pilot scope: one competition and selected completed matches
- **Recommendation:** APPROVE narrow scope.
- **Reason:** Matches PRD exclusions (no mass generation).
- **Cost/risk:** Limited content coverage initially.
- **Consequence of rejection:** Higher cost and editorial load.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 10. Intelligence level: Basic only
- **Recommendation:** APPROVE Basic only; no Ultra.
- **Reason:** Cost/latency/control for first pilot.
- **Cost/risk:** Less depth than Ultra.
- **Consequence of rejection:** Requires new cost/security review.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 11. AI publication: mandatory editorial approval
- **Recommendation:** APPROVE — no unreviewed AI publication.
- **Reason:** Quality, trust, and abuse control.
- **Cost/risk:** Founder/editor time.
- **Consequence of rejection:** Brand and accuracy risk.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 12. Marketing consent: optional and separate
- **Recommendation:** APPROVE optional marketing consent separate from membership.
- **Reason:** Privacy-safe membership growth. Requires final owner/legal review.
- **Cost/risk:** Lower marketing list growth.
- **Consequence of rejection:** Possible bundled consent — legal risk.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 13. Public prompt box: excluded
- **Recommendation:** APPROVE exclusion of unrestricted public AI prompt box.
- **Reason:** Abuse, cost, injection risk; PRD mandatory exclusion.
- **Cost/risk:** Less interactive novelty.
- **Consequence of rejection:** Major security/cost redesign.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

### 14. Next implementation batch: blocked until Founder Approval
- **Recommendation:** APPROVE hold — no implementation coding until this pack is decided.
- **Reason:** Prevents premature auth/provider/spend commitments.
- **Cost/risk:** Schedule delay until decisions land.
- **Consequence of rejection (proceeding anyway):** Unauthorised build risk.
- **Founder response:** APPROVE / REJECT / MODIFY: ________

## Remaining blockers

See `docs/sepanai/GC-SEPAN-BLOCKERS-001.md`.

Notable open items (do not stop Batch 003 docs):
- Live Firebase / Upstash / GA4 Admin / provider account configuration: **NOT VERIFIED**
- Founder responses on decisions 1–14: **OPEN**
- Implementation branch not yet authorised: **BLOCKED pending approval**
- GA4 Enhanced Measurement history setting: founder-side **NOT VERIFIED**

## Recommended immediate next action

1. Founder completes APPROVE/REJECT/MODIFY for decisions 1–14 in this file (or replies in writing).
2. Recheck Gemini/Groq/CF/OpenAI official pricing on access date before any account creation.
3. On approval, open a **new** implementation branch from current `main` and start Roadmap Batch 1 (selective port inventory) — still no wholesale rebuild merge, no deploy from docs branch.

## Document index (Batch 003)

| Doc | Path |
|-----|------|
| Source pack | `docs/sepanai/GC-SEPAN-SOURCE-PACK-001.md` |
| Blockers | `docs/sepanai/GC-SEPAN-BLOCKERS-001.md` |
| Current state | `docs/sepanai/GC-SEPAN-CURRENT-STATE-001.md` |
| Conflict register | `docs/sepanai/GC-SEPAN-CONFLICT-REGISTER-001.md` |
| Auth ADR | `docs/sepanai/GC-SEPAN-AUTH-ADR-001.md` |
| PRD | `docs/sepanai/GC-SEPAN-PRD-001.md` |
| API contract | `docs/sepanai/GC-SEPAN-API-CONTRACT-001.md` |
| Data model | `docs/sepanai/GC-SEPAN-DATA-MODEL-001.md` |
| Cost study | `docs/sepanai/GC-SEPAN-COST-STUDY-001.md` |
| Privacy/security | `docs/sepanai/GC-SEPAN-PRIVACY-SECURITY-001.md` |
| Analytics | `docs/sepanai/GC-SEPAN-ANALYTICS-001.md` |
| Build roadmap | `docs/sepanai/GC-SEPAN-BUILD-ROADMAP-001.md` |
| Founder decision pack | `docs/sepanai/GC-SEPAN-FOUNDER-DECISION-PACK-001.md` |
| Batch verification | `docs/sepanai/GC-SEPAN-BATCH-003-VERIFICATION.md` (after Task 12 verify) |

## Commit list for Tasks 01–12

- d034942 docs(sepanai): create controlled pilot build roadmap
- 88472d5 docs(sepanai): define pilot analytics and success framework
- e4cf1d7 docs(sepanai): complete pilot privacy and security review
- fe8e9b1 docs(sepanai): complete official-source provider and cost study
- e6d8aa3 docs(sepanai): reconcile minimum pilot data model
- 3129145 docs(sepanai): define v1 provider-neutral explanation contract
- 2db458e docs(sepanai): define membership-gated AI pilot PRD
- 59dbc0c docs(sepanai): add pilot authentication ADR
- 9e06055 docs(sepanai): register architecture conflicts and sources of truth
- 8ac0f7a docs(sepanai): reconcile current GoalCurrent pilot state
- 0d8247e docs(sepanai): add authorised pilot source pack

(Task 12 commit SHA is this commit; verification doc follows in the same batch close-out.)
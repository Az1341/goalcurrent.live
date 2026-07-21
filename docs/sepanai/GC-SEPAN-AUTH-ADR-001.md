# GC-SEPAN-AUTH-ADR-001 — Pilot Authentication

**UK date/time:** 2026-07-20 21:35 BST  
**Status:** PROPOSED — FOUNDER APPROVAL REQUIRED  
**Decision:** Option C

## Context

Main already implements Firebase Authentication (Google + Apple) and Firebase Admin verification when configured. Rebuild adds Supabase infrastructure. Pack forbids dual member login and forbids activating Supabase Auth for members in the pilot.

## Options

### A — Keep Firebase Authentication only (no adapter work)

- Pros: Minimal change.
- Cons: Harder to attach pilot DB rows without a stable internal member id mapping layer.

### B — Migrate completely to Supabase Auth

- Pros: Single future store.
- Cons: High migration risk; user duplication; no approved migration; rebuild behind main; operational burden for solo founder; rollback hard.

### C — Firebase for pilot + internal identity adapter + later migration review (**RECOMMENDED**)

- Pros: One member-facing login; maps Firebase UID → internal member records; Supabase Auth stays dark; reversible; fits solo-founder ops.
- Cons: Temporary dual-stack data plane if Supabase used for pilot tables only.

## Assessment

| Criterion | A | B | C |
|-----------|---|---|---|
| Existing implementation reuse | High | Low | High |
| Migration risk | Low | High | Low–Med |
| User duplication risk | Low | High | Controlled via links table |
| Security | Known Firebase path | New surface | Firebase + server adapter |
| Email verification | Firebase flows | Rebuild unknown | Firebase |
| Account deletion | Must wire to pilot records | Complex | Adapter + deletion requests |
| Consent records | App-owned | App-owned | App-owned (not auth vendor) |
| Solo-founder burden | Low | High | Low–Med |
| Rollback | N/A | Poor | Good (disable adapter features) |

## Rules if approved

1. Firebase remains the **only** member-facing authentication system.
2. Supabase Auth must **not** be exposed to members.
3. No authentication **code** is authorised by Batch 003 (docs only).
4. Server derives actor context from verified Firebase tokens; raw tokens are not sent to AI providers.

## Consequences of rejection

- Rejecting C in favour of B blocks pilot until a full auth migration plan exists.
- Rejecting C in favour of A without an adapter risks orphan pilot rows.

## Reversal plan

Disable pilot feature flags; stop writing `member_identity_links`; members continue using Firebase as today.

**Requires final owner/legal review** for account-deletion and identity retention wording.
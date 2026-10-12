# auth.md — goalcurrent.live

**Status:** Review draft, 12 October 2026. This is a checklist, not a claim that controls are implemented.

## Scope
Admin accounts and protected deployment controls. Review existing authentication, authorisation, roles, session logic, and approved source-of-truth documents before any implementation. Do not introduce a second identity provider or competing access model.

## Verification requirements
- Identify real principals, service identities, role/permission mappings and trusted boundaries from the existing code.
- Enforce authorisation at every server-side data read, mutation, webhook or external action; client-side hiding is insufficient.
- Test unauthenticated, expired session, revoked account, cross-tenant access, token replay and least-privilege denial with synthetic fixtures.
- Preserve MFA/passkey rules where deployed, use secure session cookies and CSRF/origin defences where applicable.
- Keep provider tokens server-side and document token rotation, revocation and audit logging without publishing secrets.
- Mark any unavailable test or undocumented policy as **UNVERIFIED**, not PASS.

## Approval
Any auth behaviour change needs a dedicated design review, isolated tests and the existing founder release gate. Never treat documentation as authorisation to open signups or relax controls.

Related: [security.md](security.md), [data.md](data.md), [checklist.md](checklist.md).

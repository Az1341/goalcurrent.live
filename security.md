# security.md — GoalCurrent.live

**Status:** Documentation draft for review, 12 October 2026 (Europe/London). **Not** a security certificate, release approval or replacement for existing policy.

## Authority and trust boundary
- Consult `AGENTS.md`, `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md`, `docs/ENVIRONMENT.md` before modifying security behaviour. Where this summary differs, existing approved documents and implemented controls win.
- Public football website; external football/media providers, Vercel previews and the production deployment are distinct trust boundaries.

## Minimum safeguards
- Authenticate and authorise on the server; use least privilege and deny by default. Document any surface to which this does not apply.
- Keep tokens, API keys, credentials, private personal data and secrets out of code, client bundles, logs, pull requests and test fixtures. Rotate a credential if exposure is suspected.
- Validate inputs, limit rates and resource consumption, and enforce origin, tenancy, action and environment boundaries where relevant.
- Ensure private information is excluded from publicly accessible previews, generated artefacts and telemetry.
- Make any externally consequential action subject to the project's existing approval controls; never infer approval from a successful test.
- Keep API keys server-only; preserve retired/live-data decisions where documented; check third-party image and content rights. Every release requires a protected preview and explicit founder approval.

## Security evidence / incident handling
1. Record affected revision, scope, impact and reproduction using synthetic data only.
2. Contain any exposure without deleting evidence; revoke compromised credentials through authorised channels.
3. Repair on a separate branch; review dependency, authorisation, data-leak and regression risks.
4. Record failed and passed tests; require applicable release gates and explicit founder approval before merge/deployment.

**Related:** [auth.md](auth.md) · [data.md](data.md) · [hack.md](hack.md) · [checklist.md](checklist.md)

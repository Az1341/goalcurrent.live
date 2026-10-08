# GoalCurrent controlled pause — DKAMS-GC-PAUSE-001

Owner: ChatGPT execution; Ahmad release approval. Scheduled for 9 October 2026 morning Europe/London. Design: selected option 1, stadium at rest.

## Verified target and restoration record
- Repository: Az1341/goalcurrent.live; branch main.
- Source before pause: db06a6db5a501f7ca53443e9bafe201278edcd7d.
- Vercel project: prj_S6UM3tRI1I7436Q7Pz3q6yqhWBe4, goalcurrent.live.
- Team: AZ TEAM_1 / team_ucQ5b2E2kltKRvphqNd86BQm.
- Current production deployment: dpl_2qNjRfFQmRB2ocvSxkGXygkaJLPo (READY, rollback candidate).
- Current production deployment hostname: goalcurrentlive-35dc8odnc-az-team-1.vercel.app.
- Domains: goalcurrent.live and www.goalcurrent.live.
- Do not operate on the legacy personal-team goalcurrent-live-nextjs project.

## Deployment and privacy
vercel.json selects a static build with no runtime functions and no cron jobs. This change is held on a feature branch. Next source, data, dependencies and public assets are preserved. No analytics, forms or new cookies are loaded. Existing GoalCurrent workers are retired; only the existing goalcurrent-online- cache namespace is cleared. No localStorage or unrelated cache is deleted. Font license notices are bundled. Header uses the supplied original logo to preserve repository branding rules.

The homepage is HTTP 200 and indexable. www preserves the requested path while redirecting to apex. Old HTML paths display the same message with HTTP 404/noindex, rather than blanket homepage redirects. API paths are HTTP 503 JSON and do not call providers. Sitemap contains only the homepage. Existing pages may lose rankings during a long pause. This is intentional and reversible by restoring the app.

Protection observed on the project: Vercel SSO all_except_custom_domains. Verify the actual branch preview requires authentication before calling it a completed protected preview. Do not weaken protection.

## Release gates
1. Static build + 5 pause tests.
2. Dedicated Playwright desktop/tablet/320px/390px, axe accessibility, routing and worker tests.
3. Existing source type/i18n/unit/fundamentals checks to preserve restoration confidence.
4. Design review and protected private preview.
5. Ahmad reviews exact PR/SHA and explicitly approves it.
6. Merge/public deployment only on/after 9 October.

Full Next browser/build CI applies to football deployments. For this static deployment the dedicated holding browser/build job is the required surface gate. The source quality job remains active. The next full football build will be required when resuming.

## Remaining operational checks on the pause date
- Confirm Vercel cron removal on the actual production deployment; the existing daily 06:00 UTC job must stop.
- GitHub refresh workflow is already manual-only; do not restore its old schedule.
- Inventory old deployments/previews and any external workers. They may still contain provider credentials; do not claim zero provider usage until checked.
- A pre-opened browser may keep attempting old APIs; production now returns 503 without reaching providers.
- Keep domain renewal active. Paid API renewal is separate and has not been cancelled. Verify plan terms and billing before claiming savings.
- Do not add any paid service or delete a project, stored data, credentials, or source.

## Restore
Use a new reviewed PR that reverts this single-purpose pause change, including vercel.json and its CI scope changes. This restores the existing Next build and daily cron. Confirm the football provider plan/key remains valid and pass full football unit/build/Playwright gates first. Redeploy from the reviewed Git source. The recorded old deployment is a recovery reference, but should not be promoted blindly after the API subscription expires. Recheck current production SHA at release in case main changed after preparation.

NOT MERGED AND NOT PUBLICLY DEPLOYED.

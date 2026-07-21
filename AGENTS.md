<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Reporting standard — MANDATORY

Every Cursor execution report, progress update, validation report, CI report, deployment report and blocker report **must** follow:

**[`docs/standards/REPORTING_STANDARD.md`](docs/standards/REPORTING_STANDARD.md)**

Use the templates in [`templates/`](templates/) when producing formal reports.

Mandatory envelope (no exceptions):

1. Begin every report with a fresh local timestamp: `[DD/MM/YYYY – HH:MM]`
2. End every final report with `Report generated:` and a fresh `[DD/MM/YYYY – HH:MM]`
3. Include Generated at, Task started, Task completed, Status checked, Duration, git/PR identity, and Overall Status as defined in the standard
4. Never estimate times; never reuse timestamps; never write bare “Still running.” for long jobs

This applies to GoalCurrent, SepanAI and FAMVI work unless the Founder explicitly overrides.

## Before commit / push — fundamental design check

Run `npm run verify:design` and confirm in the browser:

- **Logo** — header shows `/logo.svg`
- **Flags** — team rows show `/flags/4x3/*.svg` (not empty grey boxes)
- **Photos** — hero uses `/images/football-hero-bg.jpg`; article/news cards show images
- **Emojis** — match events (⚽ 🎯), language menu (🌐), stubs (🚧) render on Windows
- **Language** — header `🌐 EN ▾` (desktop) and More sheet → زبان (mobile)

Do **not** set `HOME_HERO_BG` to `null` or remove `image` fields from article hubs. Do not route `/flags`, `/images`, or `/icons` through the service-worker cache-first path.

## Mandatory private-preview release policy

Every GoalCurrent change must follow:

Build → Automated tests → Protected private preview → Ahmad’s review → Explicit Founder Approval → Merge into main → Public deployment

Nothing may be merged into main or published publicly without Explicit Founder Approval after Ahmad has reviewed the protected private preview.

Full policy: `docs/governance/PRIVATE-PREVIEW-RELEASE-POLICY.md`

Release reports must also satisfy `docs/standards/REPORTING_STANDARD.md` and end with **NOT MERGED AND NOT PUBLICLY DEPLOYED.** until Founder Approval authorises otherwise.

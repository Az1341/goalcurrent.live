# DKAMS-GC-FREE-001 — Automated results and fixtures

Date/time: 04/10/2026 – 09:31 BST. Owner: ChatGPT implementation/audit; Cursor verification; Ahmad private review and release approval.

Problem: Paid live football data is no longer justified; renewal is cancelled.
Benefit: Immediately useful homepage, free delayed results/fixtures, no daily founder work.
Approved scope: PRIVATE preview only. Release target: 09/10/2026 00:00 Europe/London AFTER separate founder approval. Holding PR #95 remains fallback. Never merge both.

Approach: Keep the existing Next application, branding, news and video ingestion. Replace homepage live polling with server-seeded cached football-data.org current-season matches. EPL default and competition dropdown; today, latest final results, next fixtures. Suppress all in-play scores. Local device dates/time. Eight free-tier competitions, shared 12-hour Next Data Cache and authenticated cron warm-up. Request failures retain cached successes; no fake final scores or fresh timestamps. Existing FOOTBALL_DATA_KEY is configured in Vercel; its account tier, validity and current-season access need verification. Disable paid-provider access in this deployment and route outdated football surfaces to the new match board. Source and old provider code remain for rollback.

Risks: Free plan delays/missing competition coverage; cache timing is approximate; hosting/cron costs are not yet verified as zero; team-image rights; retained old deployments. Do not auto-upgrade, renew API, scrape blocked pages, bypass protection, or expose secrets. New account/terms acceptance may require Ahmad if the existing key is unusable.

Acceptance: EPL default; working dropdown; today's matches visible first (all grouped by competition); latest FT results descending; upcoming fixtures ascending; immediate next fixture when today empty; no live scores; postponed/cancelled handled; missing scores never 0–0; status pending after kickoff; no fabricated results; last successful update/stale labels; RSS/news/videos preserved; no visitor-triggered paid calls; refresh budget verified; keyboard/mobile accessibility; original logo/flags/photos; protected preview; provider free-tier evidence before release.

Sequential task: audit → implement → unit/type/i18n/design checks → protected branch preview → browser audit → founder review. Cursor: new chat, cheapest capable model, under 50% context. Archive under docs/free-football/archive only after approved deployment and verification. No merge/public deployment now.

# GC-WC26-ARCHIVE-QA-001 — Archive SEO, Accessibility and Regression QA

**UK date/time:** 2026-07-21 15:05 BST  
**Branch:** feature/wc26-archive-private-preview

## Automated results

| Check | Result | Notes |
|-------|--------|-------|
| npm run test:unit | PASS 115/115 | Archive, redirect, live-retirement, historical fixtures |
| npm run i18n:check | PASS | Message key parity OK |
| npm run build | PASS after Clarity.tsx restore | Layout imported Clarity deleted earlier; restored from 067364f |

## SEO

- Hub/section metadata use Archive framing: PASS
- Canonical /worldcup2026 retained: PASS
- Match redirect to /match/:id: PASS (next.config.ts)
- Sitemap WC26 paths retained: PASS
- No duplicate page_view/article_open: PASS

## Accessibility (static)

- Hub heading hierarchy and main landmark: PASS
- Archive link focus styles: PASS
- Playwright a11y/visual: NOT RUN here — Founder private-preview review

## Consistency

- Final/third-place SSOT tests: PASS
- Bracket archiveMode: PASS

## Limitations

- Vercel API deployment protection: NOT VERIFIED (403)
- Clarity restored for build integrity only

**NOT MERGED AND NOT PUBLICLY DEPLOYED.**
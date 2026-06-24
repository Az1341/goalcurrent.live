# WC26 matchday recap — publish checklist

**Target:** live within 30 minutes of the last FT on the matchday.

## Before FT (prep)

- [ ] Confirm matchday date slug: `world-cup-2026-{mon}-{dd}-recap` (e.g. `world-cup-2026-june-24-recap`)
- [ ] Note featured matches + final scores from `/live` or `/worldcup2026/fixtures`
- [ ] Copy template: `src/app/articles/_templates/world-cup-matchday-recap.page.tsx`

## Publish (code — ~15 min)

1. **ARTICLE_INDEX** — append entry in `src/data/articles.ts` (do not remove existing rows):

```ts
{
  slug: "world-cup-2026-june-24-recap",
  category: "Match Recap",
  title: "Your headline — World Cup 2026 Matchday Recap, 24 June",
  excerpt: "One-line hook for listings and SEO (max ~160 chars).",
  date: "25 June 2026",
},
```

2. **Page** — create `src/app/articles/world-cup-2026-june-24-recap/page.tsx` from template:
   - Set `SLUG` constant
   - Update hero title, publish date, lead paragraph
   - One `<h2>` + score badge block per featured match
   - End with "What it all means" section + internal links

3. **Build** — `npm run build` (must pass)

4. **Deploy** — commit + push `main` → Vercel

## After deploy (~5 min)

- [ ] Open `https://goalcurrent.live/articles/{slug}`
- [ ] GSC → URL Inspection → **Request indexing** (1 URL only — uses quota)
- [ ] Optional: share on social with apex URL

## Auto-included (no extra steps)

- Main sitemap (`/sitemap.xml`) — via `ARTICLE_INDEX`
- News sitemap (`/sitemap-news.xml`) — via `ARTICLE_INDEX`
- Article JSON-LD — via `StaticArticleSeo`
- Homepage/articles hub — picks up new index entry

## Content rules

| Rule | Detail |
|------|--------|
| Slug pattern | `world-cup-2026-{mon}-{dd}-recap` |
| Category pill | `Match Recap · World Cup 2026` |
| Min length | 280+ chars plain text for news eligibility |
| Links | `/articles`, `/worldcup2026`, `/worldcup2026/fixtures`, `/live` |
| Match links | `/match/{fixtureId}` when highlighting a single game |
| Hero | Do not change homepage hero (locked) |

## Match block HTML pattern

```tsx
<h2>Team A 2–1 Team B — Venue, City</h2>
<h3>Subhead (angle)</h3>
<div className={styles.scoreBadge}>
  <span className={styles.scoreTeam}>Team A</span>
  <span className={styles.scoreNum}>2 – 1</span>
  <span className={styles.scoreTeam}>Team B</span>
</div>
<p>Recap paragraphs…</p>
```

## Files touched per recap

| File | Action |
|------|--------|
| `src/data/articles.ts` | Append `ARTICLE_INDEX` row |
| `src/app/articles/{slug}/page.tsx` | New page from template |
| `src/app/HomeClient.tsx` | No change unless manually featuring article |
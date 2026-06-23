export type ArticleIndexEntry = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
};

/** Canonical index for /articles — append-only; do not remove existing entries. */
export const ARTICLE_INDEX: readonly ArticleIndexEntry[] = [
  {
    slug: "alireza-beiranvand-iran-world-cup-hero",
    category: "Feature",
    title: "Who Is Alireza Beiranvand? The Story Behind Iran's World Cup Hero",
    excerpt:
      "From Lorestan to Persepolis to Iran's number one shirt — how Alireza Beiranvand became a World Cup hero and why his Belgium performance mattered.",
    date: "22 June 2026",
  },
  {
    slug: "football-in-developing-countries",
    category: "Feature",
    title: "The Beautiful Game in Difficult Places — Football's Power in the Developing World",
    excerpt:
      "From red-earth pitches to World Cup semi-finals — how football serves as a lifeline, a language, and a ladder for communities across the developing world.",
    date: "23 June 2026",
  },
  {
    slug: "football-and-peace",
    category: "Feature",
    title: "When the Final Whistle Becomes a Ceasefire — Football as a Force for Peace",
    excerpt:
      "From the Christmas Truce of 1914 to Didier Drogba's tearful plea in Ivory Coast — the remarkable, real history of football as a peacebuilding tool.",
    date: "23 June 2026",
  },
  {
    slug: "world-cup-2026-june-22-recap",
    category: "Match Recap",
    title: "A Day of Giants — World Cup 2026 Matchday Recap, June 22",
    excerpt:
      "Messi breaks the all-time World Cup scoring record. Mbappé battles a thunderstorm. Haaland strikes twice. The greatest day of stars the 2026 tournament has seen.",
    date: "23 June 2026",
  },
  {
    slug: "football-as-an-industry",
    category: "Analysis",
    title: "The Machine Behind the Magic — How Football Became the World's Biggest Industry",
    excerpt:
      "Billion-pound TV deals, sovereign wealth funds, and €222m transfers. How football transformed into a global industry — and what it cost the game's soul.",
    date: "23 June 2026",
  },
  {
    slug: "champions-league-new-rules",
    category: "Explainer",
    title: "The New Champions League — Everything You Need to Know",
    excerpt:
      "36 teams, eight league phase games, knockout play-offs, merit-based home advantage. UEFA's biggest format overhaul in 21 years, fully explained.",
    date: "23 June 2026",
  },
];

export function articleHref(slug: string): string {
  return `/articles/${slug}`;
}

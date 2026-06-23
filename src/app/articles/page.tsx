import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/page-metadata";
import styles from "./article.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Football Articles & Analysis",
  description:
    "In-depth football articles, World Cup 2026 match recaps, and expert analysis from the GoalCurrent.live Editorial Team.",
  path: "/articles",
});

const ARTICLES = [
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

export default function ArticlesIndexPage() {
  return (
    <main className={styles.articlePage}>
      <div className={styles.stack}>
        <div className={styles.heroCard}>
          <div className={styles.categoryPill}>GoalCurrent Editorial</div>
          <h1>Football Articles &amp; Analysis</h1>
          <div className={styles.hereMeta}>
            <span>By the GoalCurrent.live Editorial Team</span>
            <span className={styles.sep}>·</span>
            <span>Expert football writing &amp; analysis</span>
          </div>
        </div>

        <div className={styles.articlesGrid}>
          {ARTICLES.map((a) => (
            <Link
              key={a.slug}
              href={`/articles/${a.slug}`}
              className={styles.articleIndexCard}
            >
              <span className={styles.pill}>{a.category}</span>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
          ))}
        </div>

        <div className={styles.copyrightCard}>
          <p>
            <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
            <br />
            All articles produced by the GoalCurrent.live Editorial Team. Unauthorised reproduction,
            republication or syndication of any content is strictly prohibited without prior written
            permission.
            <br />
            For syndication enquiries contact us at{" "}
            <a href="https://goalcurrent.live/contact">goalcurrent.live/contact</a>
          </p>
        </div>

        <div className={styles.btnRow}>
          <Link href="/" className={styles.btnSecondary}>← Back to Home</Link>
        </div>
      </div>
    </main>
  );
}

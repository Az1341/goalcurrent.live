import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLE_INDEX, articleHref } from "@/data/articles-index";
import { buildPageMetadata } from "@/lib/page-metadata";
import styles from "./article.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Football Articles & Analysis",
  description:
    "In-depth football articles, World Cup 2026 match recaps, and expert analysis from the GoalCurrent.live Editorial Team.",
  path: "/articles",
});

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
          {ARTICLE_INDEX.map((article) => (
            <Link
              key={article.slug}
              href={articleHref(article.slug)}
              className={styles.articleIndexCard}
            >
              <span className={styles.pill}>{article.category}</span>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
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
          <Link href="/" className={styles.btnSecondary}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

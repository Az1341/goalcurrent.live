import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { ARTICLE_INDEX, ARTICLES, articleHref } from "@/data/articles";
import { getArticleCardImage } from "@/lib/article-hub";
import { buildPageMetadata } from "@/lib/page-metadata";
import { EDITORIAL_AUTHOR, EDITORIAL_PUBLISHER } from "@/lib/seo/constants";
import styles from "./article.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Football Articles & Analysis",
  description:
    `In-depth football articles, World Cup 2026 match recaps, and expert analysis by ${EDITORIAL_AUTHOR} on ${EDITORIAL_PUBLISHER}.`,
  path: "/articles",
});

const CATEGORY_LABELS: Record<string, string> = {
  "world-cup-2026": "🌍 World Cup 2026",
  "premier-league": "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
  "champions-league": "⭐ Champions League",
  editorial: "✍️ Editorial",
};

export default function ArticlesIndexPage() {
  const sortedArticles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <main className={styles.articlePage}>
      <div className={styles.stack}>
        <div className={styles.heroCard}>
          <div className={styles.categoryPill}>{EDITORIAL_PUBLISHER}</div>
          <h1>Football Articles &amp; Analysis</h1>
          <div className={styles.hereMeta}>
            <ArticleAuthorLine sepClassName={styles.sep} />
            <span className={styles.sep}>·</span>
            <span>Expert football writing &amp; analysis</span>
          </div>
        </div>

        <div className={styles.articlesGrid}>
          {ARTICLE_INDEX.map((a) => {
            const image = getArticleCardImage(a.slug);
            return (
            <Link
              key={a.slug}
              href={articleHref(a.slug)}
              className={styles.articleIndexCard}
            >
              {image ? (
                <div className={styles.articleIndexImageWrap}>
                  <Image
                    src={image}
                    alt=""
                    width={640}
                    height={280}
                    sizes="(max-width: 768px) 100vw, 400px"
                    className={styles.articleIndexImage}
                  />
                </div>
              ) : null}
              <span className={styles.pill}>{a.category}</span>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
            );
          })}
          {sortedArticles.map((a) => (
            <Link
              key={a.slug}
              href={articleHref(a.slug)}
              className={styles.articleIndexCard}
            >
              <span className={styles.pill}>
                {CATEGORY_LABELS[a.category] ?? a.category}
              </span>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
          ))}
        </div>

        <div className={styles.copyrightCard}>
          <p>
            <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
            <br />
            <ArticleCopyrightNotice />
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

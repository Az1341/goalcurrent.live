import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleCard from "@/components/articles/ArticleCard";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { fetchSyndicatedArticles } from "@/content/readers";
import { ARTICLE_INDEX, ARTICLES, EXTERNAL_ARTICLE_CARDS, articleHref } from "@/data/articles";
import { getArticleCardImage, isArticleCardImageUnoptimized } from "@/lib/article-hub";
import { buildPageMetadata } from "@/lib/page-metadata";
import { toIsoDate } from "@/lib/seo/dates";
import { EDITORIAL_AUTHOR, EDITORIAL_PUBLISHER } from "@/lib/seo/constants";
import styles from "./article.module.css";

export const revalidate = 86400;

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

export default async function ArticlesIndexPage() {
  const syndicatedArticles = await fetchSyndicatedArticles();
  const sortedIndex = [...ARTICLE_INDEX].sort((a, b) =>
    toIsoDate(b.date).localeCompare(toIsoDate(a.date)),
  );
  const sortedArticles = [...ARTICLES].sort((a, b) => b.date.localeCompare(a.date));
  const indexSlugs = new Set(sortedIndex.map((a) => a.slug));

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
          {sortedIndex.map((a) => {
            const image = getArticleCardImage(a.slug);
            return (
            <Link
              key={a.slug}
              href={articleHref(a.slug)}
              className={styles.articleIndexCard}
            >
              <div className={styles.articleIndexImageWrap}>
                <Image
                  src={image}
                  alt=""
                  width={640}
                  height={280}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={styles.articleIndexImage}
                  unoptimized={isArticleCardImageUnoptimized(image)}
                />
              </div>
              <span className={styles.pill}>{a.category}</span>
              <h2>{a.title}</h2>
              <p>{a.excerpt}</p>
              <span className={styles.readMore}>Read article →</span>
            </Link>
            );
          })}
          {EXTERNAL_ARTICLE_CARDS.map((article) => (
            <a
              key={article.href}
              href={article.href}
              className={styles.articleIndexCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.articleIndexImageWrap}>
                <Image
                  src={article.image}
                  alt=""
                  width={640}
                  height={280}
                  sizes="(max-width: 768px) 100vw, 400px"
                  className={styles.articleIndexImage}
                />
              </div>
              <span className={styles.pill}>{article.source}</span>
              <h2>{article.title}</h2>
              <p>{article.excerpt}</p>
              <span className={styles.readMore}>Read on MSN ↗</span>
            </a>
          ))}
          {syndicatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
          {sortedArticles.filter((a) => !indexSlugs.has(a.slug)).map((a) => (
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

import type { Metadata } from "next";
import Link from "next/link";
import { EDITORIAL_ARTICLES } from "@/data/editorial";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import layoutStyles from "@/components/layout/layout.module.css";
import styles from "@/components/news/news.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Articles",
  description: `Long-form features and editorial articles on ${SITE_NAME}.`,
  path: "/articles",
});

function formatArticleDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function ArticlesPage() {
  return (
    <main className={layoutStyles.content}>
      <h1 className={styles.pageTitle}>Articles</h1>
      <p className={styles.pageIntro}>
        GoalCurrent editorial features and long-form football stories.
      </p>

      {EDITORIAL_ARTICLES.length === 0 ? (
        <p className={styles.pageIntro}>No articles published yet.</p>
      ) : (
        <ul className={styles.grid}>
          {EDITORIAL_ARTICLES.map((article) => (
            <li key={article.slug}>
              <Link href={article.path} className={styles.card}>
                <div className={styles.cardBody}>
                  <span className={`${styles.cardTag} ${styles.tagFEATURE}`}>Feature</span>
                  <div className={styles.cardTitle}>{article.title}</div>
                  <div className={styles.cardMeta}>{formatArticleDate(article.publishedAt)}</div>
                  {article.excerpt ? (
                    <p className={styles.cardExcerpt}>{article.excerpt}</p>
                  ) : null}
                  <div className={styles.cardSource}>GoalCurrent Editorial</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

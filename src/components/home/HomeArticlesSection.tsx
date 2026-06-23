"use client";

import Link from "next/link";
import { ARTICLE_INDEX, articleHref } from "@/data/articles";
import styles from "@/app/page.module.css";

const HOME_ARTICLE_LIMIT = 3;

export default function HomeArticlesSection() {
  const articles = ARTICLE_INDEX.slice(0, HOME_ARTICLE_LIMIT);

  return (
    <section className={styles.sectionBlock} aria-labelledby="home-articles-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <span className={styles.sectionBar} aria-hidden="true" />
          <h2 id="home-articles-heading" className={styles.sectionTitle}>
            Articles
          </h2>
        </div>
        <Link href="/articles" className={styles.sectionLink}>
          View All →
        </Link>
      </div>

      <div className={styles.articlesHomeGrid}>
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={articleHref(article.slug)}
            className={styles.articlesHomeCard}
          >
            <span className={styles.articlesHomePill}>{article.category}</span>
            <h3 className={styles.articlesHomeTitle}>{article.title}</h3>
            <p className={styles.articlesHomeExcerpt}>{article.excerpt}</p>
            <span className={styles.articlesHomeRead}>Read article →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

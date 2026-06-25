"use client";

import Link from "next/link";
import { useMemo } from "react";
import { formatNewsRelativeTime } from "@/lib/news-format";
import { useNewsFeed } from "@/lib/use-news-feed";
import type { NewsArticle } from "@/types/news";
import styles from "@/app/[locale]/page.module.css";

const HOME_NEWS_LIMIT = 6;

function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}

function newsBandClass(tag: NewsArticle["tag"]): string {
  if (tag === "FEATURE") {
    return `${styles.newsBand} ${styles.newsBandEditorial}`;
  }
  return `${styles.newsBand} ${styles.newsBandWc}`;
}

function NewsCard({ article }: { article: NewsArticle }) {
  const content = (
    <>
      <div className={newsBandClass(article.tag)}>
        {article.tag === "FEATURE" ? (
          <span className={styles.newsBandTag}>Feature</span>
        ) : (
          <span className={styles.newsBandTag}>{article.tag}</span>
        )}
      </div>
      <div className={styles.newsBody}>
        <div className={styles.newsCategory}>
          {article.source}
          {article.date ? (
            <>
              {" "}
              · <time dateTime={article.date}>{formatNewsRelativeTime(article.date)}</time>
            </>
          ) : null}
        </div>
        <div className={styles.newsHeadline}>{article.title}</div>
      </div>
    </>
  );

  if (isExternalLink(article.link)) {
    return (
      <a
        href={article.link}
        className={styles.newsItem}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={article.link} className={styles.newsItem}>
      {content}
    </Link>
  );
}

function NewsSkeleton() {
  return (
    <div className={styles.newsGrid} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={`${styles.newsItem} ${styles.newsSkeleton}`}>
          <div className={styles.newsSkeletonBand} />
          <div className={styles.newsSkeletonBody}>
            <div className={styles.newsSkeletonLine} />
            <div className={`${styles.newsSkeletonLine} ${styles.newsSkeletonLineShort}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomeNewsSection() {
  const { articles, loading } = useNewsFeed();
  const latest = useMemo(() => articles.slice(0, HOME_NEWS_LIMIT), [articles]);

  return (
    <section className={styles.sectionBlock} aria-labelledby="home-news-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <span className={styles.sectionBar} aria-hidden="true" />
          <h2 id="home-news-heading" className={styles.sectionTitle}>
            Latest News
          </h2>
        </div>
        <Link href="/news" className={styles.sectionLink}>
          View All →
        </Link>
      </div>

      {loading ? (
        <NewsSkeleton />
      ) : latest.length === 0 ? (
        <p className={styles.columnEmpty}>
          No headlines available right now. Check back soon or visit the{" "}
          <Link href="/news">news hub</Link>.
        </p>
      ) : (
        <div className={styles.newsGrid}>
          {latest.map((article) => (
            <NewsCard key={`${article.link}-${article.title}`} article={article} />
          ))}
        </div>
      )}
    </section>
  );
}

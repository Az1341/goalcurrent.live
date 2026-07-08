"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";
import Link from "next/link";
import { formatNewsRelativeTime } from "@/lib/news-format";
import { useNewsFeed } from "@/lib/use-news-feed";
import type { NewsArticle } from "@/types/news";
import styles from "../home-v5.module.css";

function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}

function NewsLink({
  article,
  className,
  children,
}: {
  article: NewsArticle;
  className: string;
  children: React.ReactNode;
}) {
  if (isExternalLink(article.link)) {
    return (
      <a
        href={article.link}
        className={className}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={article.link} className={className}>
      {children}
    </Link>
  );
}

export default function HomeLatestNews() {
  const { articles, loading } = useNewsFeed();
  const [featured, ...rest] = useMemo(
    () => articles.slice(0, 4),
    [articles],
  );

  if (loading && !featured) {
    return (
      <section className={styles.section} aria-labelledby="home-news-heading">
        <h2 id="home-news-heading" className={styles.sectionTitle}>
          Latest News
        </h2>
        <div className={`${styles.skeleton} animate-skeleton-shimmer`} />
      </section>
    );
  }

  if (!featured) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="home-news-heading">
      <div className={styles.sectionHeader}>
        <h2 id="home-news-heading" className={styles.sectionTitle}>
          Latest News
        </h2>
        <Link href="/news" className={styles.sectionLink}>
          View all →
        </Link>
      </div>
      <div className={styles.newsLayout}>
        <NewsLink article={featured} className={styles.newsFeatured}>
          {featured.image ? (
            <div className={styles.newsFeaturedImage}>
              <img src={featured.image} alt="" loading="lazy" />
            </div>
          ) : (
            <div className={styles.newsFeaturedImage} aria-hidden="true" />
          )}
          <div className={styles.newsFeaturedBody}>
            <span className={styles.newsTag}>{featured.tag}</span>
            <h3 className={styles.newsHeadline}>{featured.title}</h3>
            {featured.date ? (
              <p className={styles.newsMeta}>
                <time dateTime={featured.date}>
                  {formatNewsRelativeTime(featured.date)}
                </time>
              </p>
            ) : null}
          </div>
        </NewsLink>

        <div className={styles.newsSecondaryList}>
          {rest.map((article) => (
            <NewsLink
              key={`${article.link}-${article.title}`}
              article={article}
              className={styles.newsSecondaryRow}
            >
              {article.image ? (
                <div className={styles.newsThumb}>
                  <img src={article.image} alt="" loading="lazy" />
                </div>
              ) : (
                <div className={styles.newsThumb} aria-hidden="true" />
              )}
              <div className={styles.newsSecondaryBody}>
                <span className={styles.newsTag}>{article.tag}</span>
                <p className={styles.newsSecondaryHeadline}>{article.title}</p>
                {article.date ? (
                  <p className={styles.newsMeta}>
                    <time dateTime={article.date}>
                      {formatNewsRelativeTime(article.date)}
                    </time>
                  </p>
                ) : null}
              </div>
            </NewsLink>
          ))}
        </div>
      </div>
    </section>
  );
}

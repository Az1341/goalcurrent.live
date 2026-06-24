"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import RemoteImage from "@/components/ui/RemoteImage";
import { NEWS_FALLBACK_ARTICLES } from "@/components/news/news-fallback";
import type { NewsArticle, NewsApiResponse, NewsTag } from "@/types/news";
import { mergeEditorialFirst } from "@/lib/editorial-news";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./news.module.css";

const REFRESH_MS = 3_600_000;

function formatNewsDate(iso: string): string {
  try {
    const date = new Date(iso);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function tagClassName(tag: NewsTag): string {
  return `${styles.cardTag} ${styles[`tag${tag}`]}`;
}

function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}

type ArticleLinkProps = {
  article: NewsArticle;
  className: string;
  children: React.ReactNode;
};

function ArticleLink({ article, className, children }: ArticleLinkProps) {
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

function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
    <ArticleLink article={article} className={styles.featured}>
      <span className={styles.featuredTag}>{article.tag}</span>
      <div className={styles.featuredTitle}>{article.title}</div>
      <div className={styles.featuredMeta}>
        {formatNewsDate(article.date)} · {article.source}
      </div>
      {article.excerpt ? (
        <p className={styles.featuredExcerpt}>{article.excerpt}</p>
      ) : null}
      <div className={styles.featuredSource}>
        {isExternalLink(article.link)
          ? `Source: ${article.source} · Read full article →`
          : `${article.source} · View on ${SITE_NAME} →`}
      </div>
    </ArticleLink>
  );
}

function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <ArticleLink article={article} className={styles.card}>
      <div className={styles.cardImageWrap}>
        {article.image ? (
          <RemoteImage
            src={article.image}
            alt=""
            width={400}
            height={150}
            sizes="(max-width: 768px) 100vw, 400px"
            className={styles.cardImage}
          />
        ) : (
          <span aria-hidden="true">📰</span>
        )}
      </div>
      <div className={styles.cardBody}>
        <span className={tagClassName(article.tag)}>{article.tag}</span>
        <div className={styles.cardTitle}>{article.title}</div>
        <div className={styles.cardMeta}>{formatNewsDate(article.date)}</div>
        {article.excerpt ? (
          <p className={styles.cardExcerpt}>{article.excerpt}</p>
        ) : null}
        <div className={styles.cardSource}>{article.source}</div>
      </div>
    </ArticleLink>
  );
}

function LoadingSkeleton() {
  return (
    <div className={styles.skeletonGrid} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className={styles.skeleton}>
          <div className={`${styles.skLine} ${styles.skLineLong}`} />
          <div className={`${styles.skLine} ${styles.skLineMedium}`} />
          <div className={`${styles.skLine} ${styles.skLineShort}`} />
        </div>
      ))}
    </div>
  );
}

export default function NewsHub() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [updatedLabel, setUpdatedLabel] = useState("Loading…");

  const loadNews = useCallback(async () => {
    try {
      const response = await fetch("/api/news", { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`News API ${response.status}`);
      }

      const data = (await response.json()) as NewsApiResponse;
      if (!data.articles.length) {
        throw new Error("No articles");
      }

      setArticles(mergeEditorialFirst(data.articles));
      setSources(data.sources);
      setUsingFallback(false);
      setUpdatedLabel(
        `Updated: ${new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        })} · ${data.sources.join(" + ") || "BBC Sport + ESPN"}`,
      );
    } catch {
      setArticles(mergeEditorialFirst([...NEWS_FALLBACK_ARTICLES]));
      setSources([SITE_NAME]);
      setUsingFallback(true);
      setUpdatedLabel("Showing fallback news · Live feed updating…");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => void loadNews());
    const timer = window.setInterval(() => {
      void loadNews();
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [loadNews]);

  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <main className={styles.content}>
      <h1 className={styles.pageTitle}>
        Latest <span>Football News</span>
      </h1>
      <p className={styles.pageIntro}>
        World Cup 2026 and football headlines from BBC Sport and ESPN — filtered
        for tournament relevance and refreshed hourly.
      </p>

      <div className={styles.sourceBar}>
        <span className={`${styles.sourceTag} ${styles.sourceTagBbc}`}>
          BBC Sport
        </span>
        <span className={`${styles.sourceTag} ${styles.sourceTagEspn}`}>
          ESPN
        </span>
        <span className={styles.sourceTag}>Live RSS feed</span>
        <span className={styles.sourceUpdated}>{updatedLabel}</span>
      </div>

      {/* GoalCurrent Editorial Articles Banner */}
      <Link href="/articles" style={{
        display: "block",
        background: "linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(16,185,129,0.06) 100%)",
        border: "1px solid rgba(37,99,235,0.18)",
        borderRadius: 12,
        padding: "14px 18px",
        marginBottom: 20,
        textDecoration: "none",
        color: "inherit",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>
              ✍️ GoalCurrent Editorial
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>
              Original articles, analysis & World Cup 2026 guides
            </div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
              10 exclusive articles — World Cup groups, Premier League review, UCL Final & more
            </div>
          </div>
          <div style={{ fontSize: 20, flexShrink: 0 }}>→</div>
        </div>
      </Link>

      {loading ? <LoadingSkeleton /> : null}

      {!loading && featured ? <FeaturedArticle article={featured} /> : null}

      {!loading ? (
        <>
          {usingFallback ? (
            <p className={styles.fallbackNote}>
              Live news feed temporarily unavailable — showing {SITE_NAME}
              fallback stories.
            </p>
          ) : null}
          <div className={styles.sectionLabel}>Latest World Cup 2026 News</div>
          <div className={styles.grid}>
            {rest.map((article) => (
              <NewsCard
                key={`${article.link}-${article.title}`}
                article={article}
              />
            ))}
          </div>
          {!usingFallback && sources.length > 0 ? (
            <p className={styles.fallbackNote}>
              Sources: {sources.join(", ")}
            </p>
          ) : null}
        </>
      ) : null}

      <p className={styles.hubBack}>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

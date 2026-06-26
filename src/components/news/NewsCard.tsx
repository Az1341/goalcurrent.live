import Link from "next/link";
import CardMedia from "@/components/ui/CardMedia";
import type { NewsArticle, NewsTag } from "@/types/news";
import styles from "./news.module.css";

export function formatNewsDate(iso: string): string {
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

export function tagClassName(tag: NewsTag): string {
  return `${styles.cardTag} ${styles[`tag${tag}`]}`;
}

export function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}

type ArticleLinkProps = {
  article: NewsArticle;
  className: string;
  children: React.ReactNode;
};

export function ArticleLink({ article, className, children }: ArticleLinkProps) {
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

export function FeaturedArticle({ article }: { article: NewsArticle }) {
  return (
    <ArticleLink article={article} className={styles.featured}>
      <div className={styles.featuredImageWrap}>
        <CardMedia
          src={article.image}
          alt=""
          width={800}
          height={280}
          sizes="(max-width: 768px) 100vw, 800px"
          className={styles.featuredImage}
        />
      </div>
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
          ? `Source: ${article.source} · Read full article ->`
          : `${article.source} · View on GoalCurrent.live ->`}
      </div>
    </ArticleLink>
  );
}

export default function NewsCard({ article }: { article: NewsArticle }) {
  return (
    <ArticleLink article={article} className={styles.card}>
      <div className={styles.cardImageWrap}>
        <CardMedia
          src={article.image}
          alt=""
          width={400}
          height={150}
          sizes="(max-width: 768px) 100vw, 400px"
          className={styles.cardImage}
        />
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

import Link from "next/link";
import RemoteImage from "@/components/ui/RemoteImage";
import type { NewsArticle, NewsTag } from "@/types/news";
import styles from "./news.module.css";

function formatNewsDate(iso: string): string {
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

function tagClassName(tag: NewsTag): string {
  return `${styles.cardTag} ${styles[`tag${tag}`]}`;
}

function isExternalLink(link: string): boolean {
  return link.startsWith("http://") || link.startsWith("https://");
}

type NewsArticleCardProps = {
  article: NewsArticle;
};

export default function NewsArticleCard({ article }: NewsArticleCardProps) {
  const content = (
    <>
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
    </>
  );

  if (isExternalLink(article.link)) {
    return (
      <a
        href={article.link}
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={article.link} className={styles.card}>
      {content}
    </Link>
  );
}

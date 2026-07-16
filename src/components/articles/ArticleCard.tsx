import Image from "next/image";
import type { ContentItem } from "@/content/types";
import { isArticleCardImageUnoptimized } from "@/lib/article-hub";
import { withSvgMediaClass } from "@/lib/images";
import styles from "@/app/[locale]/articles/article.module.css";

type ArticleCardProps = {
  article: ContentItem;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const image = article.thumbnail ?? "/images/football-hero-bg.jpg";
  const isExternal = article.url.startsWith("http");

  const card = (
    <>
      <div
        className={withSvgMediaClass(
          image,
          styles.articleIndexImageWrap,
          styles.articleIndexImageWrapSvg,
        )}
      >
        <Image
          src={image}
          alt=""
          width={640}
          height={360}
          sizes="(max-width: 768px) 100vw, 400px"
          className={withSvgMediaClass(
            image,
            styles.articleIndexImage,
            styles.articleIndexImageSvg,
          )}
          unoptimized={isArticleCardImageUnoptimized(image)}
        />
      </div>
      <span className={styles.pill}>{article.source}</span>
      <h2>{article.title}</h2>
      <p>{article.description}</p>
      <span className={styles.readMore}>
        {isExternal ? "Read article" : "Read article ->"}
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={article.url}
        className={styles.articleIndexCard}
        target="_blank"
        rel="noopener noreferrer nofollow"
      >
        {card}
      </a>
    );
  }

  return (
    <a href={article.url} className={styles.articleIndexCard}>
      {card}
    </a>
  );
}

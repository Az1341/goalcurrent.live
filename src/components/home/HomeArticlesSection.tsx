"use client";

import Image from "next/image";
import Link from "next/link";
import { getArticleCardImage, getHomepageArticles } from "@/lib/article-hub";
import { articleHref } from "@/data/articles";
import styles from "@/app/page.module.css";

export default function HomeArticlesSection() {
  const articles = getHomepageArticles(3);

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
        {articles.map((article) => {
          const image = getArticleCardImage(article.slug);
          return (
            <Link
              key={article.slug}
              href={articleHref(article.slug)}
              className={styles.articlesHomeCard}
            >
              {image ? (
                <div className={styles.articlesHomeImageWrap}>
                  <Image
                    src={image}
                    alt=""
                    width={640}
                    height={200}
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className={styles.articlesHomeImage}
                  />
                </div>
              ) : null}
              <span className={styles.articlesHomePill}>{article.category}</span>
              <h3 className={styles.articlesHomeTitle}>{article.title}</h3>
              <p className={styles.articlesHomeExcerpt}>{article.excerpt}</p>
              <span className={styles.articlesHomeRead}>Read article →</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

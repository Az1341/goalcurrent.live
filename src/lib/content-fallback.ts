import { NEWS_FALLBACK_ARTICLES } from "@/components/news/news-fallback";
import type { NewsArticle } from "@/types/news";

const DEFAULT_NEWS_IMAGE = "/images/football-hero-bg.jpg";

export function withNewsFallback(articles: readonly NewsArticle[]): NewsArticle[] {
  const withImages = articles.map((article) => ({
    ...article,
    image: article.image ?? DEFAULT_NEWS_IMAGE,
  }));

  if (withImages.length > 0) {
    return withImages;
  }

  return NEWS_FALLBACK_ARTICLES.map((article) => ({
    ...article,
    image: article.image ?? DEFAULT_NEWS_IMAGE,
  }));
}
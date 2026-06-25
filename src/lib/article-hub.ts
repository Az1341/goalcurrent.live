import { ARTICLE_INDEX, articleHref, type ArticleIndexEntry } from "@/data/articles";
import { EDITORIAL_ARTICLES } from "@/data/editorial";
import { EDITORIAL_SOURCE_LABEL } from "@/lib/seo/constants";
import { toIsoDate } from "@/lib/seo/dates";
import type { NewsArticle } from "@/types/news";

/** Card / news hub images for editorial articles (local paths). */
export const ARTICLE_CARD_IMAGES: Record<string, string> = {
  "world-cup-2026-june-22-recap": "/images/football-hero-bg.jpg",
  "world-cup-2026-june-23-recap": "/images/football-hero-bg.jpg",
  "fifa-world-cup-2026-head-to-head-rule-early-elimination":
    "/images/news/fifa-world-cup-2026-head-to-head-rule-early-elimination/hero.svg",
};

export function getArticleCardImage(slug: string): string | undefined {
  return ARTICLE_CARD_IMAGES[slug];
}

export function getEditorialNewsArticles(): NewsArticle[] {
  return EDITORIAL_ARTICLES.map((article) => ({
    title: article.title,
    link: article.path,
    excerpt: article.excerpt,
    date: article.publishedAt,
    source: EDITORIAL_SOURCE_LABEL,
    tag: "FEATURE" as const,
    image: getArticleCardImage(
      article.path.replace(/^\/articles\//, "").replace(/\/$/, ""),
    ),
  }));
}

export function getLatestMatchRecap(): ArticleIndexEntry | undefined {
  const recaps = ARTICLE_INDEX.filter((entry) => entry.category === "Match Recap");
  return recaps.length > 0 ? recaps[recaps.length - 1] : undefined;
}

/** Latest match recap first, then other index articles. */
export function getHomepageArticles(limit = 3): ArticleIndexEntry[] {
  const latestRecap = getLatestMatchRecap();
  if (!latestRecap) {
    return [...ARTICLE_INDEX].slice(0, limit);
  }

  const rest = ARTICLE_INDEX.filter((entry) => entry.slug !== latestRecap.slug);
  return [latestRecap, ...rest].slice(0, limit);
}

export function getMatchRecapNewsArticles(): NewsArticle[] {
  return [...ARTICLE_INDEX]
    .filter((entry) => entry.category === "Match Recap")
    .reverse()
    .map((article) => ({
      title: article.title,
      link: articleHref(article.slug),
      excerpt: article.excerpt,
      date: toIsoDate(article.date),
      source: EDITORIAL_SOURCE_LABEL,
      tag: "RESULT" as const,
      image: getArticleCardImage(article.slug),
    }));
}
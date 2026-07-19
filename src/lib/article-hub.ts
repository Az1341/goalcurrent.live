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
  "morocco-knock-out-netherlands-on-penalties":
    "/images/news/morocco-knock-out-netherlands-on-penalties/hero.svg",
  "world-cup-2026-june-30-recap":
    "/images/news/world-cup-2026-june-30-recap/hero.svg",
  "premier-league-2026-27-august-countdown":
    "/images/news/premier-league-2026-27-august-countdown/hero.svg",
  "world-cup-2026-july-1-recap":
    "/images/news/world-cup-2026-july-1-recap/hero.svg",
  "england-advance-to-face-mexico-round-of-16":
    "/images/news/england-advance-to-face-mexico-round-of-16/hero.svg",
  "world-cup-2026-july-3-recap":
    "/images/news/world-cup-2026-july-3-recap/hero.svg",
  "england-argentina-world-cup-semifinal-analysis":
    "/images/news/england-argentina-world-cup-semifinal-analysis/hero.svg",
  "england-france-third-place-preview":
    "/images/news/england-france-third-place-preview/hero.svg",
  "england-6-4-france-third-place-recap":
    "/images/news/england-6-4-france-third-place-recap/hero.jpg",
  "spain-world-cup-2026-champion-masterclass":
    "/images/news/spain-world-cup-2026-champion-masterclass/hero.svg",
};

const DEFAULT_ARTICLE_CARD_IMAGE = "/images/football-hero-bg.jpg";

export function getArticleCardImage(slug: string): string {
  return ARTICLE_CARD_IMAGES[slug] ?? DEFAULT_ARTICLE_CARD_IMAGE;
}

/** SVG card art must bypass the Next.js image optimizer (same as article pages). */
export function isArticleCardImageUnoptimized(src: string): boolean {
  return src.endsWith(".svg");
}

export function getEditorialNewsArticles(): NewsArticle[] {
  return EDITORIAL_ARTICLES.map((article) => ({
    title: article.title,
    link: article.path,
    excerpt: article.excerpt,
    date: article.publishedAt,
    source: EDITORIAL_SOURCE_LABEL,
    tag: "FEATURE" as const,
    image: getArticleCardImage(article.slug),
  }));
}

function newsTagFromIndexCategory(category: string): NewsArticle["tag"] {
  if (category === "Match Recap" || category === "Match Report") {
    return "RESULT";
  }
  if (category === "Preview") {
    return "PREVIEW";
  }
  return "FEATURE";
}

function articleIndexEntryToNewsArticle(entry: ArticleIndexEntry): NewsArticle {
  return {
    title: entry.title,
    link: entry.href ?? articleHref(entry.slug),
    excerpt: entry.excerpt,
    date: toIsoDate(entry.date),
    source: EDITORIAL_SOURCE_LABEL,
    tag: newsTagFromIndexCategory(entry.category),
    image: getArticleCardImage(entry.slug),
  };
}

function sortNewsByDateDesc(articles: readonly NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

/** All GoalCurrent articles from ARTICLE_INDEX as news cards, newest first. */
export function getArticleIndexNewsArticles(): NewsArticle[] {
  return sortNewsByDateDesc(
    [...ARTICLE_INDEX].map((entry) => articleIndexEntryToNewsArticle(entry)),
  );
}

/** GoalCurrent editorial + index articles for news feeds — pinned above partner RSS. */
export function getPinnedGoalCurrentNewsArticles(): NewsArticle[] {
  const seen = new Set<string>();
  const merged: NewsArticle[] = [];

  for (const article of [
    ...getArticleIndexNewsArticles(),
    ...getEditorialNewsArticles(),
  ]) {
    if (seen.has(article.link)) {
      continue;
    }
    seen.add(article.link);
    merged.push(article);
  }

  return sortNewsByDateDesc(merged);
}

export function getLatestMatchRecap(): ArticleIndexEntry | undefined {
  const recaps = ARTICLE_INDEX.filter((entry) => entry.category === "Match Recap");
  return recaps.length > 0 ? recaps[recaps.length - 1] : undefined;
}

/** Newest GoalCurrent articles first for the homepage grid. */
export function getHomepageArticles(limit = 3): ArticleIndexEntry[] {
  return [...ARTICLE_INDEX]
    .sort((a, b) => toIsoDate(b.date).localeCompare(toIsoDate(a.date)))
    .slice(0, limit);
}

export function getMatchRecapNewsArticles(): NewsArticle[] {
  return sortNewsByDateDesc(
    ARTICLE_INDEX.filter((entry) => entry.category === "Match Recap").map((entry) =>
      articleIndexEntryToNewsArticle(entry),
    ),
  );
}
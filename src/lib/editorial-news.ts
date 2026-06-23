import { EDITORIAL_ARTICLES } from "@/data/editorial";
import type { NewsArticle } from "@/types/news";

export function getEditorialNewsArticles(): NewsArticle[] {
  return EDITORIAL_ARTICLES.map((article) => ({
    title: article.title,
    link: article.path,
    excerpt: article.excerpt,
    date: article.publishedAt,
    source: "GoalCurrent Editorial",
    tag: "FEATURE",
  }));
}

/** Editorial features pinned ahead of RSS headlines; duplicates removed by link. */
export function mergeEditorialFirst(articles: readonly NewsArticle[]): NewsArticle[] {
  const editorial = getEditorialNewsArticles();
  const editorialLinks = new Set(editorial.map((item) => item.link));
  const rest = articles.filter((item) => !editorialLinks.has(item.link));
  return [...editorial, ...rest];
}

import { getEditorialNewsArticles, getMatchRecapNewsArticles } from "@/lib/article-hub";
import type { NewsArticle } from "@/types/news";

export { getEditorialNewsArticles } from "@/lib/article-hub";

/** Editorial features pinned ahead of RSS headlines; duplicates removed by link. */
export function mergeEditorialFirst(articles: readonly NewsArticle[]): NewsArticle[] {
  const editorial = getEditorialNewsArticles();
  const editorialLinks = new Set(editorial.map((item) => item.link));
  const rest = articles.filter((item) => !editorialLinks.has(item.link));
  return [...editorial, ...rest];
}

/** Match recaps + editorial pinned ahead of World Cup RSS headlines. */
export function mergeWc26NewsFeed(articles: readonly NewsArticle[]): NewsArticle[] {
  const pinned = [...getMatchRecapNewsArticles(), ...getEditorialNewsArticles()];
  const pinnedLinks = new Set(pinned.map((item) => item.link));
  const rest = articles.filter((item) => !pinnedLinks.has(item.link));
  return [...pinned, ...rest];
}

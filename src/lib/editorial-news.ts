import { getEditorialNewsArticles, getMatchRecapNewsArticles } from "@/lib/article-hub";
import type { NewsArticle } from "@/types/news";

export { getEditorialNewsArticles } from "@/lib/article-hub";

function newsSortKey(article: NewsArticle): number {
  const parsed = Date.parse(article.date);
  return Number.isFinite(parsed) ? parsed : 0;
}

/** Merge editorial + RSS, dedupe by link, newest first. */
export function mergeEditorialFirst(articles: readonly NewsArticle[]): NewsArticle[] {
  const editorial = getEditorialNewsArticles();
  const editorialLinks = new Set(editorial.map((item) => item.link));
  const rest = articles.filter((item) => !editorialLinks.has(item.link));
  return [...editorial, ...rest].sort(
    (a, b) => newsSortKey(b) - newsSortKey(a),
  );
}

/** Match recaps + editorial merged with World Cup RSS — newest first. */
export function mergeWc26NewsFeed(articles: readonly NewsArticle[]): NewsArticle[] {
  const pinned = [...getMatchRecapNewsArticles(), ...getEditorialNewsArticles()];
  const pinnedLinks = new Set(pinned.map((item) => item.link));
  const rest = articles.filter((item) => !pinnedLinks.has(item.link));
  return [...pinned, ...rest].sort(
    (a, b) => newsSortKey(b) - newsSortKey(a),
  );
}

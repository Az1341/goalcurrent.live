import {
  getArticleIndexNewsArticles,
  getEditorialNewsArticles,
  getPinnedGoalCurrentNewsArticles,
} from "@/lib/article-hub";
import type { NewsArticle } from "@/types/news";

export { getEditorialNewsArticles } from "@/lib/article-hub";

function newsSortKey(article: NewsArticle): number {
  const parsed = Date.parse(article.date);
  return Number.isFinite(parsed) ? parsed : 0;
}

function sortNewsByDateDesc(articles: readonly NewsArticle[]): NewsArticle[] {
  return [...articles].sort((a, b) => newsSortKey(b) - newsSortKey(a));
}

/** Partner RSS only — sorted newest first. */
export function sortPartnerNewsFeed(articles: readonly NewsArticle[]): NewsArticle[] {
  return sortNewsByDateDesc(articles);
}

/** Homepage: latest GoalCurrent article first, then partner RSS (deduped). */
export function mergeHomepageNewsFeed(articles: readonly NewsArticle[]): NewsArticle[] {
  const [latestEditorial] = getArticleIndexNewsArticles();
  if (!latestEditorial) {
    return sortNewsByDateDesc(articles);
  }

  const pinnedLinks = new Set([latestEditorial.link]);
  const rest = sortNewsByDateDesc(
    articles.filter((item) => !pinnedLinks.has(item.link)),
  );
  return [latestEditorial, ...rest];
}

/** GoalCurrent articles stay first; partner RSS follows, each block sorted by date. */
export function mergeEditorialFirst(articles: readonly NewsArticle[]): NewsArticle[] {
  const pinned = getPinnedGoalCurrentNewsArticles();
  const pinnedLinks = new Set(pinned.map((item) => item.link));
  const rest = sortNewsByDateDesc(
    articles.filter((item) => !pinnedLinks.has(item.link)),
  );
  return [...pinned, ...rest];
}

/** World Cup news — GoalCurrent articles pinned above partner RSS. */
export function mergeWc26NewsFeed(articles: readonly NewsArticle[]): NewsArticle[] {
  const pinned = getPinnedGoalCurrentNewsArticles().filter(
    (item) => !item.link.includes("/premier-league-2026-27-august-countdown"),
  );
  const pinnedLinks = new Set(pinned.map((item) => item.link));
  const rest = sortNewsByDateDesc(
    articles.filter((item) => !pinnedLinks.has(item.link)),
  );
  return [...pinned, ...rest];
}

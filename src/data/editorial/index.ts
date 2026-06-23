import type { EditorialArticle } from "@/types/editorial";
import { BEIRANVAND_FEATURE } from "./beiranvand-feature";

export const EDITORIAL_ARTICLES: readonly EditorialArticle[] = [
  BEIRANVAND_FEATURE,
];

export function getEditorialArticleBySlug(
  slug: string,
): EditorialArticle | undefined {
  return EDITORIAL_ARTICLES.find((article) => article.slug === slug);
}

export function getEditorialArticleByPath(
  path: string,
): EditorialArticle | undefined {
  return EDITORIAL_ARTICLES.find((article) => article.path === path);
}

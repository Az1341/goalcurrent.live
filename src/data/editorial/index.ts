import type { EditorialArticle } from "@/types/editorial";
import { BEIRANVAND_FEATURE } from "./beiranvand-feature";
import { MOROCCO_NETHERLANDS_PENALTIES } from "./morocco-netherlands-penalties";

export const EDITORIAL_ARTICLES: readonly EditorialArticle[] = [
  MOROCCO_NETHERLANDS_PENALTIES,
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

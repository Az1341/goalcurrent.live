import type { Metadata } from "next";
import EditorialArticleView from "@/components/news/EditorialArticleView";
import { BEIRANVAND_FEATURE } from "@/data/editorial/beiranvand-feature";
import { buildArticleMetadata } from "@/lib/page-metadata";

const article = BEIRANVAND_FEATURE;

export const metadata: Metadata = buildArticleMetadata({
  title: article.title,
  description: article.description,
  path: article.path,
  keywords: article.keywords,
  publishedTime: article.publishedAt,
});

export default function BeiranvandFeaturePage() {
  return <EditorialArticleView article={article} />;
}

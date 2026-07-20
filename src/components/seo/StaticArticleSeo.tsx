import type { Metadata } from "next";
import ArticleSeo from "@/components/seo/ArticleSeo";
import ArticleViewTracker from "@/components/analytics/ArticleViewTracker";
import { ARTICLE_INDEX } from "@/data/articles";
import {
  articleBreadcrumbs,
  articleSeoFromSlug,
  buildStaticArticleMetadata,
} from "@/lib/seo/article-seo";
import { EDITORIAL_SOURCE_LABEL } from "@/lib/seo/constants";

type StaticArticleSeoProps = {
  slug: string;
  children: React.ReactNode;
};

export function staticArticleMetadata(slug: string): Metadata {
  return buildStaticArticleMetadata(slug);
}

export async function StaticArticleSeo({ slug, children }: StaticArticleSeoProps) {
  const seo = articleSeoFromSlug(slug);
  if (!seo) {
    return <>{children}</>;
  }

  const indexEntry = ARTICLE_INDEX.find((entry) => entry.slug === slug);
  const category = indexEntry?.category ?? "editorial";

  return (
    <>
      <ArticleViewTracker
        articleId={slug}
        slug={slug}
        category={category}
        author={seo.author ?? EDITORIAL_SOURCE_LABEL}
      />
      <ArticleSeo
        article={seo}
        breadcrumbs={articleBreadcrumbs(slug, seo.headline)}
      />
      {children}
    </>
  );
}

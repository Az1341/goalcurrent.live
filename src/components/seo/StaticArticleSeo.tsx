import type { Metadata } from "next";
import type { ReactNode } from "react";
import ArticleSeo from "@/components/seo/ArticleSeo";
import {
  articleBreadcrumbs,
  articleSeoFromSlug,
  buildStaticArticleMetadata,
} from "@/lib/seo/article-seo";

type StaticArticleSeoProps = {
  slug: string;
  children: React.ReactNode;
};

export function staticArticleMetadata(slug: string): Metadata {
  return buildStaticArticleMetadata(slug);
}

export function StaticArticleSeo({ slug, children }: StaticArticleSeoProps) {
  const seo = articleSeoFromSlug(slug);
  if (!seo) {
    return <>{children}</>;
  }

  return (
    <>
      <ArticleSeo
        article={seo}
        breadcrumbs={articleBreadcrumbs(slug, seo.headline)}
      />
      {children}
    </>
  );
}

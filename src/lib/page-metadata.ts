import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Bypass root layout title template (homepage only). */
  absoluteTitle?: boolean;
};

/** Shared metadata helper — title template applied by root layout. */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

type ArticleMetadataInput = PageMetadataInput & {
  keywords?: string[];
  publishedTime?: string;
  authors?: string[];
};

/** Long-form editorial article metadata. */
export function buildArticleMetadata({
  title,
  description,
  path,
  keywords = [],
  publishedTime,
  authors = ["GoalCurrent Editorial"],
  absoluteTitle = true,
}: ArticleMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime,
      authors,
    },
  };
}

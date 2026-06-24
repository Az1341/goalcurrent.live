import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
} from "@/lib/seo/constants";
import { absoluteUrl } from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Bypass root layout title template (homepage only). */
  absoluteTitle?: boolean;
  ogImage?: string;
  ogType?: "website" | "article";
};

type SocialMetadataInput = {
  title: string;
  description: string;
  url: string;
  ogType?: "website" | "article";
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

function buildSocialMetadata({
  title,
  description,
  url,
  ogType = "website",
  ogImage,
  publishedTime,
  modifiedTime,
  authors,
}: SocialMetadataInput): Pick<Metadata, "openGraph" | "twitter"> {
  const imageUrl = ogImage ?? absoluteUrl(DEFAULT_OG_IMAGE.url);

  return {
    openGraph: {
      title,
      description,
      url,
      type: ogType,
      images: [
        {
          url: imageUrl,
          width: DEFAULT_OG_IMAGE.width,
          height: DEFAULT_OG_IMAGE.height,
          alt: DEFAULT_OG_IMAGE.alt,
        },
      ],
      ...(ogType === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: DEFAULT_TWITTER_CARD,
      title,
      description,
      images: [imageUrl],
    },
  };
}

/** Shared metadata helper — title template applied by root layout. */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  ogImage,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const social = buildSocialMetadata({
    title,
    description,
    url,
    ogType,
    ogImage,
  });

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    ...social,
  };
}

type ArticleMetadataInput = PageMetadataInput & {
  keywords?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/** Long-form editorial article metadata. */
export function buildArticleMetadata({
  title,
  description,
  path,
  keywords = [],
  publishedTime,
  modifiedTime,
  authors = ["GoalCurrent Editorial"],
  absoluteTitle = true,
  ogImage,
}: ArticleMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const social = buildSocialMetadata({
    title,
    description,
    url,
    ogType: "article",
    ogImage,
    publishedTime,
    modifiedTime: modifiedTime ?? publishedTime,
    authors,
  });

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    ...social,
  };
}

type MatchMetadataInput = {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
};

export function buildMatchMetadata({
  title,
  description,
  path,
  ogImage,
}: MatchMetadataInput): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    ogImage,
    ogType: "website",
  });
}

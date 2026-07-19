import type { Metadata } from "next";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TWITTER_CARD,
  EDITORIAL_AUTHOR,
} from "@/lib/seo/constants";
import {
  buildHreflangAlternates,
  localizedUrl,
} from "@/lib/i18n/urls";
import { routing } from "@/i18n/routing";
import { absoluteUrl } from "@/lib/site-url";
import { normalizePageTitleText } from "@/lib/seo/canonical-titles";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: string;
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
  locale = routing.defaultLocale,
  absoluteTitle = false,
  ogImage,
  ogType = "website",
}: PageMetadataInput): Metadata {
  const normalizedTitle = normalizePageTitleText(title);
  const url = localizedUrl(path, locale);
  const social = buildSocialMetadata({
    title: normalizedTitle,
    description,
    url,
    ogType,
    ogImage,
  });

  return {
    title: absoluteTitle ? { absolute: normalizedTitle } : normalizedTitle,
    description,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(path),
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
  locale = routing.defaultLocale,
  keywords = [],
  publishedTime,
  modifiedTime,
  authors = [EDITORIAL_AUTHOR],
  absoluteTitle = true,
  ogImage,
}: ArticleMetadataInput): Metadata {
  const normalizedTitle = normalizePageTitleText(title);
  const url = localizedUrl(path, locale);
  const social = buildSocialMetadata({
    title: normalizedTitle,
    description,
    url,
    ogType: "article",
    ogImage,
    publishedTime,
    modifiedTime: modifiedTime ?? publishedTime,
    authors,
  });

  return {
    title: absoluteTitle ? { absolute: normalizedTitle } : normalizedTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
      languages: buildHreflangAlternates(path),
    },
    ...social,
  };
}

type MatchMetadataInput = {
  title: string;
  description: string;
  path: string;
  locale?: string;
  ogImage?: string;
};

export function buildMatchMetadata({
  title,
  description,
  path,
  locale,
  ogImage,
}: MatchMetadataInput): Metadata {
  return buildPageMetadata({
    title,
    description,
    path,
    locale,
    ogImage,
    ogType: "website",
  });
}

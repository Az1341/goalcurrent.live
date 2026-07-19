"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { trackArticleOpen } from "@/lib/analytics";

type ArticleViewTrackerProps = {
  articleId: string;
  slug: string;
  category: string;
  author: string;
  sourceSurface?: string;
};

export default function ArticleViewTracker({
  articleId,
  slug,
  category,
  author,
  sourceSurface = "article_page",
}: ArticleViewTrackerProps) {
  const locale = useLocale();
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackArticleOpen({
      article_id: articleId,
      article_slug: slug,
      article_category: category,
      author,
      language: locale,
      source_surface: sourceSurface,
    });
  }, [articleId, author, category, locale, slug, sourceSurface]);

  return null;
}

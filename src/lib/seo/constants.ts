import { absoluteUrl } from "@/lib/site-url";

export const DEFAULT_OG_IMAGE_ALT =
  "GoalCurrent FIFA World Cup 2026 on desktop";

export const DEFAULT_OG_IMAGE = {
  url: "/icons/screenshot-desktop.png",
  width: 1280,
  height: 720,
  alt: DEFAULT_OG_IMAGE_ALT,
} as const;

export const DEFAULT_TWITTER_CARD = "summary_large_image" as const;

export const EDITORIAL_AUTHOR = "GoalCurrent Editorial";
export const EDITORIAL_PUBLISHER = "GoalCurrent.live";

/** Google News sitemap publication block. */
export const NEWS_PUBLICATION_NAME = "GoalCurrent.live";
export const NEWS_PUBLICATION_LANGUAGE = "en";

export function defaultOgImageUrl(): string {
  return absoluteUrl(DEFAULT_OG_IMAGE.url);
}

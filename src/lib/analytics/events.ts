import { shouldSkipDuplicateEvent } from "@/lib/analytics/deduplication";
import { sendAnalyticsEvent } from "@/lib/analytics/transport";
import type {
  AffiliateClickParams,
  ArticleOpenParams,
  FavouriteAddParams,
  LanguageChangeParams,
  MatchOpenParams,
  SubscriptionCompleteParams,
  SubscriptionStartParams,
  VideoOpenParams,
} from "@/lib/analytics/schemas";

export function trackMatchOpen(params: MatchOpenParams): void {
  const key = `match_open:${params.match_id}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 60_000 })) return;
  sendAnalyticsEvent("match_open", params);
}

export function trackFavouriteAdd(params: FavouriteAddParams): void {
  const key = `favourite_add:${params.entity_type}:${params.entity_id}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 5_000 })) return;
  sendAnalyticsEvent("favourite_add", params);
}

export function trackSubscriptionStart(params: SubscriptionStartParams): void {
  const key = `subscription_start:${params.plan_id}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 86_400_000 })) return;
  sendAnalyticsEvent("subscription_start", params);
}

export function trackSubscriptionComplete(
  params: SubscriptionCompleteParams,
): void {
  const key = `subscription_complete:${params.transaction_id}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 86_400_000 * 7 })) return;
  sendAnalyticsEvent("subscription_complete", params);
}

export function trackAffiliateClick(params: AffiliateClickParams): void {
  const key = `affiliate_click:${params.partner_id}:${params.offer_id}:${params.destination_domain}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 2_000 })) return;
  sendAnalyticsEvent("affiliate_click", params);
}

export function trackArticleOpen(params: ArticleOpenParams): void {
  const key = `article_open:${params.article_slug}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 60_000 })) return;
  sendAnalyticsEvent("article_open", params);
}

export function trackVideoOpen(params: VideoOpenParams): void {
  const key = `video_open:${params.video_id}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 60_000 })) return;
  sendAnalyticsEvent("video_open", params);
}

export function trackLanguageChange(params: LanguageChangeParams): void {
  const key = `language_change:${params.previous_language}:${params.selected_language}`;
  if (shouldSkipDuplicateEvent(key, { ttlMs: 1_000 })) return;
  sendAnalyticsEvent("language_change", params);
}

export {
  GA_MEASUREMENT_ID,
  GA4_REFERRER_EXCLUSION_DOMAINS,
  PRODUCTION_ANALYTICS_HOSTS,
  isProductionAnalyticsHost,
  shouldEnableAnalytics,
} from "@/lib/analytics/config";

export {
  GA4_INTERNAL_TRAFFIC_TYPE,
  INTERNAL_TRAFFIC_DOCS,
  clearInternalTrafficFlag,
  isInternalTraffic,
  persistInternalTrafficFromSearch,
} from "@/lib/analytics/internal-traffic";

export {
  shouldSkipDuplicateEvent,
  resetDedupeKey,
} from "@/lib/analytics/deduplication";

export {
  validateEventParams,
  isInvalidAnalyticsPageTitle,
  type AnalyticsEventName,
  type MatchOpenParams,
  type FavouriteAddParams,
  type SubscriptionStartParams,
  type SubscriptionCompleteParams,
  type AffiliateClickParams,
  type ArticleOpenParams,
  type VideoOpenParams,
  type LanguageChangeParams,
} from "@/lib/analytics/schemas";

export { initGtag, sendAnalyticsEvent, sendPageView } from "@/lib/analytics/transport";

export {
  trackAffiliateClick,
  trackArticleOpen,
  trackFavouriteAdd,
  trackLanguageChange,
  trackMatchOpen,
  trackSubscriptionComplete,
  trackSubscriptionStart,
  trackVideoOpen,
} from "@/lib/analytics/events";

export {
  buildStableMatchTitle,
  isUnresolvedMatchParticipantLabel,
  normalizePageTitleText,
} from "@/lib/seo/canonical-titles";

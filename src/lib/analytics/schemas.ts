import { z } from "zod";

const piiPattern =
  /@[\w.-]+\.\w{2,}|\+?\d{10,}|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

const safeString = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .refine((value) => !piiPattern.test(value), {
    message: "PII-like value rejected",
  });

const optionalSafeString = safeString.optional();

const sourceSurface = safeString;
const language = z.string().trim().min(2).max(8);

function baseParams<T extends z.ZodRawShape>(shape: T) {
  return z.object(shape).strict();
}

export const matchOpenSchema = baseParams({
  match_id: safeString,
  competition: safeString,
  home_team: safeString,
  away_team: safeString,
  match_status: safeString,
  source_surface: sourceSurface,
  language,
});

export const favouriteAddSchema = baseParams({
  entity_type: z.enum(["team", "match", "competition"]),
  entity_id: safeString,
  entity_name: safeString,
  source_surface: sourceSurface,
  language,
});

export const subscriptionStartSchema = baseParams({
  plan_id: safeString,
  plan_name: safeString,
  billing_period: z.enum(["monthly", "yearly", "one_time", "unknown"]),
  currency: z.string().trim().length(3),
  value: z.number().finite().nonnegative(),
  source_surface: sourceSurface,
});

export const subscriptionCompleteSchema = baseParams({
  transaction_id: safeString,
  plan_id: safeString,
  plan_name: safeString,
  billing_period: z.enum(["monthly", "yearly", "one_time", "unknown"]),
  currency: z.string().trim().length(3),
  value: z.number().finite().nonnegative(),
});

export const affiliateClickSchema = baseParams({
  partner_id: safeString,
  partner_name: safeString,
  offer_id: safeString,
  offer_type: safeString,
  destination_domain: safeString,
  source_surface: sourceSurface,
  match_id: optionalSafeString,
});

export const articleOpenSchema = baseParams({
  article_id: safeString,
  article_slug: safeString,
  article_category: safeString,
  author: safeString,
  language,
  source_surface: sourceSurface,
});

export const videoOpenSchema = baseParams({
  video_id: safeString,
  video_title: safeString,
  video_provider: safeString,
  language,
  source_surface: sourceSurface,
});

export const languageChangeSchema = baseParams({
  previous_language: language,
  selected_language: language,
  source_surface: sourceSurface,
});

export type MatchOpenParams = z.infer<typeof matchOpenSchema>;
export type FavouriteAddParams = z.infer<typeof favouriteAddSchema>;
export type SubscriptionStartParams = z.infer<typeof subscriptionStartSchema>;
export type SubscriptionCompleteParams = z.infer<typeof subscriptionCompleteSchema>;
export type AffiliateClickParams = z.infer<typeof affiliateClickSchema>;
export type ArticleOpenParams = z.infer<typeof articleOpenSchema>;
export type VideoOpenParams = z.infer<typeof videoOpenSchema>;
export type LanguageChangeParams = z.infer<typeof languageChangeSchema>;

export type AnalyticsEventName =
  | "match_open"
  | "favourite_add"
  | "subscription_start"
  | "subscription_complete"
  | "affiliate_click"
  | "article_open"
  | "video_open"
  | "language_change";

const schemaByEvent: Record<AnalyticsEventName, z.ZodType<Record<string, unknown>>> = {
  match_open: matchOpenSchema,
  favourite_add: favouriteAddSchema,
  subscription_start: subscriptionStartSchema,
  subscription_complete: subscriptionCompleteSchema,
  affiliate_click: affiliateClickSchema,
  article_open: articleOpenSchema,
  video_open: videoOpenSchema,
  language_change: languageChangeSchema,
};

export function validateEventParams(
  event: AnalyticsEventName,
  params: Record<string, unknown>,
):
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; error: string } {
  const schema = schemaByEvent[event];
  const parsed = schema.safeParse(params);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }
  return { ok: true, data: parsed.data as Record<string, unknown> };
}

/** Reject titles unsuitable for GA4 page_title reporting. */
export function isInvalidAnalyticsPageTitle(title: string): boolean {
  const t = title.trim();
  if (!t) return true;
  if (/â€/.test(t)) return true;
  if (/\bTBD\b/i.test(t)) return true;
  if (/Winner Match|Loser Match|Winner Group|Runner-up Group|Best 3rd/i.test(t)) {
    return true;
  }
  return false;
}

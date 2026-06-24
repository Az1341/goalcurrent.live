/**
 * AdSense display slot IDs (public — safe for client).
 * Set in Vercel → Environment Variables.
 * Leave unset to skip rendering until real IDs are configured.
 */
export const ADSENSE_SLOTS = {
  homeMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID ?? "",
  homeLower: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_LOWER ?? "",
  plTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PL_TOP ?? "",
  plMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PL_MID ?? "",
  plBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_PL_BOTTOM ?? "",
  wc26Mid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_WC26_MID ?? "",
  liveMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LIVE_MID ?? "",
  matchMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_MATCH_MID ?? "",
  articleMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE_MID ?? "",
} as const;

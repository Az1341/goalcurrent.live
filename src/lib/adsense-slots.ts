/**
 * AdSense display slot IDs (public — safe for client).
 * Set in Vercel → Environment Variables:
 *   NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID
 *   NEXT_PUBLIC_ADSENSE_SLOT_HOME_LOWER
 * Leave unset to skip rendering until real IDs are configured.
 */
export const ADSENSE_SLOTS = {
  homeMid: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_MID ?? "",
  homeLower: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME_LOWER ?? "",
} as const;

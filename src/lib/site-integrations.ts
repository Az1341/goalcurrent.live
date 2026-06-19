/** Shared integration IDs for GoalCurrent.live. */
export const ONESIGNAL_APP_ID = "27dd2cba-29fc-4c6a-9183-54db03eef92d";
export const GA_MEASUREMENT_ID = "G-X84HCE5KGT";
export const ADSENSE_PUBLISHER_ID = "ca-pub-8697460993506171";

/** PWA theme-color (burgundy .live brand - not header gradient) */
export const BRAND_THEME_COLOR = "#5c0a1a";

/** Light red-tinted page surface for PWA splash (master-chrome subscribe panel). */
export const BRAND_MANIFEST_BACKGROUND = "#f6f0f2";

/**
 * Third-party scripts run on all GoalCurrent.live hosts.
 * Includes production (goalcurrent.live), localhost, and preview deployments.
 */
export function isStagingIntegrationsHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  const siteDomain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "goalcurrent.live";
  // Allow production domains
  if (host === siteDomain || host === `www.${siteDomain}`) {
    return true;
  }
  // Allow localhost
  if (host === "localhost" || host.endsWith(".localhost")) {
    return true;
  }
  // Allow preview deployments
  if (host.endsWith(".vercel.app")) {
    return true;
  }
  return false;
}



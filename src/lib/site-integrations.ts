/** Shared integration IDs for GoalCurrent.live */
export const ONESIGNAL_APP_ID = "27dd2cba-29fc-4c6a-9183-54db03eef92d";
export const GA_MEASUREMENT_ID = "G-X84HCE5KGT";
export const ADSENSE_PUBLISHER_ID = "ca-pub-8697460993506171";

/** PWA theme-color */
export const BRAND_THEME_COLOR = "#7B0D1E";

/** PWA splash background */
export const BRAND_MANIFEST_BACKGROUND = "#f6f0f2";

/** NordVPN affiliate link */
export const NORDVPN_HREF = "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=148347";

/**
 * Integrations (GA, OneSignal, AdSense) enabled on goalcurrent.live
 * and all preview/staging hosts.
 */
export function isStagingIntegrationsHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "goalcurrent.live" || host === "www.goalcurrent.live") return true;
  if (host === "goalcurrent.online" || host === "www.goalcurrent.online") return false;
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

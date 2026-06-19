/** Shared integration IDs (same as GoalCurrent.live). */
export const ONESIGNAL_APP_ID = "27dd2cba-29fc-4c6a-9183-54db03eef92d";
export const GA_MEASUREMENT_ID = "G-X84HCE5KGT";
export const ADSENSE_PUBLISHER_ID = "ca-pub-8697460993506171";

/** PWA theme-color (burgundy .online brand - not header gradient) */
export const BRAND_THEME_COLOR = "#5c0a1a";

/** Light red-tinted page surface for PWA splash (master-chrome subscribe panel). */
export const BRAND_MANIFEST_BACKGROUND = "#f6f0f2";

/**
 * Third-party scripts run on staging/preview hosts only.
 * Never on public goalcurrent.online (detached / no indexing).
 */
export function isStagingIntegrationsHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (host === "goalcurrent.online" || host === "www.goalcurrent.online") {
    return false;
  }
  if (host === "localhost" || host.endsWith(".localhost")) {
    return true;
  }
  if (host.endsWith(".vercel.app")) {
    return true;
  }
  return false;
}



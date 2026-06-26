/** Shared integration IDs for GoalCurrent.live. */
export const ONESIGNAL_APP_ID = "27dd2cba-29fc-4c6a-9183-54db03eef92d";
export const GA_MEASUREMENT_ID = "G-X84HCE5KGT";
export const ADSENSE_PUBLISHER_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "ca-pub-8697460993506171";

/** PWA theme-color (burgundy .live brand - not header gradient) */
export const BRAND_THEME_COLOR = "#5c0a1a";

/** Light red-tinted page surface for PWA splash (master-chrome subscribe panel). */
export const BRAND_MANIFEST_BACKGROUND = "#f6f0f2";

function normalizeHost(hostname: string): string {
  return hostname.toLowerCase();
}

function siteDomain(): string {
  return process.env.NEXT_PUBLIC_SITE_DOMAIN || "goalcurrent.live";
}

/** Production apex or www — integrations allowed on the live domain only. */
export function isProductionSiteHost(hostname: string): boolean {
  const host = normalizeHost(hostname);
  const domain = siteDomain();
  return host === domain || host === `www.${domain}`;
}

/**
 * GA is safe on localhost and preview (no domain lock).
 */
export function isAnalyticsHost(hostname: string): boolean {
  const host = normalizeHost(hostname);
  if (isProductionSiteHost(host)) return true;
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host.endsWith(".vercel.app")) return true;
  return false;
}

/** AdSense publisher is tied to the live site — do not load on localhost/preview. */
export function isAdSenseHost(hostname: string): boolean {
  return isProductionSiteHost(hostname);
}

/** Firebase is preferred for auth + FCM when configured; otherwise OneSignal remains. */
export function isFirebaseHost(hostname: string): boolean {
  return isProductionSiteHost(hostname);
}

/**
 * OneSignal app domain — registered for apex only in the OneSignal dashboard.
 * Loading on www throws at runtime; skip until www is added in the dashboard.
 */
export function isOneSignalHost(hostname: string): boolean {
  const host = normalizeHost(hostname);
  const domain = siteDomain();
  return host === domain;
}

/** @deprecated Use isAnalyticsHost — kept for any legacy imports */
export function isStagingIntegrationsHost(hostname: string): boolean {
  return isAnalyticsHost(hostname);
}

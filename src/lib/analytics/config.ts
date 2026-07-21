/** GA4 measurement ID (override via NEXT_PUBLIC_GA_ID). */
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_ID?.trim() || "G-X84HCE5KGT";

/** Microsoft Clarity project ID (override via NEXT_PUBLIC_CLARITY_PROJECT_ID). */
export const CLARITY_PROJECT_ID =
  process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim() || "xmag3yk04j";

/**
 * Hostnames that may send GA4 hits. Preview, localhost and branch deploys are excluded.
 * Primary production host: www.goalcurrent.live (apex allowed when it serves the same site).
 */
export const PRODUCTION_ANALYTICS_HOSTS = [
  "www.goalcurrent.live",
  "goalcurrent.live",
] as const;

const BLOCKED_HOST_SUFFIXES = [".vercel.app", ".localhost"] as const;

function normalizeHost(hostname: string): string {
  return hostname.trim().toLowerCase();
}

export function isProductionAnalyticsHost(hostname: string): boolean {
  const host = normalizeHost(hostname);
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  for (const suffix of BLOCKED_HOST_SUFFIXES) {
    if (host.endsWith(suffix)) return false;
  }
  return (PRODUCTION_ANALYTICS_HOSTS as readonly string[]).includes(host);
}

/** True when the browser may load gtag and send events. */
export function shouldEnableAnalytics(hostname: string): boolean {
  if (!GA_MEASUREMENT_ID) return false;
  return isProductionAnalyticsHost(hostname);
}

/**
 * Domains to exclude in GA4 Admin → Data streams → Configure tag settings → List unwanted referrals.
 * Documented in docs/analytics/GA4-REFERRAL-EXCLUSIONS.md
 */
export const GA4_REFERRER_EXCLUSION_DOMAINS = [
  "vercel.app",
  "goalcurrent.online",
  "www.goalcurrent.online",
  "goalcurrent.live",
  "www.goalcurrent.live",
  "accounts.google.com",
  "checkout.stripe.com",
  "pay.google.com",
] as const;

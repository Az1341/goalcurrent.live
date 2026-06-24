/** Canonical production origin for GoalCurrent.live (non-www). */
export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "GoalCurrent.live";
export const SITE_DOMAIN = process.env.NEXT_PUBLIC_SITE_DOMAIN || "goalcurrent.live";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://goalcurrent.live";

export function absoluteUrl(path: string): string {
  if (path === "" || path === "/") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

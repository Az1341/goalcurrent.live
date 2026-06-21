/** Canonical production origin for GoalCurrent.live */
export const SITE_URL = "https://www.goalcurrent.live";

export function absoluteUrl(path: string): string {
  if (path === "" || path === "/") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Canonical production origin for GoalCurrent.online */
export const SITE_URL = "https://www.goalcurrent.online";

export function absoluteUrl(path: string): string {
  if (path === "" || path === "/") {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

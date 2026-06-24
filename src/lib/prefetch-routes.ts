/** High-traffic internal routes — explicit Link prefetch in chrome nav. */
export const PREFETCH_ROUTE_PREFIXES = [
  "/",
  "/live",
  "/favourites",
  "/news",
  "/articles",
  "/videos",
  "/worldcup2026",
  "/premier-league",
] as const;

export function shouldPrefetchRoute(href: string): boolean {
  if (!href || href.startsWith("http")) {
    return false;
  }

  const path = href.split("?")[0] ?? href;

  return PREFETCH_ROUTE_PREFIXES.some((prefix) => {
    if (prefix === "/") {
      return path === "/";
    }
    return path === prefix || path.startsWith(`${prefix}/`);
  });
}

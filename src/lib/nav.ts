export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  exact?: boolean;
};

export type NavLinkItem = {
  href: string;
  label: string;
  external?: boolean;
};

export type MobileBottomTab = {
  id: string;
  href: string;
  label: string;
  exact?: boolean;
};

export type MoreSheetSubmenuId =
  | "wc26"
  | "pl"
  | "clubs"
  | "players"
  | "tables"
  | "statistics"
  | "news"
  | "video"
  | "transfers";

export type MoreSheetLevel1Item =
  | { type: "submenu"; id: MoreSheetSubmenuId; label: string }
  | { type: "divider" }
  | { type: "link"; href: string; label: string; external?: boolean };

export type DesktopDropdownSection = {
  title: string;
  links: NavLinkItem[];
};

/** Global favourites — saved items across all competitions. */
export const FAVOURITES_HREF = "/favourites";

/** GoalCurrent editorial features hub. */
export const ARTICLES_HREF = "/articles";

/** Desktop primary links — flat top bar, no More dropdown. */
export const DESKTOP_PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/live", label: "Live" },
  { href: FAVOURITES_HREF, label: "Favourites" },
  { href: "/news", label: "News" },
  { href: "/news/articles", label: "Articles" },
  { href: "/videos", label: "Videos" },
  { href: "/premier-league", label: "PL 26/27", exact: true },
  { href: "/worldcup2026", label: "WC26", exact: true },
];

/** Legacy / footer — full primary list for other consumers. */
export const MAIN_NAV: NavItem[] = [
  ...DESKTOP_PRIMARY_NAV,
  { href: "/news", label: "News" },
  { href: "/worldcup2026", label: "World Cup 2026", exact: true },
  { href: "/premier-league", label: "Premier League", exact: true },
];

/** Premier League 2026/27 section links */
export const PL_NAV: NavItem[] = [
  { href: "/premier-league/table", label: "Table" },
  { href: "/premier-league/fixtures", label: "Fixtures" },
];

/** World Cup 2026 section links (tournament pages only) */
export const WC26_NAV: NavItem[] = [
  { href: "/worldcup2026/fixtures", label: "Fixtures" },
  { href: "/worldcup2026/standings", label: "Standings" },
  { href: "/worldcup2026/groups", label: "Groups" },
  { href: "/worldcup2026/teams", label: "Teams" },
  { href: "/worldcup2026/venues", label: "Venues" },
  { href: "/worldcup2026/bracket", label: "Bracket" },
];

/**
 * Shared WC26 menu — desktop dropdown + mobile More sheet (identical items).
 */
export const WC26_MENU: NavLinkItem[] = [
  { href: "/worldcup2026", label: "Home" },
  { href: "/live", label: "Live" },
  ...WC26_NAV,
  { href: "/news/world-cup", label: "News" },
  { href: "/videos/world-cup", label: "WC Videos" },
];

/**
 * Shared PL menu — desktop dropdown + mobile More sheet (identical items).
 */
export const PL_MENU: NavLinkItem[] = [
  { href: "/premier-league", label: "Home" },
  { href: "/premier-league/fixtures", label: "Fixtures" },
  { href: "/premier-league/live", label: "Live" },
  { href: "/premier-league/table", label: "Table" },
  { href: "/premier-league/clubs", label: "Clubs" },
  { href: "/premier-league/players", label: "Players" },
  { href: "/premier-league/statistics", label: "Statistics" },
  { href: "/premier-league/transfers", label: "Transfers" },
  { href: "/news/premier-league", label: "News" },
  { href: "/videos/premier-league", label: "PL Videos" },
];

/** Premier League hub quick links — mirrors PL_MENU (excludes hub Home). */
export const PL_SECTION_NAV: NavItem[] = PL_MENU.filter(
  (item) => item.href !== "/premier-league",
).map(({ href, label }) => ({ href, label }));

/** More dropdown — WC26 hub + section links (legacy) */
export const MORE_NAV: NavLinkItem[] = WC26_MENU;

/** Mobile bottom tab bar — primary tabs only (<769px) */
export const MOBILE_BOTTOM_TABS: MobileBottomTab[] = [
  { id: "home", href: "/", label: "Home", exact: true },
  { id: "live", href: "/live", label: "Live" },
  { id: "favourites", href: FAVOURITES_HREF, label: "Favourites" },
  { id: "pl", href: "/premier-league", label: "PL 26/27" },
  { id: "wc26", href: "/worldcup2026", label: "WC26" },
];

/** More bottom sheet — level 1 categories (football sections only). */
export const MORE_SHEET_LEVEL1: MoreSheetLevel1Item[] = [
  { type: "link", href: "/news/articles", label: "✍️ Articles & Editorial" },
  { type: "submenu", id: "wc26", label: "WC26" },
  { type: "submenu", id: "pl", label: "PL 26/27" },
  { type: "submenu", id: "clubs", label: "Clubs" },
  { type: "submenu", id: "players", label: "Players" },
  { type: "submenu", id: "tables", label: "Tables" },
  // TODO: restore when page is live
  // { type: "submenu", id: "statistics", label: "Statistics" },
  { type: "submenu", id: "news", label: "News" },
  { type: "submenu", id: "video", label: "Video & Audio" },
  // TODO: restore when page is live
  // { type: "submenu", id: "transfers", label: "Transfers" },
];

/** More bottom sheet — level 2 drill-down links */
export const MORE_SHEET_SUBMENUS: Record<MoreSheetSubmenuId, NavLinkItem[]> = {
  wc26: WC26_MENU,
  pl: PL_MENU,
  clubs: [
    // TODO: restore when page is live
    // { href: "/favourites/clubs", label: "Favourite Clubs" },
    { href: "/premier-league/clubs", label: "Premier League Clubs" },
    { href: "/worldcup2026/teams", label: "World Cup Teams" },
  ],
  players: [
    // TODO: restore when page is live
    // { href: "/favourites/players", label: "Favourite Players" },
    { href: "/premier-league/players", label: "Premier League Players" },
    // TODO: restore when page is live
    // { href: "/worldcup2026/players", label: "World Cup Players" },
    // TODO: restore when page is live
    // { href: "/statistics/top-scorers", label: "Top Scorers" },
    // { href: "/statistics/assists", label: "Most Assists" },
    // { href: "/statistics/player-rankings", label: "Player Rankings" },
  ],
  tables: [
    { href: "/premier-league/table", label: "Premier League 26/27" },
    // TODO: restore when page is live
    // { href: "/premier-league/2025-26/table", label: "Premier League 25/26" },
    { href: "/worldcup2026/groups", label: "WC26 Group Tables" },
    { href: "/worldcup2026/bracket", label: "WC26 Bracket" },
  ],
  statistics: [
    // TODO: restore when page is live
    // { href: "/statistics/live", label: "Live Match Stats" },
    // { href: "/statistics/players", label: "Player Stats" },
    // { href: "/statistics/teams", label: "Team Stats" },
    // { href: "/statistics/top-scorers", label: "Top Scorers" },
    // { href: "/statistics/assists", label: "Top Assists" },
    // { href: "/statistics/clean-sheets", label: "Clean Sheets" },
    // { href: "/statistics/disciplinary", label: "Disciplinary" },
  ],
  news: [
    { href: "/news", label: "Latest News" },
    { href: "/news/articles", label: "✍️ Editorial & Articles" },
    { href: "/news/articles/world-cup-2026-complete-guide", label: "World Cup 2026 Guide" },
    { href: "/news/articles/premier-league-2025-26-season-review", label: "PL Season Review" },
    { href: "/news/world-cup", label: "World Cup News" },
    { href: "/news/premier-league", label: "Premier League News" },
    // TODO: restore when page is live
    // { href: "/news/transfers", label: "Transfer News" },
  ],
  video: [
    { href: "/videos", label: "Latest Videos" },
    { href: "/videos/premier-league", label: "PL Videos" },
    { href: "/videos/world-cup", label: "WC Videos" },
    // TODO: restore when page is live
    // { href: "/video/highlights", label: "Match Highlights" },
    // { href: "/video/press-conferences", label: "Press Conferences" },
    // { href: "/video/podcasts", label: "Podcasts" },
  ],
  transfers: [
    // TODO: restore when page is live
    // { href: "/transfers", label: "Latest Transfers" },
    // { href: "/transfers/rumours", label: "Rumours" },
    // { href: "/transfers/completed", label: "Completed Deals" },
    // { href: "/transfers/free-agents", label: "Free Agents" },
  ],
};

export const MORE_SHEET_SUBMENU_TITLES: Record<MoreSheetSubmenuId, string> = {
  wc26: "WC26",
  pl: "PL 26/27",
  clubs: "Clubs",
  players: "Players",
  tables: "Tables",
  statistics: "Statistics",
  news: "News",
  video: "Video & Audio",
  transfers: "Transfers",
};

/** Desktop PL 26/27 header dropdown — existing routes only */
export const DESKTOP_PL_DROPDOWN: NavLinkItem[] = [
  { href: "/premier-league", label: "PL Home" },
  { href: "/premier-league/fixtures", label: "Fixtures" },
  { href: "/premier-league/table", label: "Table" },
  { href: "/premier-league/clubs", label: "Clubs" },
  { href: "/premier-league/statistics", label: "Statistics" },
];

/** Desktop WC26 header dropdown — existing routes only */
export const DESKTOP_WC26_DROPDOWN: NavLinkItem[] = [
  { href: "/worldcup2026", label: "WC26 Home" },
  { href: "/worldcup2026/fixtures", label: "Fixtures" },
  { href: "/worldcup2026/groups", label: "Groups" },
  { href: "/worldcup2026/standings", label: "Standings" },
  { href: "/worldcup2026/teams", label: "Teams" },
  { href: "/worldcup2026/venues", label: "Venues" },
  { href: "/worldcup2026/bracket", label: "Bracket" },
  { href: FAVOURITES_HREF, label: "Favourites" },
];

/** About and contact */
export const SITE_NAV: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Desktop top bar — all navigation links in one horizontal row */
export const TOP_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...WC26_NAV,
  ...PL_NAV,
  ...SITE_NAV,
];

export const FOOTER_LINKS: NavLinkItem[] = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

export const FOOTER_SOCIAL: NavLinkItem[] = [
  { href: "https://facebook.com/goalcurrent", label: "Facebook" },
  { href: "https://www.instagram.com/goalcurrentlive", label: "Instagram" },
  { href: "https://www.tiktok.com/@goalcurrent", label: "TikTok" },
  { href: "https://twitter.com/goalcurrentlive", label: "X / Twitter" },
];

export function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function isMainNavActive(pathname: string, href: string, exact?: boolean) {
  return isNavActive(pathname, href, exact);
}

export function isDesktopPlActive(pathname: string): boolean {
  return pathname === "/premier-league" || pathname.startsWith("/premier-league/");
}

export function isDesktopWc26Active(pathname: string): boolean {
  return pathname === "/worldcup2026" || pathname.startsWith("/worldcup2026/");
}

export function isDesktopMoreActive(pathname: string): boolean {
  return DESKTOP_MORE_DROPDOWN.some((link) =>
    isMoreSheetLinkActive(pathname, link.href),
  );
}

export function isMobileBottomTabActive(
  pathname: string,
  tab: MobileBottomTab,
): boolean {
  if (tab.id === "home") {
    return pathname === "/";
  }

  if (tab.id === "live") {
    return pathname === "/live" || pathname.startsWith("/live/");
  }

  if (tab.id === "favourites") {
    return (
      pathname === FAVOURITES_HREF || pathname.startsWith(`${FAVOURITES_HREF}/`)
    );
  }

  if (tab.id === "pl") {
    return isDesktopPlActive(pathname);
  }

  if (tab.id === "wc26") {
    return isDesktopWc26Active(pathname);
  }

  return isNavActive(pathname, tab.href, tab.exact);
}

export function isMoreSheetLinkActive(pathname: string, href: string): boolean {
  const [path] = href.split("?");
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

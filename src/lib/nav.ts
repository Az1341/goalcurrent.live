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

/** Desktop primary links (before dropdowns). */
export const DESKTOP_PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/live", label: "Live" },
  { href: FAVOURITES_HREF, label: "Favourites" },
  { href: "/news", label: "News" },
  { href: "/videos", label: "Videos" },
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

/** Premier League hub — extended section links */
export const PL_SECTION_NAV: NavItem[] = [
  { href: "/premier-league/table", label: "Table 26/27" },
  { href: "/premier-league/fixtures", label: "Fixtures 26/27" },
  { href: "/premier-league/clubs", label: "Clubs" },
  { href: "/premier-league/players", label: "Players" },
  { href: "/premier-league/statistics", label: "Statistics" },
  { href: "/premier-league/transfers", label: "Transfers" },
  // TODO: restore when page is live
  // { href: "/premier-league/2025-26/table", label: "Table 25/26" },
];

/** World Cup 2026 section links */
export const WC26_NAV: NavItem[] = [
  { href: "/worldcup2026/groups", label: "Groups" },
  { href: "/worldcup2026/fixtures", label: "Fixtures" },
  { href: "/worldcup2026/standings", label: "Standings" },
  { href: "/worldcup2026/teams", label: "Teams" },
  { href: "/worldcup2026/venues", label: "Venues" },
  { href: "/worldcup2026/bracket", label: "Bracket" },
];

/** More dropdown — WC26 hub + section links (legacy) */
export const MORE_NAV: NavLinkItem[] = [
  { href: "/worldcup2026", label: "Overview" },
  ...WC26_NAV,
];

/** Mobile bottom tab bar — primary tabs only (<769px) */
export const MOBILE_BOTTOM_TABS: MobileBottomTab[] = [
  { id: "home", href: "/", label: "Home", exact: true },
  { id: "live", href: "/live", label: "Live" },
  { id: "favourites", href: FAVOURITES_HREF, label: "Favourites" },
  { id: "pl", href: "/premier-league", label: "PL 26/27" },
  { id: "wc26", href: "/worldcup2026", label: "WC26" },
];

/** More bottom sheet — level 1 categories + site footer links */
export const MORE_SHEET_LEVEL1: MoreSheetLevel1Item[] = [
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
  { type: "divider" },
  { type: "link", href: "/about", label: "About" },
  { type: "link", href: "/contact", label: "Contact" },
  { type: "link", href: "/terms", label: "Terms" },
  { type: "link", href: "/privacy", label: "Privacy" },
  { type: "link", href: "/cookies", label: "Cookies" },
  { type: "link", href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
];

/** More bottom sheet — level 2 drill-down links */
export const MORE_SHEET_SUBMENUS: Record<MoreSheetSubmenuId, NavLinkItem[]> = {
  wc26: [
    { href: "/worldcup2026", label: "Overview" },
    { href: "/live", label: "Live Results" },
    { href: "/worldcup2026/fixtures", label: "Fixtures" },
    { href: "/worldcup2026/standings", label: "Standings" },
    { href: "/worldcup2026/groups", label: "Groups" },
    { href: "/worldcup2026/teams", label: "Teams" },
    // TODO: restore when page is live
    // { href: "/worldcup2026/players", label: "Players" },
    { href: "/worldcup2026/venues", label: "Venues" },
    { href: "/worldcup2026/bracket", label: "Bracket" },
    { href: "/news/world-cup", label: "News" },
    { href: "/videos/world-cup", label: "📺 WC Videos" },
  ],
  pl: [
    { href: "/premier-league", label: "Home" },
    { href: "/premier-league/fixtures", label: "Fixtures" },
    { href: "/premier-league/live", label: "Live Matches" },
    { href: "/premier-league/table", label: "Table" },
    { href: "/premier-league/clubs", label: "Clubs" },
    { href: "/premier-league/players", label: "Players" },
    { href: "/premier-league/statistics", label: "Statistics" },
    { href: "/premier-league/transfers", label: "Transfers" },
    { href: "/news/premier-league", label: "News" },
    { href: "/videos/premier-league", label: "📺 PL Videos" },
  ],
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
    { href: "/news/premier-league", label: "Premier League News" },
    { href: "/news/world-cup", label: "World Cup News" },
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

/** Desktop PL 26/27 dropdown */
export const DESKTOP_PL_DROPDOWN: NavLinkItem[] = MORE_SHEET_SUBMENUS.pl;

/** Desktop WC26 dropdown */
export const DESKTOP_WC26_DROPDOWN: NavLinkItem[] = MORE_SHEET_SUBMENUS.wc26;

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

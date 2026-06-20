import { NORDVPN_HREF } from "@/lib/site-keys";

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

export type MoreSheetSection = {
  title: string;
  links: NavLinkItem[];
};

/** Global favourites — saved items across all competitions. */
export const FAVOURITES_HREF = "/favourites";

/** Primary navigation links (master header) */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", exact: true },
  { href: "/live", label: "Live Scores" },
  { href: FAVOURITES_HREF, label: "Favourites" },
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
  { href: "/premier-league/2025-26/table", label: "Table 25/26" },
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

/** More dropdown — WC26 hub + section links (desktop) */
export const MORE_NAV: NavLinkItem[] = [
  { href: "/worldcup2026", label: "Overview" },
  ...WC26_NAV,
];

/** Mobile bottom tab bar — primary tabs only (<769px) */
export const MOBILE_BOTTOM_TABS: MobileBottomTab[] = [
  { id: "latest", href: "/", label: "Latest", exact: true },
  { id: "live", href: "/live", label: "Live Score" },
  { id: "favourite", href: FAVOURITES_HREF, label: "Favourite" },
  { id: "pl", href: "/premier-league", label: "PL 26/27" },
  { id: "wc26", href: "/worldcup2026", label: "WC26" },
];

/** More bottom sheet — grouped sections (mobile) */
export const MORE_SHEET_SECTIONS: MoreSheetSection[] = [
  {
    title: "WC26",
    links: [
      { href: "/news?competition=worldcup2026", label: "News" },
      { href: "/live", label: "Live Results" },
      { href: "/worldcup2026/fixtures", label: "Fixtures" },
      { href: "/worldcup2026/standings", label: "Standings" },
      { href: "/worldcup2026/groups", label: "Groups" },
      { href: "/worldcup2026/teams", label: "Teams" },
      { href: "/worldcup2026/bracket", label: "Bracket" },
      { href: "/worldcup2026/venues", label: "Venues" },
    ],
  },
  {
    title: "Premier League",
    links: [
      { href: "/premier-league", label: "PL Home" },
      { href: "/premier-league/fixtures", label: "Fixtures 26/27" },
      { href: "/premier-league/table", label: "Table 26/27" },
      { href: "/premier-league/clubs", label: "Clubs" },
      { href: "/premier-league/players", label: "Players" },
      { href: "/premier-league/statistics", label: "Statistics" },
      { href: "/premier-league/transfers", label: "Transfers" },
    ],
  },
  {
    title: "Tables",
    links: [
      { href: "/premier-league/table", label: "PL 26/27" },
      { href: "/premier-league/2025-26/table", label: "PL 25/26" },
      { href: "/worldcup2026/groups", label: "WC26 Groups Table" },
    ],
  },
  {
    title: "Media",
    links: [
      { href: "/news", label: "Latest News" },
      { href: "/video", label: "Video & Audio" },
      { href: "/video/youtube", label: "YouTube Videos" },
    ],
  },
  {
    title: "Site",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
      { href: "/cookies", label: "Cookies" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: NORDVPN_HREF, label: "NordVPN", external: true },
    ],
  },
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

export function isMobileBottomTabActive(
  pathname: string,
  tab: MobileBottomTab,
): boolean {
  if (tab.id === "latest") {
    return pathname === "/";
  }

  if (tab.id === "live") {
    return pathname === "/live" || pathname.startsWith("/live/");
  }

  if (tab.id === "favourite") {
    return (
      pathname === FAVOURITES_HREF || pathname.startsWith(`${FAVOURITES_HREF}/`)
    );
  }

  if (tab.id === "pl") {
    return pathname === "/premier-league" || pathname.startsWith("/premier-league/");
  }

  if (tab.id === "wc26") {
    return pathname === "/worldcup2026" || pathname.startsWith("/worldcup2026/");
  }

  return isNavActive(pathname, tab.href, tab.exact);
}

export function isMoreSheetLinkActive(pathname: string, href: string): boolean {
  const [path] = href.split("?");
  if (path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}

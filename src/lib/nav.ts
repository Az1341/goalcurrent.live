import { NORDVPN_HREF } from "@/lib/site-keys";

export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  exact?: boolean;
};

export type NavLinkItem = {  href: string;
  label: string;
  external?: boolean;
};

export type MobileBottomTab = {
  id: string;
  href: string;
  label: string;
  exact?: boolean;
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

/** World Cup 2026 section links */
export const WC26_NAV: NavItem[] = [
  { href: "/worldcup2026/groups", label: "Groups" },
  { href: "/worldcup2026/fixtures", label: "Fixtures" },
  { href: "/worldcup2026/standings", label: "Standings" },
  { href: "/worldcup2026/teams", label: "Teams" },
  { href: "/worldcup2026/venues", label: "Venues" },
  { href: "/worldcup2026/bracket", label: "Bracket" },
];

/** More dropdown — WC26 hub + section links */
export const MORE_NAV: NavLinkItem[] = [
  { href: "/worldcup2026", label: "Overview" },
  ...WC26_NAV,
];

/** Mobile bottom tab bar — primary tabs only */
export const MOBILE_BOTTOM_TABS: MobileBottomTab[] = [
  { id: "home", href: "/", label: "Home", exact: true },
  { id: "worldcup", href: "/worldcup2026", label: "World Cup" },
  { id: "fixtures", href: "/worldcup2026/fixtures", label: "Fixtures" },
  { id: "pl-table", href: "/premier-league/table", label: "PL Table" },
];

/** More bottom sheet — secondary links (mobile) */
export const MORE_SHEET_NAV: NavLinkItem[] = [
  { href: "/live", label: "Live Scores" },
  { href: "/news", label: "News" },
  { href: FAVOURITES_HREF, label: "Favourites" },
  { href: "/worldcup2026", label: "World Cup Overview" },
  { href: "/worldcup2026/groups", label: "Groups" },
  { href: "/worldcup2026/standings", label: "Standings" },
  { href: "/worldcup2026/teams", label: "Teams" },
  { href: "/worldcup2026/venues", label: "Venues" },
  { href: "/worldcup2026/bracket", label: "Bracket" },
  { href: "/premier-league/fixtures", label: "Premier League Fixtures" },
  { href: "/premier-league/table", label: "Premier League Table" },
  { href: NORDVPN_HREF, label: "NordVPN", external: true },  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/cookies", label: "Cookies" },
  { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
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
  if (tab.id === "home") {
    return pathname === "/";
  }

  if (tab.id === "worldcup") {
    return (
      pathname === "/worldcup2026" ||
      (pathname.startsWith("/worldcup2026/") &&
        !pathname.startsWith("/worldcup2026/fixtures"))
    );
  }

  if (tab.id === "fixtures") {
    return (
      pathname === "/worldcup2026/fixtures" ||
      pathname.startsWith("/premier-league/fixtures")
    );
  }

  if (tab.id === "pl-table") {
    return pathname.startsWith("/premier-league/table");
  }

  return isNavActive(pathname, tab.href, tab.exact);
}

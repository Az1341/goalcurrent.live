export type NavItem = {
  href: string;
  label: string;
  icon?: string;
  exact?: boolean;
};

export type NavLinkItem = {
  href: string;
  label: string;
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

/** Competition strip below master header */
export const COMPETITION_STRIP: NavLinkItem[] = [
  { href: "/worldcup2026", label: "World Cup 2026" },
  { href: "/live", label: "Premier League" },
  { href: "/live", label: "Champions League" },
  { href: "/live", label: "Europa League" },
  { href: "/live", label: "International Football" },
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

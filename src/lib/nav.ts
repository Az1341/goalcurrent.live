export type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
};

/** Global favourites — saved items across all competitions. */
export const FAVOURITES_HREF = "/favourites";

/** Primary navigation links */
export const MAIN_NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠", exact: true },
  { href: "/live", label: "Live Scores", icon: "🔴" },
  { href: FAVOURITES_HREF, label: "Favourites", icon: "⭐" },
  { href: "/news", label: "News", icon: "📰" },
  { href: "/worldcup2026", label: "World Cup 2026", icon: "🏆", exact: true },
];

/** World Cup 2026 section links */
export const WC26_NAV: NavItem[] = [
  { href: "/worldcup2026/groups", label: "Groups", icon: "📋" },
  { href: "/worldcup2026/fixtures", label: "Fixtures", icon: "📅" },
  { href: "/worldcup2026/standings", label: "Standings", icon: "📊" },
  { href: "/worldcup2026/teams", label: "Teams", icon: "👕" },
  { href: "/worldcup2026/venues", label: "Venues", icon: "🏟️" },
  { href: "/worldcup2026/bracket", label: "Bracket", icon: "🏅" },
];

/** About and contact */
export const SITE_NAV: NavItem[] = [
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/contact", label: "Contact", icon: "✉️" },
];

/** Desktop top bar — all navigation links in one horizontal row */
export const TOP_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...WC26_NAV,
  ...SITE_NAV,
];

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

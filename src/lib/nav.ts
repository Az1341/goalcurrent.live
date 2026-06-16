export type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
};

/** Global favourites — saved items across all competitions. */
export const FAVOURITES_HREF = "/favourites";

/** Header pill navigation */
export const SUBNAV: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠", exact: true },
  { href: "/worldcup2026", label: "World Cup", icon: "🏆" },
  { href: "/live", label: "Live Scores", icon: "🔴" },
  { href: "/news", label: "News", icon: "📰" },
];

/** Sidebar — main menu */
export const SIDEBAR_MAIN: NavItem[] = [
  { href: "/", label: "Home", icon: "🏠", exact: true },
  { href: "/live", label: "Live Scores", icon: "🔴" },
  { href: FAVOURITES_HREF, label: "Favourites", icon: "⭐" },
  { href: "/news", label: "Latest News", icon: "📰" },
];

/** Sidebar — World Cup 2026 section */
export const SIDEBAR_WC26: NavItem[] = [
  { href: "/worldcup2026", label: "World Cup 2026", icon: "🏆", exact: true },
  { href: "/worldcup2026/groups", label: "Groups", icon: "📋" },
  { href: "/worldcup2026/fixtures", label: "Fixtures", icon: "📅" },
  { href: "/worldcup2026/standings", label: "Standings", icon: "📊" },
  { href: "/worldcup2026/teams", label: "Teams", icon: "👕" },
  { href: "/worldcup2026/venues", label: "Venues", icon: "🏟️" },
  { href: "/worldcup2026/bracket", label: "Bracket", icon: "🏅" },
];

/** Sidebar — site sections */
export const SIDEBAR_SITE: NavItem[] = [
  { href: "/about", label: "About", icon: "ℹ️" },
  { href: "/contact", label: "Contact", icon: "✉️" },
];

export const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

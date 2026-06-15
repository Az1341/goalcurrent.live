export type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
};

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
  { href: "/news", label: "Latest News", icon: "📰" },
];

/** Sidebar — site sections */
export const SIDEBAR_SITE: NavItem[] = [
  { href: "/worldcup2026", label: "World Cup 2026", icon: "🏆" },
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

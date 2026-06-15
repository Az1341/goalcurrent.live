import Image from "next/image";
import Link from "next/link";
import styles from "./site.module.css";

export type NavKey = "home" | "worldcup2026" | "live" | "news";

const NAV: { key: NavKey; href: string; label: string }[] = [
  { key: "home", href: "/", label: "🏠 Home" },
  { key: "worldcup2026", href: "/worldcup2026", label: "🏆 World Cup" },
  { key: "live", href: "/live", label: "🔴 Live Scores" },
  { key: "news", href: "/news", label: "📰 News" },
];

type SiteShellProps = {
  activeNav?: NavKey;
  children: React.ReactNode;
};

export default function SiteShell({ activeNav, children }: SiteShellProps) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <Link href="/" className={styles.brand}>
            <Image
              className={styles.brandIcon}
              src="/logo.svg"
              alt="GoalCurrent.online logo"
              width={44}
              height={44}
              priority
            />
            <div>
              <div className={styles.brandName}>
                Goal<span>Current</span>.online
              </div>
              <div className={styles.brandSub}>
                Live Scores · World Cup 2026 · News
              </div>
            </div>
          </Link>
        </div>
        <nav className={styles.subnav} aria-label="Quick navigation">
          <div className={styles.subnavInner}>
            {NAV.map(({ key, href, label }) => (
              <Link
                key={key}
                href={href}
                className={`${styles.subnavLink} ${
                  activeNav === key ? styles.subnavLinkActive : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {children}

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className={styles.footerCopy}>
          © 2026 <strong>Ashna4All</strong> · Ahmad Zafarani · GoalCurrent.online
          <br />
          Independent fan site · Not affiliated with FIFA, UEFA or the Premier League
        </p>
      </footer>
    </div>
  );
}

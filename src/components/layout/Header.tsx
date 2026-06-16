import Image from "next/image";
import Link from "next/link";
import { SUBNAV } from "@/lib/nav";
import NavLink from "./NavLink";
import styles from "./layout.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <Link href="/" className={styles.brand}>
          <Image
            className={styles.brandIcon}
            src="/logo.svg"
            alt="GoalCurrent.online logo"
            width={36}
            height={36}
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
          {SUBNAV.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.subnavLink}
              activeClassName={styles.subnavLinkActive}
            >
              {icon} {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}

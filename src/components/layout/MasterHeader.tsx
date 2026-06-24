"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLink from "@/components/nav/NavLink";
import {
  DESKTOP_PL_DROPDOWN,
  DESKTOP_PRIMARY_NAV,
  DESKTOP_WC26_DROPDOWN,
  isDesktopPlActive,
  isDesktopWc26Active,
  isMainNavActive,
} from "@/lib/nav";
import HeaderNavDropdown from "./HeaderNavDropdown";
import LiveRibbon from "./LiveRibbon";
import styles from "./master-chrome.module.css";

function openSubscribeDialog() {
  window.dispatchEvent(new CustomEvent("gc:subscribe-open"));
}

export default function MasterHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={styles.chromeWrap} data-gc-chrome="site-header">
      <header className={styles.masterHeader} role="banner">
        <div className={styles.bar}>
          <NavLink href="/" className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <Image src="/logo.svg" alt="" width={48} height={48} priority />
            </div>
            <div className={styles.brandName}>
              Goal<span>Current</span>.live
            </div>
          </NavLink>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            {DESKTOP_PRIMARY_NAV.map((item) => {
              const active = isMainNavActive(pathname, item.href, item.exact);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <HeaderNavDropdown
              label="PL 26/27"
              links={DESKTOP_PL_DROPDOWN}
              isActive={isDesktopPlActive(pathname)}
            />
            <HeaderNavDropdown
              label="WC26"
              links={DESKTOP_WC26_DROPDOWN}
              isActive={isDesktopWc26Active(pathname)}
            />
          </nav>

          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.headerSubscribe}
              onClick={openSubscribeDialog}
            >
              Subscribe
            </button>
          </div>
        </div>
      </header>

      {!isHome ? <LiveRibbon /> : null}
    </div>
  );
}

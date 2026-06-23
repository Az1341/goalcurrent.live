"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DESKTOP_PRIMARY_NAV, isMainNavActive } from "@/lib/nav";
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
          <Link href="/" className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <Image src="/logo.svg" alt="" width={48} height={48} priority />
            </div>
            <div className={styles.brandName}>
              Goal<span>Current</span>.live
            </div>
          </Link>

          <nav className={styles.desktopNav} aria-label="Main navigation">
            {DESKTOP_PRIMARY_NAV.map((item) => {
              const active = isMainNavActive(pathname, item.href, item.exact);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={styles.headerActions}>
            <Link href="/contact" className={styles.headerLogin}>
              Contact
            </Link>
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

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MAIN_NAV,
  MORE_NAV,
  isMainNavActive,
} from "@/lib/nav";
import LiveRibbon from "./LiveRibbon";
import styles from "./master-chrome.module.css";

export default function MasterHeader() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMore = () => setMoreOpen(false);

  return (
    <div className={styles.chromeWrap} data-gc-chrome="site-header">
      <header className={styles.masterHeader} role="banner">
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} onClick={closeMore}>
            <div className={styles.brandLogoWrap}>
              <Image src="/logo.svg" alt="" width={54} height={54} priority />
            </div>
            <div>
              <div className={styles.brandName}>
                Goal<span>Current</span>.live
              </div>
              <div className={styles.brandSub}>
                Independent football media · live scores &amp; news
              </div>
            </div>
          </Link>
        </div>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {MAIN_NAV.map((item) => {
            const active = isMainNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                onClick={closeMore}
              >
                {item.label}
              </Link>
            );
          })}

          <div className={styles.moreWrap}>
            <button
              type="button"
              className={`${styles.moreBtn} ${moreOpen ? styles.moreBtnOpen : ""}`}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen((open) => !open)}
            >
              More ▾
            </button>
            {moreOpen && (
              <div className={styles.moreDropdown}>
                {MORE_NAV.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={styles.moreDropdownLink}
                    onClick={closeMore}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </header>

      <LiveRibbon />
    </div>
  );
}

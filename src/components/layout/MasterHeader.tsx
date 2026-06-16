"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { PLACEHOLDER_MATCHES } from "@/data/placeholder-matches";
import {
  COMPETITION_STRIP,
  MAIN_NAV,
  MORE_NAV,
  isMainNavActive,
} from "@/lib/nav";
import LiveRibbon from "./LiveRibbon";
import styles from "./master-chrome.module.css";

export default function MasterHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const closeAll = useCallback(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, []);

  return (
    <div className={styles.chromeWrap} data-gc-chrome="site-header">
      <div
        className={`${styles.mobileOverlay} ${mobileOpen ? styles.mobileOverlayOpen : ""}`}
        onClick={closeMobile}
        aria-hidden={!mobileOpen}
      />

      <header className={styles.masterHeader} role="banner">
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} onClick={closeAll}>
            <div className={styles.brandLogoWrap}>
              <Image src="/logo.svg" alt="" width={54} height={54} priority />
            </div>
            <div>
              <div className={styles.brandName}>
                Goal<span>Current</span>.online
              </div>
              <div className={styles.brandSub}>
                Independent football media · live scores &amp; news
              </div>
            </div>
          </Link>

          <button
            type="button"
            className={styles.menuBtn}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <nav className={styles.desktopNav} aria-label="Main navigation">
          {MAIN_NAV.map((item) => {
            const active = isMainNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                onClick={closeAll}
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
                    onClick={closeAll}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <nav
          className={`${styles.mobilePanel} ${mobileOpen ? styles.mobilePanelOpen : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
          data-gc-chrome="mobile-nav"
        >
          <div className={styles.mobileSectionLabel}>Main</div>
          {MAIN_NAV.map((item) => {
            const active = isMainNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileLink} ${active ? styles.mobileLinkActive : ""}`}
                onClick={closeAll}
              >
                {item.label}
              </Link>
            );
          })}

          <div className={styles.mobileSectionLabel}>Competitions</div>
          {COMPETITION_STRIP.map((comp) => (
            <Link
              key={comp.label}
              href={comp.href}
              className={styles.mobileLink}
              onClick={closeAll}
            >
              {comp.label}
            </Link>
          ))}

          <div className={styles.mobileSectionLabel}>More — World Cup 2026</div>
          {MORE_NAV.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={styles.mobileLink}
              onClick={closeAll}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <div className={styles.compStripWrap}>
        <nav aria-label="Competitions" className={styles.compStrip}>
          {COMPETITION_STRIP.map((comp) => (
            <Link
              key={comp.label}
              href={comp.href}
              className={`${styles.compPill} ${comp.label === "World Cup 2026" ? styles.compPillActive : ""}`}
            >
              {comp.label}
            </Link>
          ))}
        </nav>
      </div>

      <LiveRibbon matches={PLACEHOLDER_MATCHES} />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import {
  MAIN_NAV,
  SITE_NAV,
  TOP_NAV,
  WC26_NAV,
} from "@/lib/nav";
import NavLink from "./NavLink";
import styles from "./layout.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <button
            type="button"
            className={styles.menuBtn}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <Link href="/" className={styles.brand} onClick={close}>
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

        <nav className={styles.mainNav} aria-label="Main navigation">
          <div className={styles.mainNavInner}>
            {TOP_NAV.map(({ href, label, icon, exact }) => (
              <NavLink
                key={href}
                href={href}
                exact={exact}
                className={styles.mainNavLink}
                activeClassName={styles.mainNavLinkActive}
                onNavigate={close}
              >
                <span className={styles.navIcon} aria-hidden="true">{icon}</span>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        onClick={close}
        aria-hidden={!menuOpen}
      />

      <nav
        id="gc-mobile-nav"
        className={`${styles.mobileDrawer} ${menuOpen ? styles.mobileDrawerOpen : ""}`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className={styles.mobileDrawerHead}>
          <span className={styles.mobileDrawerTitle}>Menu</span>
          <button
            type="button"
            className={styles.mobileDrawerClose}
            aria-label="Close menu"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <div className={styles.mobileSectionLabel}>Main</div>
        <div className={styles.mobileNavGroup}>
          {MAIN_NAV.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.mobileNavLink}
              activeClassName={styles.mobileNavLinkActive}
              onNavigate={close}
            >
              <span className={styles.navIcon} aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.mobileSectionLabel}>World Cup 2026</div>
        <div className={styles.mobileNavGroup}>
          {WC26_NAV.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.mobileNavLink}
              activeClassName={styles.mobileNavLinkActive}
              onNavigate={close}
            >
              <span className={styles.navIcon} aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.mobileSectionLabel}>Site</div>
        <div className={styles.mobileNavGroup}>
          {SITE_NAV.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.mobileNavLink}
              activeClassName={styles.mobileNavLinkActive}
              onNavigate={close}
            >
              <span className={styles.navIcon} aria-hidden="true">{icon}</span>
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}

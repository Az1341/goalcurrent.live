"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import { SIDEBAR_MAIN, SIDEBAR_SITE } from "@/lib/nav";
import NavLink from "./NavLink";
import styles from "./layout.module.css";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <button
        type="button"
        className={styles.hamburger}
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span />
        <span />
        <span />
      </button>

      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ""}`}
        onClick={close}
        aria-hidden={!open}
      />

      <nav
        id="gc-sidebar"
        className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}
        aria-label="Main navigation"
      >
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo} onClick={close}>
            <Image
              className={styles.sidebarLogoIcon}
              src="/logo.svg"
              alt="GoalCurrent.online logo"
              width={42}
              height={42}
            />
            <div>
              <div className={styles.sidebarLogoName}>
                Goal<em>Current</em>
              </div>
              <div className={styles.sidebarLogoDomain}>.online</div>
            </div>
          </Link>
          <button
            type="button"
            className={styles.sidebarClose}
            aria-label="Close menu"
            onClick={close}
          >
            ✕
          </button>
        </div>

        <div className={styles.sidebarSectionLabel}>Main Menu</div>
        <div className={styles.sidebarNav}>
          {SIDEBAR_MAIN.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.sidebarLink}
              activeClassName={styles.sidebarLinkActive}
              onNavigate={close}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.sidebarSectionLabel}>Site</div>
        <div className={styles.sidebarNav}>
          {SIDEBAR_SITE.map(({ href, label, icon, exact }) => (
            <NavLink
              key={href}
              href={href}
              exact={exact}
              className={styles.sidebarLink}
              activeClassName={styles.sidebarLinkActive}
              onNavigate={close}
            >
              <span className={styles.navIcon} aria-hidden="true">
                {icon}
              </span>
              {label}
            </NavLink>
          ))}
        </div>

        <div className={styles.sidebarSocial}>
          <a
            href="https://twitter.com/goalcurrentlive"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GoalCurrent on X"
          >
            𝕏
          </a>
          <a
            href="https://www.tiktok.com/@goalcurrent"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GoalCurrent on TikTok"
          >
            ♪
          </a>
          <a
            href="https://www.instagram.com/goalcurrentlive"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GoalCurrent on Instagram"
          >
            📸
          </a>
        </div>
      </nav>
    </>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DESKTOP_PL_DROPDOWN,
  DESKTOP_PRIMARY_NAV,
  DESKTOP_WC26_DROPDOWN,
  isDesktopPlActive,
  isDesktopWc26Active,
  isMainNavActive,
} from "@/lib/nav";
import LiveRibbon from "./LiveRibbon";
import styles from "./master-chrome.module.css";

type OpenDropdown = "pl" | "wc26" | null;

export default function MasterHeader() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const navRef = useRef<HTMLElement | null>(null);

  const closeDropdowns = useCallback(() => setOpenDropdown(null), []);

  useEffect(() => {
    closeDropdowns();
  }, [pathname, closeDropdowns]);

  useEffect(() => {
    if (!openDropdown) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDropdowns();
    };
    const onPointerDown = (event: MouseEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        closeDropdowns();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onPointerDown);
    };
  }, [openDropdown, closeDropdowns]);

  const toggleDropdown = (id: OpenDropdown) => {
    setOpenDropdown((current) => (current === id ? null : id));
  };

  const plActive = isDesktopPlActive(pathname);
  const wc26Active = isDesktopWc26Active(pathname);

  return (
    <div className={styles.chromeWrap} data-gc-chrome="site-header">
      <header className={styles.masterHeader} role="banner">
        <div className={styles.bar}>
          <Link href="/" className={styles.brand} onClick={closeDropdowns}>
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

        <nav
          ref={navRef}
          className={styles.desktopNav}
          aria-label="Main navigation"
        >
          {DESKTOP_PRIMARY_NAV.map((item) => {
            const active = isMainNavActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                onClick={closeDropdowns}
              >
                {item.label}
              </Link>
            );
          })}

          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setOpenDropdown("pl")}
            onMouseLeave={() =>
              setOpenDropdown((current) => (current === "pl" ? null : current))
            }
          >
            <button
              type="button"
              className={`${styles.navBtn} ${plActive ? styles.navLinkActive : ""} ${openDropdown === "pl" ? styles.navBtnOpen : ""}`}
              aria-expanded={openDropdown === "pl"}
              onClick={() => toggleDropdown("pl")}
            >
              PL 26/27 ▾
            </button>
            {openDropdown === "pl" ? (
              <div className={styles.dropdownPanel}>
                {DESKTOP_PL_DROPDOWN.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={styles.dropdownLink}
                    onClick={closeDropdowns}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div
            className={styles.dropdownWrap}
            onMouseEnter={() => setOpenDropdown("wc26")}
            onMouseLeave={() =>
              setOpenDropdown((current) => (current === "wc26" ? null : current))
            }
          >
            <button
              type="button"
              className={`${styles.navBtn} ${wc26Active ? styles.navLinkActive : ""} ${openDropdown === "wc26" ? styles.navBtnOpen : ""}`}
              aria-expanded={openDropdown === "wc26"}
              onClick={() => toggleDropdown("wc26")}
            >
              WC26 ▾
            </button>
            {openDropdown === "wc26" ? (
              <div className={styles.dropdownPanel}>
                {DESKTOP_WC26_DROPDOWN.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={styles.dropdownLink}
                    onClick={closeDropdowns}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

        </nav>
      </header>

      <LiveRibbon />
    </div>
  );
}

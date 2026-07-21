"use client";

import { useLayoutEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import NavLink from "@/components/nav/NavLink";
import {
  DESKTOP_PL_DROPDOWN,
  DESKTOP_PRIMARY_NAV,
  isDesktopPlActive,
  isMainNavActive,
} from "@/lib/nav";
import HeaderNavDropdown from "./HeaderNavDropdown";
import LiveRibbon from "./LiveRibbon";
import HeaderLocaleDropdown from "./HeaderLocaleDropdown";
import { trackSubscriptionStart } from "@/lib/analytics";
import AuthMenu from "@/components/firebase/AuthMenu";
import ThemeToggle from "@/components/theme/ThemeToggle";
import styles from "./master-chrome.module.css";

function openSubscribeDialog() {
  trackSubscriptionStart({
    plan_id: "newsletter_pending",
    plan_name: "Newsletter",
    billing_period: "unknown",
    currency: "GBP",
    value: 0,
    source_surface: "header_subscribe",
  });
  window.dispatchEvent(new CustomEvent("gc:subscribe-open"));
}

export default function MasterHeader() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tCommon = useTranslations("common");
  const isHome = pathname === "/";
  const isMatchPage = pathname.startsWith("/match/");
  const chromeRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const chrome = chromeRef.current;
    if (!chrome) {
      return;
    }

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--gc-site-header-height",
        `${chrome.offsetHeight}px`,
      );
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(chrome);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, [isHome]);

  return (
    <div
      ref={chromeRef}
      className={`${styles.chromeWrap} ${isHome ? styles.chromeWrapV5 : ""}`}
      data-gc-chrome="site-header"
    >
      <header
        className={`${styles.masterHeader} ${isHome ? styles.masterHeaderV5 : ""}`}
        role="banner"
      >
        <div className={styles.bar}>
          <NavLink href="/" className={styles.brand}>
            <div className={styles.brandLogoWrap}>
              <img
                src="/logo.svg"
                alt="GoalCurrent"
                width={48}
                height={48}
                decoding="async"
              />
            </div>
            <div className={styles.brandName}>
              Goal<span>Current</span>.live
            </div>
          </NavLink>

          <nav className={styles.desktopNav} aria-label={t("mainNavigation")}>
            {DESKTOP_PRIMARY_NAV.map((item) => {
              const active = isMainNavActive(pathname, item.href, item.exact);
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                >
                  {t(item.labelKey)}
                </NavLink>
              );
            })}
            <HeaderNavDropdown
              label={t("pl2627")}
              links={DESKTOP_PL_DROPDOWN}
              isActive={isDesktopPlActive(pathname)}
            />
          </nav>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <HeaderLocaleDropdown />
            <AuthMenu />
            <button
              type="button"
              className={styles.headerSubscribe}
              onClick={openSubscribeDialog}
            >
              {tCommon("subscribe")}
            </button>
          </div>
        </div>
      </header>

      {!isHome && !isMatchPage ? <LiveRibbon /> : null}
    </div>
  );
}

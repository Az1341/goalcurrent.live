"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  getLocaleShortLabel,
  LANGUAGE_MENU_ICON,
  LOCALES,
  type AppLocale,
} from "@/i18n/locales";
import styles from "./master-chrome.module.css";

export default function HeaderLocaleDropdown() {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [panelPos, setPanelPos] = useState<{ top: number; left: number } | null>(
    null,
  );

  const syncPanelPos = useCallback(() => {
    const button = buttonRef.current;
    if (!button) {
      return;
    }
    const rect = button.getBoundingClientRect();
    setPanelPos({ top: rect.bottom - 1, left: rect.left });
  }, []);

  useLayoutEffect(() => {
    if (!open) {
      setPanelPos(null);
      return;
    }
    syncPanelPos();
    window.addEventListener("resize", syncPanelPos);
    window.addEventListener("scroll", syncPanelPos, true);
    return () => {
      window.removeEventListener("resize", syncPanelPos);
      window.removeEventListener("scroll", syncPanelPos, true);
    };
  }, [open, syncPanelPos]);

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const handleSelect = (nextLocale: AppLocale) => {
    closeMenu();
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
      router.refresh();
    }
  };

  return (
    <div
      className={styles.dropdownWrap}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
      onFocus={openMenu}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          closeMenu();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.localeBtn} ${open ? styles.localeBtnOpen : ""}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={panelId}
        aria-label={t("language")}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeMenu();
          }
        }}
      >
        <span className={styles.localeIcon} aria-hidden="true">
          {LANGUAGE_MENU_ICON}
        </span>
        <span className={styles.localeLabel}>{getLocaleShortLabel(locale)}</span>
        <span className={styles.localeChevron} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && panelPos ? (
        <div
          id={panelId}
          className={styles.dropdownPanel}
          role="menu"
          style={{
            position: "fixed",
            top: panelPos.top,
            left: panelPos.left,
          }}
        >
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              className={`${styles.dropdownLink} ${styles.localeMenuItem} ${
                locale === code ? styles.localeMenuItemActive : ""
              }`}
              role="menuitem"
              aria-current={locale === code ? "true" : undefined}
              onClick={() => handleSelect(code)}
            >
              {getLocaleShortLabel(code)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

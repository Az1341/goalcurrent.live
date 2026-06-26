"use client";

import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import NavLink from "@/components/nav/NavLink";
import {
  getLocaleShortLabel,
  LOCALES,
  LANGUAGE_MENU_ICON,
  type AppLocale,
} from "@/i18n/locales";
import { useEffect, useState } from "react";
import {
  MORE_SHEET_LEVEL1,
  MORE_SHEET_SUBMENU_TITLE_KEYS,
  MORE_SHEET_SUBMENUS,
  type MoreSheetSubmenuId,
  isMoreSheetLinkActive,
} from "@/lib/nav";
import AuthMenu from "@/components/firebase/AuthMenu";
import styles from "./MoreBottomSheet.module.css";

type MoreBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function MoreBottomSheet({ open, onClose }: MoreBottomSheetProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale() as AppLocale;
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const [submenu, setSubmenu] = useState<MoreSheetSubmenuId | null>(null);
  const activeSubmenu = open ? submenu : null;

  useEffect(() => {
    if (!open) {
      setSubmenu(null);
    }
  }, [open]);

  const handleClose = () => {
    setSubmenu(null);
    onClose();
  };

  const handleNavigate = () => {
    setSubmenu(null);
    onClose();
  };

  const handleLocaleChange = (nextLocale: AppLocale) => {
    if (nextLocale === locale) {
      handleNavigate();
      return;
    }
    router.replace(pathname, { locale: nextLocale });
    handleNavigate();
  };

  const submenuTitle = activeSubmenu
    ? t(MORE_SHEET_SUBMENU_TITLE_KEYS[activeSubmenu])
    : t("more");

  return (
    <>
      <div
        className={`${styles.moreOverlay} ${open ? styles.moreOverlayOpen : ""}`}
        onClick={handleClose}
        aria-hidden={!open}
      />

      <div
        className={`${styles.sheet} ${open ? styles.sheetOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={t("openMoreNavigation")}
        aria-hidden={!open}
        data-gc-chrome="more-sheet"
      >
        <div className={styles.sheetHeader}>
          {activeSubmenu ? (
            <button
              type="button"
              className={styles.backBtn}
              aria-label={t("backToMenu")}
              onClick={() => setSubmenu(null)}
            >
              ←
            </button>
          ) : (
            <span className={styles.headerSpacer} aria-hidden="true" />
          )}

          <h2 className={styles.sheetTitle}>{submenuTitle}</h2>

          <button
            type="button"
            className={styles.closeBtn}
            aria-label={t("closeMenu")}
            onClick={handleClose}
          >
            ×
          </button>
        </div>

        <div className={styles.panelStack}>
          <div
            className={`${styles.panel} ${activeSubmenu ? styles.panelHidden : styles.panelActive}`}
            aria-hidden={Boolean(activeSubmenu)}
          >
            <nav className={styles.sheetList} aria-label={t("openMoreNavigation")}>
              {MORE_SHEET_LEVEL1.map((item, index) => {
                if (item.type === "divider") {
                  return <hr key={`divider-${index}`} className={styles.sheetDivider} />;
                }

                if (item.type === "submenu") {
                  const isLanguage = item.id === "language";
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`${styles.sheetRow} ${isLanguage ? styles.sheetRowLanguage : ""}`}
                      aria-haspopup="menu"
                      aria-expanded={activeSubmenu === item.id}
                      onClick={() => setSubmenu(item.id)}
                    >
                      {isLanguage ? (
                        <span className={styles.sheetRowLeading}>
                          <span className={styles.sheetRowIcon} aria-hidden="true">
                            {LANGUAGE_MENU_ICON}
                          </span>
                          <span className={styles.sheetRowLabel}>
                            <span className={styles.sheetRowTitle}>{t(item.labelKey)}</span>
                            <span className={styles.sheetRowMeta}>
                              {getLocaleShortLabel(locale)}
                            </span>
                          </span>
                        </span>
                      ) : (
                        <span>{t(item.labelKey)}</span>
                      )}
                      <span className={styles.chevron} aria-hidden="true">
                        ▾
                      </span>
                    </button>
                  );
                }

                if (item.external) {
                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`${styles.sheetLink} ${styles.sheetLinkExternal}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={handleNavigate}
                    >
                      {t(item.labelKey)}
                    </a>
                  );
                }

                const active = isMoreSheetLinkActive(pathname, item.href);

                return (
                  <NavLink
                    key={item.href}
                    href={item.href}
                    className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavigate}
                  >
                    {t(item.labelKey)}
                  </NavLink>
                );
              })}
            </nav>
            <div className={styles.sheetAccount}>
              <h3 className={styles.sheetAccountTitle}>{tAuth("account")}</h3>
              <AuthMenu variant="sheet" onAction={handleNavigate} />
            </div>
          </div>

          <div
            className={`${styles.panel} ${activeSubmenu ? styles.panelActive : styles.panelHidden}`}
            aria-hidden={!activeSubmenu}
          >
            {activeSubmenu === "language" ? (
              <ul className={styles.sheetList} aria-label={t("language")}>
                {LOCALES.map((code) => {
                  const isActive = locale === code;
                  return (
                    <li key={code}>
                    <button
                      type="button"
                      className={`${styles.langRow} ${isActive ? styles.langRowActive : ""}`}
                      aria-current={isActive ? "true" : undefined}
                      onClick={() => handleLocaleChange(code)}
                    >
                      <span className={styles.langLabel}>{getLocaleShortLabel(code)}</span>
                      {isActive ? (
                        <span className={styles.langCheck} aria-hidden="true">
                          ✓
                        </span>
                      ) : null}
                    </button>
                    </li>
                  );
                })}
              </ul>
            ) : activeSubmenu ? (
              <nav className={styles.sheetList} aria-label={`${submenuTitle} links`}>
                {MORE_SHEET_SUBMENUS[activeSubmenu].map((link, index) => {
                  const key = `${activeSubmenu}-${link.labelKey}-${index}`;
                  const active = !link.external && isMoreSheetLinkActive(pathname, link.href);

                  if (link.external) {
                    return (
                      <a
                        key={key}
                        href={link.href}
                        className={`${styles.sheetLink} ${styles.sheetLinkExternal}`}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        onClick={handleNavigate}
                      >
                        {t(link.labelKey)}
                      </a>
                    );
                  }

                  return (
                    <NavLink
                      key={key}
                      href={link.href}
                      className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={handleNavigate}
                    >
                      {t(link.labelKey)}
                    </NavLink>
                  );
                })}
              </nav>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

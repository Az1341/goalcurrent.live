"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  MORE_SHEET_LEVEL1,
  MORE_SHEET_SUBMENU_TITLES,
  MORE_SHEET_SUBMENUS,
  type MoreSheetSubmenuId,
  isMoreSheetLinkActive,
} from "@/lib/nav";
import styles from "./MoreBottomSheet.module.css";

type MoreBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function MoreBottomSheet({ open, onClose }: MoreBottomSheetProps) {
  const pathname = usePathname();
  const [submenu, setSubmenu] = useState<MoreSheetSubmenuId | null>(null);
  const activeSubmenu = open ? submenu : null;

  const handleClose = () => {
    setSubmenu(null);
    onClose();
  };

  const handleNavigate = () => {
    setSubmenu(null);
    onClose();
  };

  const submenuTitle = activeSubmenu ? MORE_SHEET_SUBMENU_TITLES[activeSubmenu] : "More";

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
        aria-label="More navigation"
        aria-hidden={!open}
      >
        <div className={styles.sheetHeader}>
          {activeSubmenu ? (
            <button
              type="button"
              className={styles.backBtn}
              aria-label="Back to menu"
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
            aria-label="Close menu"
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
            <nav className={styles.sheetList} aria-label="More menu">
              {MORE_SHEET_LEVEL1.map((item, index) => {
                if (item.type === "divider") {
                  return <hr key={`divider-${index}`} className={styles.sheetDivider} />;
                }

                if (item.type === "submenu") {
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={styles.sheetRow}
                      onClick={() => setSubmenu(item.id)}
                    >
                      <span>{item.label}</span>
                      <span className={styles.chevron} aria-hidden="true">
                        ›
                      </span>
                    </button>
                  );
                }

                if (item.external) {
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`${styles.sheetLink} ${styles.sheetLinkExternal}`}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      onClick={handleNavigate}
                    >
                      {item.label}
                    </a>
                  );
                }

                const active = isMoreSheetLinkActive(pathname, item.href);

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavigate}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            className={`${styles.panel} ${activeSubmenu ? styles.panelActive : styles.panelHidden}`}
            aria-hidden={!activeSubmenu}
          >
            {activeSubmenu && (
              <nav className={styles.sheetList} aria-label={`${submenuTitle} links`}>
                {MORE_SHEET_SUBMENUS[activeSubmenu].map((link, index) => {
                  const key = `${activeSubmenu}-${link.label}-${index}`;
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
                        {link.label}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={key}
                      href={link.href}
                      className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={handleNavigate}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

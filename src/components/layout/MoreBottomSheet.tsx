"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MORE_SHEET_NAV } from "@/lib/nav";
import styles from "./MoreBottomSheet.module.css";

type MoreBottomSheetProps = {
  open: boolean;
  onClose: () => void;
};

export default function MoreBottomSheet({ open, onClose }: MoreBottomSheetProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`${styles.moreOverlay} ${open ? styles.moreOverlayOpen : ""}`}
        onClick={onClose}
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
          <h2 className={styles.sheetTitle}>More</h2>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close menu"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <nav className={styles.sheetList} aria-label="More links">
          {MORE_SHEET_NAV.map((link) => {
            if (link.external) {
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className={`${styles.sheetLink} ${styles.sheetLinkExternal}`}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={onClose}
                >
                  {link.label}
                </a>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={styles.sheetLink}
                aria-current={pathname === link.href ? "page" : undefined}
                onClick={onClose}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}

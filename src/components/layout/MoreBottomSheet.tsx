"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MORE_SHEET_SECTIONS, isMoreSheetLinkActive } from "@/lib/nav";
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

        <div className={styles.sheetList}>
          {MORE_SHEET_SECTIONS.map((section) => (
            <section key={section.title} aria-labelledby={`more-${section.title}`}>
              <h3
                id={`more-${section.title}`}
                className={styles.sheetSectionLabel}
              >
                {section.title}
              </h3>
              <nav aria-label={`${section.title} links`}>
                {section.links.map((link) => {
                  const active = !link.external && isMoreSheetLinkActive(pathname, link.href);

                  if (link.external) {
                    return (
                      <a
                        key={`${section.title}-${link.label}`}
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
                      key={`${section.title}-${link.label}`}
                      href={link.href}
                      className={`${styles.sheetLink} ${active ? styles.sheetLinkActive : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={onClose}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

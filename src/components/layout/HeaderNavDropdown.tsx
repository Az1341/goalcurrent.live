"use client";

import Link from "next/link";
import { useCallback, useId, useState } from "react";
import type { NavLinkItem } from "@/lib/nav";
import styles from "./master-chrome.module.css";

type HeaderNavDropdownProps = {
  label: string;
  links: readonly NavLinkItem[];
  isActive: boolean;
};

export default function HeaderNavDropdown({
  label,
  links,
  isActive,
}: HeaderNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);

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
        type="button"
        className={`${styles.navBtn} ${isActive || open ? styles.navBtnOpen : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            closeMenu();
          }
        }}
      >
        {label}
        <span aria-hidden="true"> ▾</span>
      </button>

      {open ? (
        <div id={panelId} className={styles.dropdownPanel} role="menu">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.dropdownLink}
              role="menuitem"
              onClick={closeMenu}
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

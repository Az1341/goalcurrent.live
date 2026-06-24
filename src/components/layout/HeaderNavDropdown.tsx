"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import NavLink from "@/components/nav/NavLink";
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
          {links.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={styles.dropdownLink}
              role="menuitem"
              onClick={closeMenu}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </div>
  );
}

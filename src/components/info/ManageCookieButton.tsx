"use client";

import { COOKIE_CONSENT_KEY } from "@/lib/site-keys";
import styles from "./info-pages.module.css";

export default function ManageCookieButton() {
  function handleClick() {
    try {
      localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      /* private mode */
    }
    window.location.reload();
  }

  return (
    <button type="button" className={styles.btnPrimary} onClick={handleClick}>
      Manage Cookie Preferences
    </button>
  );
}

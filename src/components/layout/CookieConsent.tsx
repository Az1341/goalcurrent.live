"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { COOKIE_CONSENT_KEY } from "@/lib/site-keys";
import styles from "./master-chrome.module.css";

export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) setOpen(true);
    } catch {
      /* private mode */
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className={styles.cookieDialog} role="dialog" aria-label="Cookie consent">
      <p className={styles.cookieText}>
        We use cookies to personalise content and analyse traffic.{" "}
        <Link href="/about" style={{ color: "#9b1b30", fontWeight: 600 }}>
          Cookie Policy
        </Link>
      </p>
      <div className={styles.cookieActions}>
        <button
          type="button"
          className={styles.cookieBtnSecondary}
          onClick={() => setOpen(false)}
        >
          Decline
        </button>
        <button type="button" className={styles.cookieBtnPrimary} onClick={accept}>
          Accept ✓
        </button>
      </div>
    </div>
  );
}

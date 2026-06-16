"use client";

import { useEffect, useState } from "react";
import {
  COOKIE_CONSENT_KEY,
  SUBSCRIBE_POPUP_DISMISSED,
  SUBSCRIBE_POPUP_KEY,
} from "@/lib/site-keys";
import styles from "./master-chrome.module.css";

export default function SubscribePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBE_POPUP_KEY) === SUBSCRIBE_POPUP_DISMISSED) return;
      const timer = window.setTimeout(() => setOpen(true), 1200);
      return () => window.clearTimeout(timer);
    } catch {
      /* private mode */
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(SUBSCRIBE_POPUP_KEY, SUBSCRIBE_POPUP_DISMISSED);
    } catch {
      /* ignore */
    }
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className={styles.subscribeBackdrop} role="dialog" aria-label="Subscribe">
      <div className={styles.subscribeCard}>
        <h2 className={styles.subscribeTitle}>⚽ Stay ahead of the game</h2>
        <p className={styles.subscribeText}>
          Get World Cup 2026 goals, results and news straight to your inbox.
          Placeholder — no tracking yet.
        </p>
        <input
          type="email"
          className={styles.subscribeInput}
          placeholder="Your email"
          readOnly
          aria-label="Email placeholder"
        />
        <button type="button" className={styles.subscribePrimary} onClick={dismiss}>
          Subscribe (placeholder)
        </button>
        <button type="button" className={styles.subscribeDismiss} onClick={dismiss}>
          No thanks
        </button>
      </div>
    </div>
  );
}

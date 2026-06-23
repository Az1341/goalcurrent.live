"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_ACCEPTED,
  COOKIE_CONSENT_DECLINED,
  COOKIE_CONSENT_KEY,
} from "@/lib/site-keys";
import styles from "./master-chrome.module.css";

const CONSENT_EVENT = "gc:cookie-consent-change";

function subscribeConsent(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
}

function shouldShowConsentBanner(): boolean {
  try {
    const value = localStorage.getItem(COOKIE_CONSENT_KEY);
    return value !== COOKIE_CONSENT_ACCEPTED && value !== COOKIE_CONSENT_DECLINED;
  } catch {
    return false;
  }
}

export default function CookieConsent() {
  const open = useSyncExternalStore(
    subscribeConsent,
    shouldShowConsentBanner,
    () => false,
  );

  function persistChoice(value: string) {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
  }

  function accept() {
    persistChoice(COOKIE_CONSENT_ACCEPTED);
  }

  function decline() {
    persistChoice(COOKIE_CONSENT_DECLINED);
  }

  if (!open) return null;

  return (
    <div className={styles.cookieDialog} role="dialog" aria-label="Cookie consent">
      <p className={styles.cookieText}>
        We use cookies to personalise content and analyse traffic.{" "}
        <Link href="/cookies" className={styles.cookiePolicyLink}>
          Cookie Policy
        </Link>
      </p>
      <div className={styles.cookieActions}>
        <button
          type="button"
          className={styles.cookieBtnSecondary}
          onClick={decline}
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

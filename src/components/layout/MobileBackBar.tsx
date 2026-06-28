"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import {
  getMobileBackFallback,
  shouldShowMobileBack,
} from "@/lib/nav";
import styles from "./MobileBackBar.module.css";

function BackChevronIcon() {
  return (
    <svg
      className={styles.icon}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="currentColor"
        d="M14.5 5 8 11.5 14.5 18l1.4-1.4L10.8 11.5 15.9 6.4 14.5 5Z"
      />
    </svg>
  );
}

export default function MobileBackBar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("nav");

  const handleBack = useCallback(() => {
    const fallback = getMobileBackFallback(pathname);
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallback);
  }, [pathname, router]);

  if (!shouldShowMobileBack(pathname)) {
    return null;
  }

  return (
    <div className={styles.wrap} data-gc-chrome="mobile-back-bar">
      <button
        type="button"
        className={styles.button}
        aria-label={t("back")}
        onClick={handleBack}
      >
        <BackChevronIcon />
        <span>{t("back")}</span>
      </button>
    </div>
  );
}
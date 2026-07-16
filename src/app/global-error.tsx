"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useMemo } from "react";
import { DEFAULT_LOCALE, LOCALES, type AppLocale } from "@/i18n/locales";
import styles from "@/components/ui/trust-pages.module.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function resolveDocumentLocale(): AppLocale {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE;
  }

  const cookieMatch = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]+)/);
  const fromCookie = cookieMatch?.[1]?.trim();
  if (fromCookie && (LOCALES as readonly string[]).includes(fromCookie)) {
    return fromCookie as AppLocale;
  }

  const htmlLang = document.documentElement.lang?.trim();
  if (htmlLang && (LOCALES as readonly string[]).includes(htmlLang)) {
    return htmlLang as AppLocale;
  }

  return DEFAULT_LOCALE;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const locale = useMemo(() => resolveDocumentLocale(), []);

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang={locale}>
      <body>
        <main className={styles.page}>
          <div className={styles.card}>
            <p className={styles.code}>Error</p>
            <h1>Something went wrong</h1>
            <p>Please try again or refresh the page.</p>
            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={() => reset()}>
                Try again
              </button>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
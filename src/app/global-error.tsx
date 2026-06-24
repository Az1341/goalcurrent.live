"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import styles from "@/components/ui/trust-pages.module.css";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
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
"use client";

import Link from "next/link";
import { useEffect } from "react";
import styles from "@/components/ui/trust-pages.module.css";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>Error</p>
        <h1>Something went wrong</h1>
        <p>Please try again or return home.</p>
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={() => reset()}>
            Try again
          </button>
          <Link href="/" className={styles.secondary}>
            Return home
          </Link>
        </div>
      </div>
    </main>
  );
}
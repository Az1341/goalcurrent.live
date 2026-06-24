import Link from "next/link";
import styles from "@/components/ui/trust-pages.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist or may have moved.</p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Return home
          </Link>
          <Link href="/live" className={styles.secondary}>
            Live scores
          </Link>
        </div>
      </div>
    </main>
  );
}
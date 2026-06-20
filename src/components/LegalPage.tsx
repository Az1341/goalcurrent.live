import Link from "next/link";
import styles from "@/components/info/info-pages.module.css";

type LegalPageProps = {
  title: string;
  intro: string;
  updated?: string;
  children: React.ReactNode;
};

export default function LegalPage({
  title,
  intro,
  updated,
  children,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <div className={styles.stack}>
        <article className={styles.card}>
          <h1>{title}</h1>
          {updated ? <p className={styles.updated}>Last updated: {updated}</p> : null}
          <p className={styles.intro}>{intro}</p>
          {children}
          <div className={styles.btnRow}>
            <Link href="/" className={styles.btnSecondary}>
              ← Back to Home
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}

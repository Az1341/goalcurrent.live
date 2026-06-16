import Link from "next/link";
import styles from "@/components/layout/layout.module.css";

type LegalPageProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
};

export default function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <main className={styles.content}>
      <article className={styles.legalArticle}>
        <h1>{title}</h1>
        <p className={styles.legalIntro}>{intro}</p>
        {children}
        <p className={styles.legalBack}>
          <Link href="/">← Back to Home</Link>
        </p>
      </article>
    </main>
  );
}

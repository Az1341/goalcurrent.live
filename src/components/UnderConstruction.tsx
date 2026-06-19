import Link from "next/link";
import { SITE_NAME } from "@/lib/site-url";
import styles from "@/components/layout/layout.module.css";

type UnderConstructionProps = {
  title: string;
  emoji?: string;
  description?: string;
};

export default function UnderConstruction({
  title,
  emoji = "🚧",
  description = `This section is being built for ${SITE_NAME}. Check back soon.`,
}: UnderConstructionProps) {
  return (
    <main className={styles.content}>
      <div className={styles.stub}>
        <span className={styles.stubEmoji} aria-hidden="true">
          {emoji}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link href="/" className={styles.stubBtn}>
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}

import Link from "next/link";
import { SITE_NAME } from "@/lib/site-url";
import styles from "@/components/layout/layout.module.css";

export type ComingSoonLink = {
  href: string;
  label: string;
};

type UnderConstructionProps = {
  title: string;
  emoji?: string;
  description?: string;
  links?: ComingSoonLink[];
  backHref?: string;
  backLabel?: string;
};

export default function UnderConstruction({
  title,
  emoji = "🚧",
  description = `This section is being built for ${SITE_NAME}. Check back soon.`,
  links = [],
  backHref = "/",
  backLabel = "← Back to Home",
}: UnderConstructionProps) {
  return (
    <main className={styles.content}>
      <div className={styles.stub}>
        <span className={styles.stubEmoji} aria-hidden="true">
          {emoji}
        </span>
        <h1>{title}</h1>
        <p>{description}</p>
        {links.length > 0 && (
          <nav
            aria-label="Related links"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            {links.map((link) => (
              <Link key={link.href} href={link.href} className={styles.stubBtn}>
                {link.label}
              </Link>
            ))}
          </nav>
        )}
        <Link href={backHref} className={styles.stubBtn}>
          {backLabel}
        </Link>
      </div>
    </main>
  );
}

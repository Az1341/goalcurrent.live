import Link from "next/link";
import styles from "./seo.module.css";

export type RelatedLink = {
  href: string;
  label: string;
};

type RelatedInternalLinksProps = {
  title?: string;
  links: readonly RelatedLink[];
};

export default function RelatedInternalLinks({
  title = "Related on GoalCurrent.live",
  links,
}: RelatedInternalLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <aside className={styles.related}>
      <p className={styles.relatedTitle}>{title}</p>
      <ul className={styles.relatedList}>
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

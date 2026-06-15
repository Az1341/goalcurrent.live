import Link from "next/link";
import styles from "./wc26.module.css";

type Wc26BreadcrumbProps = {
  items: { label: string; href?: string }[];
};

export default function Wc26Breadcrumb({ items }: Wc26BreadcrumbProps) {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} style={{ display: "contents" }}>
          {index > 0 && (
            <span className={styles.breadcrumbSep} aria-hidden="true">
              /
            </span>
          )}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

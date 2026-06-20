import Link from "next/link";
import styles from "./info-pages.module.css";

type InfoPageShellProps = {
  children: React.ReactNode;
};

export default function InfoPageShell({ children }: InfoPageShellProps) {
  return <main className={styles.page}>{children}</main>;
}

type InfoBackLinkProps = {
  href?: string;
  label?: string;
};

export function InfoBackLink({
  href = "/",
  label = "← Back to Home",
}: InfoBackLinkProps) {
  return (
    <div className={styles.btnRow}>
      <Link href={href} className={styles.btnSecondary}>
        {label}
      </Link>
    </div>
  );
}

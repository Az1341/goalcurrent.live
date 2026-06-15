import Link from "next/link";
import { FOOTER_LINKS } from "@/lib/nav";
import styles from "./layout.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLinks}>
        {FOOTER_LINKS.map(({ href, label }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
      <p className={styles.footerCopy}>
        © 2026 <strong>Ashna4All</strong> · Ahmad Zafarani · GoalCurrent.online
        <br />
        Independent fan site · Not affiliated with FIFA, UEFA or the Premier League
      </p>
    </footer>
  );
}

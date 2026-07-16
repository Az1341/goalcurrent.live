import { NORDVPN_HREF } from "@/lib/site-keys";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlCommercialStrip.module.css";

export default function PlCommercialStrip() {
  return (
    <aside
      className={styles.strip}
      role="complementary"
      aria-label="NordVPN partner offer"
      data-gc-pl-nord=""
    >
      <span className={styles.stripBadge}>Partner</span>
      <p className={styles.stripText}>
        Watch Premier League abroad securely on {SITE_NAME} with NordVPN.
      </p>
      <a
        className={styles.stripCta}
        href={NORDVPN_HREF}
        target="_blank"
        rel="noopener noreferrer sponsored"
      >
        Get NordVPN →
      </a>
    </aside>
  );
}

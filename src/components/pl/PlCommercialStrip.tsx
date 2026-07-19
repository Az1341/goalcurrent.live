import { SITE_NAME } from "@/lib/site-url";
import NordVpnAffiliateCta from "@/components/analytics/NordVpnAffiliateCta";
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
      <NordVpnAffiliateCta
        className={styles.stripCta}
        sourceSurface="pl_commercial_strip"
      >
        Get NordVPN →
      </NordVpnAffiliateCta>
    </aside>
  );
}

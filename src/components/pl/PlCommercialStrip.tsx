import AdSenseUnit from "@/components/AdSenseUnit";
import { NORDVPN_HREF } from "@/lib/site-keys";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlCommercialStrip.module.css";

type PlAdSlotProps = {
  slot: string;
  className?: string;
};

export function PlAdSlot({ slot, className = "" }: PlAdSlotProps) {
  return (
    <div className={`${styles.adWrap} ${className}`.trim()} data-gc-pl-ad="">
      <AdSenseUnit slot={slot} />
    </div>
  );
}

/** Mobile-only fixtures ad — below matchweek pills on small screens. */
export function PlMobileAdSlot({ slot }: { slot: string }) {
  return (
    <div className={styles.mobileAdWrap} data-gc-pl-mobile-ad="">
      <AdSenseUnit slot={slot} showPlaceholder />
    </div>
  );
}

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

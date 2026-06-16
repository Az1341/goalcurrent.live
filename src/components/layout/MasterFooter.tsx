import Link from "next/link";
import { FOOTER_LINKS, FOOTER_SOCIAL } from "@/lib/nav";
import { NORDVPN_HREF } from "@/lib/site-keys";
import styles from "./master-chrome.module.css";

export default function MasterFooter() {
  return (
    <footer className={styles.masterFooter} data-gc-chrome="site-footer">
      <div className={styles.footerInner}>
        <nav className={styles.footerNav} aria-label="Footer">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} href={link.href}>{link.label}</Link>
          ))}
        </nav>

        <div className={styles.footerSocial} aria-label="Social media">
          {FOOTER_SOCIAL.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              {social.label}
            </a>
          ))}
        </div>

        <div
          className={styles.nordVpn}
          role="complementary"
          aria-label="Affiliate promotion"
          data-gc-chrome="nordvpn"
        >
          <span>🔒 Stream securely abroad — NordVPN affiliate</span>
          <span className={styles.nordAd}>AD</span>
          <a className={styles.nordCta} href={NORDVPN_HREF} rel="noopener noreferrer sponsored">
            Get NordVPN →
          </a>
        </div>

        <p className={styles.footerCopy}>
          © 2026 Ashna4All · Ahmad Zafarani · GoalCurrent.online independent fan
          site · Not affiliated with FIFA, UEFA or the Premier League.
        </p>
      </div>
    </footer>
  );
}

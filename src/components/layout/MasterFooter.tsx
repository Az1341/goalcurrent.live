"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FOOTER_LINKS, FOOTER_SOCIAL } from "@/lib/nav";
import { NORDVPN_HREF } from "@/lib/site-keys";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./master-chrome.module.css";

export default function MasterFooter() {
  const t = useTranslations("nav");
  const tLayout = useTranslations("layout.footer");

  return (
    <footer className={styles.masterFooter} data-gc-chrome="site-footer">
      <div className={styles.footerInner}>
        <nav className={styles.footerNav} aria-label={tLayout("ariaLabel")}>
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {t(link.labelKey)}
            </Link>
          ))}
        </nav>

        <div className={styles.footerSocial} aria-label={tLayout("socialAria")}>
          {FOOTER_SOCIAL.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t(social.labelKey)}
            >
              {t(social.labelKey)}
            </a>
          ))}
        </div>

        <div
          className={styles.nordVpn}
          role="complementary"
          aria-label="Affiliate promotion"
          data-gc-chrome="nordvpn"
        >
          <span>{tLayout("nordVpn")}</span>
          <span className={styles.nordAd}>{tLayout("nordAd")}</span>
          <a className={styles.nordCta} href={NORDVPN_HREF} rel="noopener noreferrer sponsored">
            {tLayout("nordCta")}
          </a>
        </div>

        <p className={styles.footerCopy}>
          {tLayout("copyright", {
            year: new Date().getFullYear(),
            siteName: SITE_NAME,
          })}
        </p>
      </div>
    </footer>
  );
}

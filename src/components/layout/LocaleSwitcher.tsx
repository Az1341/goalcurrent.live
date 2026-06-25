"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LOCALE_META, LOCALES, type AppLocale } from "@/i18n/locales";
import styles from "./locale-switcher.module.css";

export default function LocaleSwitcher() {
  const t = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <label className={styles.wrap}>
      <span className={styles.srOnly}>{t("language")}</span>
      <select
        className={styles.select}
        value={locale}
        aria-label={t("language")}
        onChange={(event) => {
          const nextLocale = event.target.value as AppLocale;
          router.replace(pathname, { locale: nextLocale });
        }}
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_META[code].label}
          </option>
        ))}
      </select>
    </label>
  );
}

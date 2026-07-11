"use client";

import { useTranslations } from "next-intl";
import SocialIcon from "@/components/layout/SocialIcon";
import { FOOTER_SOCIAL } from "@/lib/nav";

type SocialLinksProps = {
  linkClassName?: string;
  iconClassName?: string;
  showLabel?: boolean;
};

export default function SocialLinks({
  linkClassName,
  iconClassName,
  showLabel = false,
}: SocialLinksProps) {
  const t = useTranslations("nav");

  return (
    <>
      {FOOTER_SOCIAL.map((social) => (
        <a
          key={social.href}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t(social.labelKey)}
          className={linkClassName}
        >
          <SocialIcon name={social.icon} className={iconClassName} />
          {showLabel ? t(social.labelKey) : null}
        </a>
      ))}
    </>
  );
}
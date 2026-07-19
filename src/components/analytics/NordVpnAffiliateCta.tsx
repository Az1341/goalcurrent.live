"use client";

import AffiliateOutboundLink from "@/components/analytics/AffiliateOutboundLink";
import { NORDVPN_HREF } from "@/lib/site-keys";
import type { ReactNode } from "react";

type NordVpnAffiliateCtaProps = {
  className?: string;
  sourceSurface?: string;
  children: ReactNode;
};

export default function NordVpnAffiliateCta({
  className,
  sourceSurface = "nordvpn_cta",
  children,
}: NordVpnAffiliateCtaProps) {
  return (
    <AffiliateOutboundLink
      href={NORDVPN_HREF}
      partnerId="nordvpn"
      partnerName="NordVPN"
      offerId="15"
      offerType="vpn_affiliate"
      sourceSurface={sourceSurface}
      className={className}
      target="_blank"
      rel="noopener noreferrer sponsored"
    >
      {children}
    </AffiliateOutboundLink>
  );
}

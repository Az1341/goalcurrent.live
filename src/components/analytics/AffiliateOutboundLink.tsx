"use client";

import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/analytics";

type AffiliateOutboundLinkProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick"
> & {
  href: string;
  partnerId: string;
  partnerName: string;
  offerId: string;
  offerType: string;
  sourceSurface?: string;
  matchId?: string;
  children: ReactNode;
};

function destinationDomain(href: string): string {
  try {
    return new URL(href).hostname;
  } catch {
    return "unknown";
  }
}

export default function AffiliateOutboundLink({
  href,
  partnerId,
  partnerName,
  offerId,
  offerType,
  sourceSurface = "affiliate_link",
  matchId,
  children,
  ...rest
}: AffiliateOutboundLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    event.stopPropagation();
    trackAffiliateClick({
      partner_id: partnerId,
      partner_name: partnerName,
      offer_id: offerId,
      offer_type: offerType,
      destination_domain: destinationDomain(href),
      source_surface: sourceSurface,
      ...(matchId ? { match_id: matchId } : {}),
    });
  }

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}

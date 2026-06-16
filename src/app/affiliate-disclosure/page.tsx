import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/page-metadata";
import { NORDVPN_HREF } from "@/lib/site-keys";

export const metadata: Metadata = buildPageMetadata({
  title: "Affiliate Disclosure",
  description:
    "Affiliate disclosure for GoalCurrent.online — NordVPN and other partner links.",
  path: "/affiliate-disclosure",
});

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      title="Affiliate Disclosure"
      intro="Some links on GoalCurrent.online may earn a commission at no extra cost to you."
    >
      <section>
        <h2>NordVPN</h2>
        <p>
          The footer may include a NordVPN affiliate link (
          <a href={NORDVPN_HREF} rel="noopener noreferrer sponsored">
            NordVPN offer
          </a>
          ). Content is labelled as advertising where shown.
        </p>
        <p>
          Replace the placeholder affiliate ID in{" "}
          <code>src/lib/site-keys.ts</code> before relying on live tracking.
        </p>
      </section>
      <section>
        <h2>Editorial independence</h2>
        <p>
          Affiliate relationships do not affect fixture data, standings
          calculations, or WC26 schedule metadata on this site.
        </p>
      </section>
    </LegalPage>
  );
}

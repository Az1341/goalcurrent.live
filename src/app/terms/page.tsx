import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms of Use",
  description:
    `Terms of use for ${SITE_NAME} — independent FIFA World Cup 2026 fan site.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      intro={`${SITE_NAME} is an independent fan site. These terms are a placeholder summary until full legal copy is published.`}
    >
      <section>
        <h2>Use of the site</h2>
        <p>
          Content is provided for general information about the FIFA World Cup
          2026. Fixtures and standings are derived from official schedule metadata
          and optional live API feeds — not from FIFA directly.
        </p>
      </section>
      <section>
        <h2>No affiliation</h2>
        <p>
          {SITE_NAME} is not affiliated with FIFA, UEFA, the Premier
          League, or any national federation.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions: see the <a href="/contact">Contact</a> page.
        </p>
      </section>
    </LegalPage>
  );
}

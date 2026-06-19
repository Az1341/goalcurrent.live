import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${SITE_NAME}.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`How ${SITE_NAME} handles data on this site. Full policy to be expanded before production launch.`}
    >
      <section>
        <h2>Data we store locally</h2>
        <p>
          Favourites (teams, matches, competitions) are stored in your browser
          via localStorage only — not on our servers.
        </p>
      </section>
      <section>
        <h2>Cookies and prompts</h2>
        <p>
          We record your cookie consent choice and whether you dismissed the
          optional subscribe prompt in localStorage. See the{" "}
          <a href="/cookies">Cookie Policy</a> for details.
        </p>
      </section>
      <section>
        <h2>Third parties</h2>
        <p>
          Live match data may be fetched from api-football on the server when
          configured. Affiliate links (e.g. NordVPN) may use third-party
          tracking — see <a href="/affiliate-disclosure">Affiliate Disclosure</a>.
        </p>
      </section>
    </LegalPage>
  );
}

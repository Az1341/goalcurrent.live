import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy",
  description: "Cookie and local storage policy for GoalCurrent.online.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="GoalCurrent.online uses minimal client-side storage. No advertising cookies are set by this placeholder build."
    >
      <section>
        <h2>Cookie consent banner</h2>
        <p>
          When you accept or decline cookies, your choice is saved in
          localStorage under <code>gc_cookie_consent_v1</code> so the banner does
          not reappear on every visit.
        </p>
      </section>
      <section>
        <h2>Favourites</h2>
        <p>
          Saved teams and matches use localStorage (<code>gc_favourites_v1</code>)
          on your device only.
        </p>
      </section>
      <section>
        <h2>Subscribe prompt</h2>
        <p>
          Dismissing the email subscribe placeholder stores{" "}
          <code>gc_subscribe_popup_v1</code> so it is shown once per browser.
        </p>
      </section>
    </LegalPage>
  );
}

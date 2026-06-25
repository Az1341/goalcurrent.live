import type { Metadata } from "next";

import LivePageClient from "@/app/[locale]/live/LivePageClient";
import MatchLineupField from "@/components/match/MatchLineupField";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import {
  DEMO_KOR_LINEUP,
  DEMO_RSA_LINEUP,
  RSA_KOR_DEMO_FORMATIONS,
} from "@/data/wc26/demo-lineups-rsa-kor";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Live Scores",
  description: `World Cup 2026 live scores on ${SITE_NAME}.`,
  path: "/live",
});

const DEMO_MATCH_STATS = [
  { label: "Ball possession", home: "44%", away: "56%" },
  { label: "Total shots", home: 9, away: 14 },
  { label: "Shots on target", home: 3, away: 6 },
  { label: "Corners", home: 4, away: 7 },
  { label: "Fouls", home: 11, away: 9 },
  { label: "Yellow cards", home: 2, away: 1 },
] as const;

export default function LivePage() {
  return (
    <ErrorBoundary>
      <div className="mx-auto w-full max-w-[var(--gc-content-max)] px-6 pt-4">
        <MatchLineupField
          home={DEMO_RSA_LINEUP}
          away={DEMO_KOR_LINEUP}
          homeTeamName="South Africa"
          awayTeamName="Korea Republic"
          homeFormation={RSA_KOR_DEMO_FORMATIONS.home}
          awayFormation={RSA_KOR_DEMO_FORMATIONS.away}
        />

        <section aria-labelledby="live-stats-grid-heading" className="mb-8">
          <h2
            id="live-stats-grid-heading"
            className="mb-3 text-lg font-semibold text-[var(--gc-text-primary)]"
          >
            Match statistics
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_MATCH_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-[var(--gc-border)] bg-[var(--gc-card)] px-4 py-3 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--gc-text-muted)]">
                  {stat.label}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-[var(--gc-text-primary)]">
                  <span>South Africa {stat.home}</span>
                  <span className="text-[var(--gc-text-muted)]">·</span>
                  <span>Korea Republic {stat.away}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <LivePageClient />
    </ErrorBoundary>
  );
}

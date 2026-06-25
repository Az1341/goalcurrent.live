import type { Metadata } from "next";

import LivePageClient from "@/app/[locale]/live/LivePageClient";
import MatchLineupField from "@/components/match/MatchLineupField";
import ErrorBoundary from "@/components/system/ErrorBoundary";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";
import type { MatchLineupPlayer } from "@/types/match-detail";

export const metadata: Metadata = buildPageMetadata({
  title: "Live Scores",
  description: `World Cup 2026 live scores on ${SITE_NAME}.`,
  path: "/live",
});

/** Static audit roster — South Africa vs Korea Republic (Group A, matchday 3). */
const DEMO_RSA_LINEUP: readonly MatchLineupPlayer[] = [
  {
    name: "Ronwen Williams",
    number: 16,
    position: "G",
    photo: "https://media.api-sports.io/football/players/30997.png",
    is_captain: true,
    rating: 7.4,
    grid_position: "1:1",
  },
  {
    name: "Terrence Mashego",
    number: 2,
    position: "D",
    photo: "https://media.api-sports.io/football/players/296436.png",
    rating: 6.8,
    grid_position: "2:1",
  },
  {
    name: "Grant Kekana",
    number: 20,
    position: "D",
    photo: "https://media.api-sports.io/football/players/30998.png",
    rating: 7.1,
    grid_position: "2:2",
  },
  {
    name: "Mothobi Mvala",
    number: 4,
    position: "D",
    photo: "https://media.api-sports.io/football/players/30999.png",
    rating: 7.3,
    grid_position: "2:3",
  },
  {
    name: "Khuliso Khumalo",
    number: 13,
    position: "D",
    photo: "https://media.api-sports.io/football/players/31000.png",
    rating: 6.9,
    grid_position: "2:4",
  },
  {
    name: "Sphephelo Sithole",
    number: 8,
    position: "M",
    photo: "https://media.api-sports.io/football/players/31001.png",
    rating: 7.6,
    grid_position: "3:1",
  },
  {
    name: "Teboho Mokoena",
    number: 15,
    position: "M",
    photo: "https://media.api-sports.io/football/players/31002.png",
    rating: 7.8,
    grid_position: "3:2",
  },
  {
    name: "Percy Tau",
    number: 11,
    position: "M",
    photo: "https://media.api-sports.io/football/players/31003.png",
    rating: 7.2,
    grid_position: "4:1",
  },
  {
    name: "Themba Zwane",
    number: 10,
    position: "M",
    photo: "https://media.api-sports.io/football/players/31004.png",
    rating: 7.7,
    grid_position: "4:2",
  },
  {
    name: "Lyle Foster",
    number: 9,
    position: "F",
    photo: "https://media.api-sports.io/football/players/31005.png",
    rating: 6.5,
    grid_position: "4:3",
  },
  {
    name: "Evidence Makgopa",
    number: 17,
    position: "F",
    photo: "https://media.api-sports.io/football/players/31006.png",
    rating: 6.3,
    grid_position: "5:1",
  },
];

const DEMO_KOR_LINEUP: readonly MatchLineupPlayer[] = [
  {
    name: "Kim Seung-gyu",
    number: 21,
    position: "G",
    photo: "https://media.api-sports.io/football/players/2801.png",
    rating: 7.0,
    grid_position: "1:1",
  },
  {
    name: "Kim Jin-su",
    number: 3,
    position: "D",
    photo: "https://media.api-sports.io/football/players/2802.png",
    rating: 7.2,
    grid_position: "2:1",
  },
  {
    name: "Kim Min-jae",
    number: 4,
    position: "D",
    photo: "https://media.api-sports.io/football/players/2803.png",
    is_captain: true,
    rating: 7.9,
    grid_position: "2:2",
  },
  {
    name: "Kim Young-gwon",
    number: 19,
    position: "D",
    photo: "https://media.api-sports.io/football/players/2804.png",
    rating: 7.4,
    grid_position: "2:3",
  },
  {
    name: "Kim Moon-hwan",
    number: 2,
    position: "D",
    photo: "https://media.api-sports.io/football/players/2805.png",
    rating: 6.7,
    grid_position: "2:4",
  },
  {
    name: "Lee Kang-in",
    number: 18,
    position: "M",
    photo: "https://media.api-sports.io/football/players/2806.png",
    rating: 8.1,
    grid_position: "3:1",
  },
  {
    name: "Hwang In-beom",
    number: 6,
    position: "M",
    photo: "https://media.api-sports.io/football/players/2807.png",
    rating: 7.3,
    grid_position: "3:2",
  },
  {
    name: "Jung Woo-young",
    number: 5,
    position: "M",
    photo: "https://media.api-sports.io/football/players/2808.png",
    rating: 7.1,
    grid_position: "3:3",
  },
  {
    name: "Son Heung-min",
    number: 7,
    position: "F",
    photo: "https://media.api-sports.io/football/players/2809.png",
    rating: 8.3,
    grid_position: "4:1",
  },
  {
    name: "Cho Gue-sung",
    number: 9,
    position: "F",
    photo: "https://media.api-sports.io/football/players/2810.png",
    rating: 6.9,
    grid_position: "4:2",
  },
  {
    name: "Hwang Hee-chan",
    number: 11,
    position: "F",
    photo: "https://media.api-sports.io/football/players/2811.png",
    rating: 7.5,
    grid_position: "4:3",
  },
];

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
          homeFormation="4-2-3-1"
          awayFormation="4-3-3"
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

"use client";

import Link from "next/link";
import MatchLineupField from "@/components/match/MatchLineupField";
import { getFixtureById } from "@/data/wc26";
import { useLocalizedKickoffTime } from "@/lib/client/use-local-kickoff";
import { resolveMatchLineupView } from "@/lib/match-lineup-view";
import { useMatchDetail } from "@/lib/use-match-detail";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import type { MatchDetailPayload } from "@/types/match-detail";
import styles from "./match.module.css";

type MatchLineupPitchSectionProps = {
  fixtureId: string;
  matchNumber: number;
  homeTeamId: string;
  awayTeamId: string;
  poll?: boolean;
  variant?: "page" | "embedded";
  detail?: MatchDetailPayload;
  loading?: boolean;
  matchHref?: string;
  className?: string;
};

function BenchList({
  title,
  players,
}: {
  title: string;
  players: readonly { name: string; number: number | null }[];
}) {
  if (players.length === 0) return null;

  return (
    <div className={styles.lineupBench}>
      <p className={styles.lineupMeta}>{title}</p>
      <ul className={styles.lineupList}>
        {players.map((player) => (
          <li key={`${player.number}-${player.name}`} className={styles.lineupPlayer}>
            <span className={styles.lineupNum}>{player.number ?? "–"}</span>
            <span>{player.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MatchLineupPitchSection({
  fixtureId,
  matchNumber,
  homeTeamId,
  awayTeamId,
  poll = false,
  variant = "page",
  detail: detailProp,
  loading: loadingProp,
  matchHref,
  className,
}: MatchLineupPitchSectionProps) {
  const fetched = useMatchDetail(fixtureId, poll && detailProp == null);
  const detail = detailProp ?? fetched.detail;
  const loading = loadingProp ?? fetched.loading;
  const view = resolveMatchLineupView(
    { matchNumber, homeTeamId, awayTeamId },
    detail,
  );

  const fixture = getFixtureById(fixtureId);
  const kickoffTime = useLocalizedKickoffTime(fixture?.kickoffUtc ?? "");
  const matchMetaLabel = fixture
    ? `${formatStageLabel(fixture.stage)}${kickoffTime ? ` | Kick-off ${kickoffTime}` : ""}`
    : null;

  const headingId = `match-lineups-${fixtureId}`;

  return (
    <section
      className={`${styles.section} ${className ?? ""}`.trim()}
      aria-labelledby={variant === "page" ? headingId : undefined}
    >
      {variant === "page" ? (
        <h2 id={headingId} className={styles.sectionTitle}>
          Lineups & tactics
        </h2>
      ) : matchHref ? (
        <p className={styles.lineupEmbeddedLink}>
          <Link href={matchHref}>
            {view.homeTeamName} vs {view.awayTeamName} — full match centre
          </Link>
        </p>
      ) : null}

      <div className={styles.panel}>
        {loading && !view.hasLineup ? (
          <p className={styles.emptyState}>Loading lineups…</p>
        ) : !view.hasLineup ? (
          <p className={styles.emptyState}>
            Lineups and formation will appear here when the match is live and API-Football
            publishes team sheets.
          </p>
        ) : (
          <>
            <div className={styles.lineupPitchWrap}>
              <MatchLineupField
                variant="embedded"
                home={view.home}
                away={view.away}
                homeTeamName={view.homeTeamName}
                awayTeamName={view.awayTeamName}
                homeFormation={view.homeFormation}
                awayFormation={view.awayFormation}
                homeTeamId={homeTeamId}
                awayTeamId={awayTeamId}
                matchMetaLabel={matchMetaLabel}
              />
            </div>
            {view.homeBench.length > 0 || view.awayBench.length > 0 ? (
              <div className={styles.lineupBenchGrid}>
                <BenchList title={`${view.homeTeamName} bench`} players={view.homeBench} />
                <BenchList title={`${view.awayTeamName} bench`} players={view.awayBench} />
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
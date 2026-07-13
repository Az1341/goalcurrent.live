"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import MatchLineupBroadcast from "@/components/match/MatchLineupBroadcast";
import { getFixtureById } from "@/data/wc26";
import { useLocalizedKickoffTime } from "@/lib/client/use-local-kickoff";
import { isLineupRevealWindow } from "@/lib/match-lineup-timing";
import { resolveMatchLineupView } from "@/lib/match-lineup-view";
import { useMatchDetail } from "@/lib/use-match-detail";
import { formatStageLabel } from "@/lib/wc26-fixtures-page";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import type { MatchDetailPayload } from "@/types/match-detail";
import styles from "./match.module.css";

export type MatchLineupPitchSectionProps = {
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
  kickoffUtc?: string;
  matchStatus?: string | null;
};

export type MatchLineupProps = MatchLineupPitchSectionProps;

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
            <span className={styles.lineupNum}>{player.number ?? "-"}</span>
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
  kickoffUtc: kickoffUtcProp,
  matchStatus,
}: MatchLineupPitchSectionProps) {
  const fixture = getFixtureById(fixtureId);
  const kickoffUtc = kickoffUtcProp ?? fixture?.kickoffUtc ?? "";
  const [nowMs, setNowMs] = useState(() => Date.now());

  const revealWindowOpen =
    isLiveMatchStatus(matchStatus ?? fixture?.status) ||
    isLineupRevealWindow(kickoffUtc, nowMs);

  const fetched = useMatchDetail(
    fixtureId,
    poll && detailProp == null && revealWindowOpen,
  );
  const detail = detailProp ?? fetched.detail;
  const loading = loadingProp ?? fetched.loading;
  const view = resolveMatchLineupView(
    { matchNumber, homeTeamId, awayTeamId },
    detail,
  );

  const kickoffTime = useLocalizedKickoffTime(kickoffUtc);
  const matchMetaLabel = fixture
    ? `${formatStageLabel(fixture.stage)}${kickoffTime ? ` | Kick-off ${kickoffTime}` : ""}`
    : kickoffTime
      ? `Kick-off ${kickoffTime}`
      : null;

  useEffect(() => {
    if (revealWindowOpen) return;
    const remaining = Math.max(
      0,
      new Date(kickoffUtc).getTime() - 30 * 60 * 1_000 - Date.now(),
    );
    if (!Number.isFinite(remaining) || remaining <= 0) return;
    const timer = window.setTimeout(() => setNowMs(Date.now()), remaining + 50);
    return () => window.clearTimeout(timer);
  }, [kickoffUtc, revealWindowOpen]);

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
            {view.homeTeamName} vs {view.awayTeamName} - full match centre
          </Link>
        </p>
      ) : null}

      <div className={styles.panel}>
        {!revealWindowOpen ? (
          <p className={styles.emptyState}>
            Lineups will be available 30 minutes before kick-off.
          </p>
        ) : loading && !view.hasLineup ? (
          <p className={styles.emptyState}>Loading lineups...</p>
        ) : !view.hasLineup ? (
          <p className={styles.emptyState}>
            Lineups and formation will appear here when the teams are announced.
          </p>
        ) : (
          <>
            <div className={styles.lineupPitchWrap}>
              <MatchLineupBroadcast
                home={view.home}
                away={view.away}
                homeFormation={view.homeFormation}
                awayFormation={view.awayFormation}
                homeTeamName={view.homeTeamName}
                awayTeamName={view.awayTeamName}
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

/** Figma `match-lineup` broadcast component (alias). */
export { MatchLineupPitchSection as MatchLineup };

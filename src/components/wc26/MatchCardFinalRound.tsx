"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import PlayerRow from "@/components/wc26/PlayerRow";
import { getTeamById } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { buildHomepageMatchView, isLiveMatchStatus } from "@/lib/wc26-live";
import { useMatchDetail } from "@/lib/use-match-detail";
import { matchHref } from "@/lib/wc26-match";
import {
  formatVenueKickoffLabel,
  formatVenueKickoffTime,
  formatVenueTimezoneAbbr,
} from "@/lib/wc26/time-converter";
import styles from "./wc26.module.css";

type MatchCardFinalRoundProps = {
  fixture: EffectiveFixture;
};

export default function MatchCardFinalRound({ fixture }: MatchCardFinalRoundProps) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const view = buildHomepageMatchView(fixture);
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const score = getFixtureScore(fixture);
  const { detail, loading } = useMatchDetail(fixture.id, isLive);

  const centreScore =
    isLive || isCompleted
      ? score
        ? `${score.home}–${score.away}`
        : "–"
      : null;

  const venueTime = formatVenueKickoffTime(fixture.kickoffUtc, fixture.venueId);
  const venueTz = formatVenueTimezoneAbbr(fixture.venueId);
  const venueLabel = formatVenueKickoffLabel(fixture.kickoffUtc, fixture.venueId);

  return (
    <article className={styles.finalRoundCard}>
      <div className={styles.finalRoundCardHead}>
        <span className={styles.finalRoundCardMeta}>
          Match {fixture.matchNumber}
          {isLive ? <span className={styles.finalRoundLiveDot} aria-hidden="true" /> : null}
        </span>
        <span className={styles.finalRoundCardTime}>
          {venueTime} {venueTz}
        </span>
      </div>

      <div className={styles.finalRoundTeams}>
        <div className={styles.finalRoundSide}>
          <TeamFlag teamId={fixture.homeTeamId} size={36} />
          <strong>{home?.name ?? fixture.homeTeamId}</strong>
        </div>

        <div className={styles.finalRoundCentre}>
          {centreScore ? (
            <span className={styles.finalRoundScore}>{centreScore}</span>
          ) : (
            <span className={styles.finalRoundVs}>vs</span>
          )}
          <span className={styles.finalRoundStatus}>{view.statusLabel}</span>
        </div>

        <div className={`${styles.finalRoundSide} ${styles.finalRoundSideAway}`}>
          <strong>{away?.name ?? fixture.awayTeamId}</strong>
          <TeamFlag teamId={fixture.awayTeamId} size={36} />
        </div>
      </div>

      <p className={styles.finalRoundVenue}>{venueLabel}</p>

      {loading ? (
        <p className={styles.finalRoundLineupNote}>Loading lineups…</p>
      ) : (
        <>
          <PlayerRow
            label={detail.lineups.home?.teamName ?? home?.name ?? "Home"}
            players={detail.lineups.home?.startXI ?? []}
          />
          <PlayerRow
            label={detail.lineups.away?.teamName ?? away?.name ?? "Away"}
            players={detail.lineups.away?.startXI ?? []}
          />
          {!detail.lineups.home && !detail.lineups.away ? (
            <p className={styles.finalRoundLineupNote}>
              Lineups publish closer to kick-off when API-Football data is available.
            </p>
          ) : null}
        </>
      )}

      <Link href={matchHref(fixture.id)} className={styles.finalRoundDetailsBtn}>
        Match details →
      </Link>
    </article>
  );
}

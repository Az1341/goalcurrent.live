"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import PlayerRow from "@/components/wc26/PlayerRow";
import {
  DEMO_KOR_LINEUP,
  DEMO_RSA_LINEUP,
  isRsaKorDemoFixture,
} from "@/data/wc26/demo-lineups-rsa-kor";
import { getTeamById } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { buildHomepageMatchView, isLiveMatchStatus } from "@/lib/wc26-live";
import {
  formatVenueKickoffLabel,
  formatVenueKickoffTime,
  formatVenueTimezoneAbbr,
} from "@/lib/wc26/time-converter";
import { useMatchDetail } from "@/lib/use-match-detail";
import { matchHref } from "@/lib/wc26-match";
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
  const isUpcoming = !isLive && !isCompleted;
  const score = getFixtureScore(fixture);
  const { detail, loading } = useMatchDetail(fixture.id, isLive);
  const useDemoLineup = isRsaKorDemoFixture(fixture.matchNumber);
  const venueTime = formatVenueKickoffTime(fixture.kickoffUtc, fixture.venueId);
  const venueTz = formatVenueTimezoneAbbr(fixture.venueId);
  const venueLabel = formatVenueKickoffLabel(fixture.kickoffUtc, fixture.venueId);

  const centreScore =
    isLive || isCompleted
      ? score
        ? `${score.home}–${score.away}`
        : "–"
      : null;

  const homeLineup =
    detail.lineups.home?.startXI?.length
      ? detail.lineups.home.startXI
      : useDemoLineup
        ? DEMO_RSA_LINEUP
        : [];
  const awayLineup =
    detail.lineups.away?.startXI?.length
      ? detail.lineups.away.startXI
      : useDemoLineup
        ? DEMO_KOR_LINEUP
        : [];
  const hasLineup = homeLineup.length > 0 || awayLineup.length > 0;

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
          <span className={styles.finalRoundStatus}>
            {isUpcoming ? `${venueTime} ${venueTz}` : view.statusLabel}
          </span>
        </div>

        <div className={`${styles.finalRoundSide} ${styles.finalRoundSideAway}`}>
          <strong>{away?.name ?? fixture.awayTeamId}</strong>
          <TeamFlag teamId={fixture.awayTeamId} size={36} />
        </div>
      </div>

      <p className={styles.finalRoundVenue}>{venueLabel}</p>

      {loading ? (
        <p className={styles.finalRoundLineupNote}>Loading lineups…</p>
      ) : hasLineup ? (
        <div className={styles.finalRoundPlayerRows}>
          <PlayerRow label={home?.name ?? fixture.homeTeamId} players={homeLineup} />
          <PlayerRow label={away?.name ?? fixture.awayTeamId} players={awayLineup} />
        </div>
      ) : (
        <p className={styles.finalRoundLineupNote}>
          Lineups publish closer to kick-off when API-Football data is available.
        </p>
      )}

      <Link href={matchHref(fixture.id)} className={styles.finalRoundDetailsBtn}>
        Match details →
      </Link>
    </article>
  );
}

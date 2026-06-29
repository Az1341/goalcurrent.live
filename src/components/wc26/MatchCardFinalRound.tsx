"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import PlayerRow from "@/components/wc26/PlayerRow";
import {
  DEMO_KOR_LINEUP,
  DEMO_RSA_LINEUP,
  isRsaKorDemoFixture,
} from "@/data/wc26/demo-lineups-rsa-kor";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  buildHomepageMatchView,
  isLiveMatchStatus,
  resolveFixtureParticipant,
} from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
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
  const allFixtures = useEffectiveFixtures();
  const home = resolveFixtureParticipant(fixture, "home", allFixtures);
  const away = resolveFixtureParticipant(fixture, "away", allFixtures);
  const view = buildHomepageMatchView(fixture, allFixtures);
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
          <TeamFlag teamId={home.teamId} teamName={home.label} size={36} />
          <strong>{home.label}</strong>
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
          <strong>{away.label}</strong>
          <TeamFlag teamId={away.teamId} teamName={away.label} size={36} />
        </div>
      </div>

      <p className={styles.finalRoundVenue}>{venueLabel}</p>

      {loading ? (
        <p className={styles.finalRoundLineupNote}>Loading lineups…</p>
      ) : hasLineup ? (
        <div className={styles.finalRoundPlayerRows}>
          <PlayerRow label={home.label} players={homeLineup} />
          <PlayerRow label={away.label} players={awayLineup} />
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

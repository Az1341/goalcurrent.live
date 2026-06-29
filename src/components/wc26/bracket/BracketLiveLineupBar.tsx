"use client";

import { Link } from "@/i18n/navigation";
import MatchLineupField from "@/components/match/MatchLineupField";
import { useMatchDetail } from "@/lib/use-match-detail";
import { isLiveMatchStatus, resolveFixtureParticipant } from "@/lib/wc26-live";
import { matchHref } from "@/lib/wc26-match";
import type { EffectiveFixture } from "@/lib/wc26-fixture-overlay";
import { getEffectiveFixtures } from "@/lib/wc26-fixture-overlay";
import { formatCountdown, useCountdown } from "./useCountdown";
import styles from "./bracket.module.css";

type BracketLiveLineupBarProps = {
  fixture: EffectiveFixture | null;
  lineupsBanner: string;
  matchCenterLabel: string;
};

function LineupCell({
  fixture,
  lineupsBanner,
  matchCenterLabel,
}: {
  fixture: EffectiveFixture;
  lineupsBanner: string;
  matchCenterLabel: string;
}) {
  const isLive = isLiveMatchStatus(fixture.status);
  const { detail } = useMatchDetail(fixture.id, isLive);
  const countdown = useCountdown(isLive ? null : fixture.kickoffUtc);
  const countdownLabel = formatCountdown(countdown);
  const allFixtures = getEffectiveFixtures();
  const home = resolveFixtureParticipant(fixture, "home", allFixtures);
  const away = resolveFixtureParticipant(fixture, "away", allFixtures);

  const homeXi = detail.lineups.home?.startXI ?? [];
  const awayXi = detail.lineups.away?.startXI ?? [];

  return (
    <div className={styles.lineupCell}>
      <MatchLineupField
        home={homeXi}
        away={awayXi}
        homeTeamName={home.label}
        awayTeamName={away.label}
        homeFormation={detail.lineups.home?.formation}
        awayFormation={detail.lineups.away?.formation}
        variant="embedded"
      />
      <p className={styles.lineupBarHead}>
        <span>{lineupsBanner}</span>
        {countdownLabel ? (
          <span className={styles.lineupCountdown}>{countdownLabel}</span>
        ) : null}
      </p>
      <Link href={matchHref(fixture.id)} className={styles.matchLink}>
        {matchCenterLabel}
      </Link>
    </div>
  );
}

export default function BracketLiveLineupBar({
  fixture,
  lineupsBanner,
  matchCenterLabel,
}: BracketLiveLineupBarProps) {
  if (!fixture) {
    return null;
  }

  return (
    <section className={styles.lineupBar} aria-label={lineupsBanner}>
      <div className={styles.lineupBarGrid}>
        <LineupCell
          fixture={fixture}
          lineupsBanner={lineupsBanner}
          matchCenterLabel={matchCenterLabel}
        />
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { useLocalizedKickoffTime } from "@/lib/client/use-local-kickoff";
import {
  formatFixtureStatusLabel,
  isLiveMatchStatus,
  resolveFixtureParticipant,
} from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { matchHref } from "@/lib/wc26-match";
import FixtureMatchRow from "@/components/match/FixtureMatchRow";
import styles from "./live.module.css";

type LiveMatchCardProps = {
  fixture: EffectiveFixture;
};

function statusColumnLabel(
  fixture: EffectiveFixture,
  isLive: boolean,
  isCompleted: boolean,
): string | undefined {
  if (isLive) {
    if (fixture.elapsed != null) {
      return `${fixture.elapsed}'`;
    }
    return formatFixtureStatusLabel(fixture.status);
  }
  if (isCompleted) {
    return "FT";
  }
  return undefined;
}

export default function LiveMatchCard({ fixture }: LiveMatchCardProps) {
  const fixtures = useEffectiveFixtures();
  const home = resolveFixtureParticipant(fixture, "home", fixtures);
  const away = resolveFixtureParticipant(fixture, "away", fixtures);
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const isScheduled = !isLive && !isCompleted;
  const kickoffTime = useLocalizedKickoffTime(fixture.kickoffUtc);
  const score = getFixtureScore(fixture);
  const label = `${home.label} vs ${away.label}`;

  const centrePrimary =
    isLive || isCompleted
      ? score
        ? `${score.home}–${score.away}`
        : "–"
      : kickoffTime;

  const centreSecondary = statusColumnLabel(fixture, isLive, isCompleted);

  return (
    <li className={styles.matchRowItem}>
      <Link
        href={matchHref(fixture.id)}
        className={`${styles.matchRowLink} ${isLive ? styles.matchRowLive : ""}`}
        aria-label={
          isScheduled
            ? `${label} - ${kickoffTime}`
            : `${label} - ${centreSecondary ?? centrePrimary}`
        }
      >
        <FixtureMatchRow
          homeTeamId={home.teamId}
          awayTeamId={away.teamId}
          homeName={home.label}
          awayName={away.label}
          centrePrimary={centrePrimary}
          centreSecondary={centreSecondary}
          flagSize={22}
          isLive={isLive}
        />
      </Link>
    </li>
  );
}

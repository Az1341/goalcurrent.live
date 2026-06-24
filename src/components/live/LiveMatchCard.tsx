import Link from "next/link";
import { getTeamById } from "@/data/wc26";
import {
  getFixtureScore,
  isEffectiveFixtureCompleted,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import { formatFixtureStatusLabel, isLiveMatchStatus } from "@/lib/wc26-live";
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
): string {
  if (isLive) {
    if (fixture.elapsed != null) {
      return `${fixture.elapsed}'`;
    }
    return formatFixtureStatusLabel(fixture.status);
  }
  if (isCompleted) {
    return "FT";
  }
  return formatFixtureStatusLabel(fixture.status);
}

export default function LiveMatchCard({ fixture }: LiveMatchCardProps) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const isLive = isLiveMatchStatus(fixture.status);
  const isCompleted = isEffectiveFixtureCompleted(fixture);
  const score = getFixtureScore(fixture);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;

  const centrePrimary =
    isLive || isCompleted
      ? score
        ? `${score.home}–${score.away}`
        : "–"
      : "vs";

  const centreSecondary = statusColumnLabel(fixture, isLive, isCompleted);

  return (
    <li className={styles.matchRowItem}>
      <Link
        href={matchHref(fixture.id)}
        className={`${styles.matchRowLink} ${isLive ? styles.matchRowLive : ""}`}
        aria-label={`${label} - ${centreSecondary}`}
      >
        <FixtureMatchRow
          homeTeamId={fixture.homeTeamId}
          awayTeamId={fixture.awayTeamId}
          homeName={home?.name ?? fixture.homeTeamId}
          awayName={away?.name ?? fixture.awayTeamId}
          centrePrimary={centrePrimary}
          centreSecondary={centreSecondary}
          flagSize={22}
          isLive={isLive}
        />
      </Link>
    </li>
  );
}

"use client";

import Link from "next/link";
import { getFixtureById, groupLabel } from "@/data/wc26";
import { buildMatchDetailHeader } from "@/lib/wc26-match";
import { groupHref } from "@/lib/wc26-groups";
import { isLiveMatchStatus } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useMatchDetail } from "@/lib/use-match-detail";
import MatchRelatedLinks from "@/components/match/MatchRelatedLinks";
import {
  MatchDetailHeader,
  MatchLineups,
  MatchStatistics,
  MatchTimeline,
} from "@/components/match/MatchDetailSections";
import styles from "@/components/match/match.module.css";

type MatchDetailContentProps = {
  fixtureId: string;
};

export default function MatchDetailContent({ fixtureId }: MatchDetailContentProps) {
  const fixtures = useEffectiveFixtures();
  const fixture =
    fixtures.find((entry) => entry.id === fixtureId) ?? getFixtureById(fixtureId);
  const { detail, loading } = useMatchDetail(
    fixtureId,
    fixture ? isLiveMatchStatus(fixture.status) : false,
  );

  if (!fixture) {
    return (
      <main className={styles.matchPage}>
        <p className={styles.emptyState}>Fixture not found.</p>
        <p className={styles.backLink}>
          <Link href="/worldcup2026/fixtures">← Back to fixtures</Link>
        </p>
      </main>
    );
  }

  const header = buildMatchDetailHeader(fixture);
  const groupTitle = fixture.groupId ? groupLabel(fixture.groupId) : "World Cup 2026";

  return (
    <main className={styles.matchPage}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/worldcup2026">World Cup 2026</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/worldcup2026/fixtures">Fixtures</Link>
        <span className={styles.breadcrumbSep}>/</span>
        {fixture.groupId ? (
          <Link href={groupHref(fixture.groupId)}>{groupTitle}</Link>
        ) : (
          <span>{groupTitle}</span>
        )}
      </nav>

      <MatchDetailHeader header={header} />
      <MatchTimeline detail={detail} loading={loading} />
      <MatchStatistics detail={detail} loading={loading} />
      <MatchLineups
        detail={detail}
        homeTeamId={fixture.homeTeamId}
        awayTeamId={fixture.awayTeamId}
        loading={loading}
      />

      <MatchRelatedLinks fixtureId={fixtureId} groupId={fixture.groupId} />

      <p className={styles.backLink}>
        <Link href="/live">← Live centre</Link>
        {" · "}
        <Link href="/worldcup2026/fixtures">Fixtures</Link>
      </p>
    </main>
  );
}

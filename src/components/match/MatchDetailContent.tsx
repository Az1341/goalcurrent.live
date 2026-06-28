"use client";

import Link from "next/link";
import { getFixtureById, groupLabel } from "@/data/wc26";
import { buildMatchDetailHeader } from "@/lib/wc26-match";
import { groupHref } from "@/lib/wc26-groups";
import { isLiveMatchStatus, resolveFixtureParticipant } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useMatchDetail } from "@/lib/use-match-detail";
import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import MatchRelatedLinks from "@/components/match/MatchRelatedLinks";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import ScoreBatEmbed from "@/components/scorebat/ScoreBatEmbed";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { ADSENSE_SLOTS } from "@/lib/adsense-slots";
import { absoluteUrl } from "@/lib/site-url";
import {
  MatchDetailHeader,
  MatchLineups,
  MatchMovement,
  MatchPlayerStats,
  MatchTimeline,
} from "@/components/match/MatchDetailSections";
import styles from "@/components/match/match.module.css";

type MatchDetailContentProps = {
  fixtureId: string;
  detailUnavailable?: boolean;
  scorebatEmbed?: string | null;
};

export default function MatchDetailContent({
  fixtureId,
  detailUnavailable = false,
  scorebatEmbed = null,
}: MatchDetailContentProps) {
  const fixtures = useEffectiveFixtures();
  const fixture =
    fixtures.find((entry) => entry.id === fixtureId) ?? getFixtureById(fixtureId);
  const { detail, loading } = useMatchDetail(
    fixtureId,
    fixture ? isLiveMatchStatus(fixture.status) : false,
  );
  const { tvRegion } = useWc26TvRegion();

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
  const homeResolved = resolveFixtureParticipant(fixture, "home", fixtures);
  const awayResolved = resolveFixtureParticipant(fixture, "away", fixtures);
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

      <MatchDetailHeader header={header} detail={detail} loading={loading && !detailUnavailable} />
      <ShareButtons
        url={absoluteUrl(`/match/${fixtureId}`)}
        title={`${header.homeName} vs ${header.awayName} — Live Score & Highlights`}
      />
      {scorebatEmbed ? (
        <section className={styles.section} aria-labelledby="match-highlights-heading">
          <h2 id="match-highlights-heading" className={styles.sectionTitle}>
            Match Highlights
          </h2>
          <ScoreBatEmbed html={scorebatEmbed} />
        </section>
      ) : null}
      <MatchTvBroadcast tvRegion={tvRegion} matchNumber={fixture.matchNumber} variant="detail" />
      <ContentAdSlot slot={ADSENSE_SLOTS.matchMid} minHeight={120} />
      {detailUnavailable ? (
        <p className={styles.emptyState}>
          Detailed live data is temporarily unavailable. Team names and schedule data
          below are from the local fixture list.
        </p>
      ) : (
        <>
          <MatchTimeline
            detail={detail}
            loading={loading}
            homeTeamName={header.homeName}
            awayTeamName={header.awayName}
          />
          <MatchMovement detail={detail} loading={loading} />
          <MatchPlayerStats
            detail={detail}
            loading={loading}
            homeTeamName={header.homeName}
            awayTeamName={header.awayName}
          />
          <MatchLineups
            detail={detail}
            loading={loading}
            homeTeamId={homeResolved.teamId}
            awayTeamId={awayResolved.teamId}
            matchNumber={fixture.matchNumber}
            fixtureId={fixture.id}
          />
        </>
      )}

      <MatchRelatedLinks fixtureId={fixtureId} groupId={fixture.groupId} />

      <p className={styles.backLink}>
        <Link href="/live">← Live centre</Link>
        {" · "}
        <Link href="/worldcup2026/fixtures">Fixtures</Link>
      </p>
    </main>
  );
}

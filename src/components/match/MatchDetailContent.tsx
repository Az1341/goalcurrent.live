"use client";

import Link from "next/link";
import { getFixtureById, groupLabel } from "@/data/wc26";
import { buildMatchDetailHeader } from "@/lib/wc26-match";
import { groupHref } from "@/lib/wc26-groups";
import { resolveFixtureParticipant, shouldShowLiveMatchCard, shouldShowUpcomingCountdown } from "@/lib/wc26-live";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import type { MatchDetailPayload } from "@/types/match-detail";
import { ContentAdSlot } from "@/components/ads/ContentAdSlot";
import UpcomingMatchCountdown from "@/components/live/UpcomingMatchCountdown";
import LiveMatchCard from "@/components/live/LiveMatchCard";
import MatchRelatedLinks from "@/components/match/MatchRelatedLinks";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import { MatchHighlightsSection } from "@/components/scorebat/MatchHighlightsSection";
import type { ScoreBatHighlight } from "@/lib/scorebat/types";
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
  detail: MatchDetailPayload;
  loading: boolean;
  detailUnavailable?: boolean;
  scorebatHighlight?: ScoreBatHighlight | null;
};

export default function MatchDetailContent({
  fixtureId,
  detail,
  loading,
  detailUnavailable = false,
  scorebatHighlight = null,
}: MatchDetailContentProps) {
  const fixtures = useEffectiveFixtures();
  const effectiveFixture =
    fixtures.find((entry) => entry.id === fixtureId) ??
    getFixtureById(fixtureId);
  const { tvRegion } = useWc26TvRegion();

  if (!effectiveFixture) {
    return (
      <main className={styles.matchPage}>
        <p className={styles.emptyState}>Fixture not found.</p>
        <p className={styles.backLink}>
          <Link href="/worldcup2026/fixtures">← Back to fixtures</Link>
        </p>
      </main>
    );
  }

  const header = buildMatchDetailHeader(effectiveFixture, fixtures);
  const homeResolved = resolveFixtureParticipant(effectiveFixture, "home", fixtures);
  const awayResolved = resolveFixtureParticipant(effectiveFixture, "away", fixtures);
  const groupTitle = effectiveFixture.groupId ? groupLabel(effectiveFixture.groupId) : "World Cup 2026";

  return (
    <main className={styles.matchPage}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/worldcup2026">World Cup 2026</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/worldcup2026/fixtures">Fixtures</Link>
        <span className={styles.breadcrumbSep}>/</span>
        {effectiveFixture.groupId ? (
          <Link href={groupHref(effectiveFixture.groupId)}>{groupTitle}</Link>
        ) : (
          <span>{groupTitle}</span>
        )}
      </nav>

      <MatchDetailHeader header={header} detail={detail} loading={loading && !detailUnavailable} />
      <ShareButtons
        url={absoluteUrl(`/match/${fixtureId}`)}
        title={`${header.homeName} vs ${header.awayName} — Live Score & Highlights`}
      />
      {shouldShowUpcomingCountdown(effectiveFixture) ? (
        <div className={styles.upcomingCountdownWrap}>
          <UpcomingMatchCountdown fixture={effectiveFixture} />
        </div>
      ) : shouldShowLiveMatchCard(effectiveFixture) ? (
        <section
          className={styles.matchLiveCardWrap}
          aria-label="Live match snapshot"
        >
          <ul className={styles.matchLiveCardList}>
            <LiveMatchCard fixture={effectiveFixture} />
          </ul>
        </section>
      ) : null}
      {scorebatHighlight ? (
        <MatchHighlightsSection highlight={scorebatHighlight} />
      ) : null}
      <MatchTvBroadcast tvRegion={tvRegion} matchNumber={effectiveFixture.matchNumber} variant="detail" />
      <ContentAdSlot slot={ADSENSE_SLOTS.matchMid} minHeight={120} />
      {detailUnavailable ? (
        <p className={styles.apiNotice} role="status">
          Detailed live data is temporarily unavailable. Team names, kick-off and
          schedule below are from the verified local fixture list — stats and lineups
          appear when the API feed is active.
        </p>
      ) : null}
      <MatchTimeline
        detail={detail}
        loading={loading && !detailUnavailable}
        homeTeamName={header.homeName}
        awayTeamName={header.awayName}
      />
      <MatchMovement detail={detail} loading={loading && !detailUnavailable} />
      <MatchPlayerStats
        detail={detail}
        loading={loading && !detailUnavailable}
        homeTeamName={header.homeName}
        awayTeamName={header.awayName}
      />
      <MatchLineups
        detail={detail}
        loading={loading && !detailUnavailable}
        homeTeamId={homeResolved.teamId}
        awayTeamId={awayResolved.teamId}
        matchNumber={effectiveFixture.matchNumber}
        fixtureId={effectiveFixture.id}
      />

      <MatchRelatedLinks fixtureId={fixtureId} groupId={effectiveFixture.groupId} />

      <p className={styles.backLink}>
        <Link href="/live">← Live centre</Link>
        {" · "}
        <Link href="/worldcup2026/fixtures">Fixtures</Link>
      </p>
    </main>
  );
}

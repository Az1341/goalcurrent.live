"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import { WC26_HUB_HREF } from "@/lib/wc26-sections";
import { buildKnockoutBracketRounds } from "@/lib/wc26-standings";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import { WC26_FIXTURES_UPDATED_EVENT } from "@/lib/wc26-fixture-overlay";
import {
  buildConvergingBracketView,
  hasLiveKnockoutMatch,
  pickNextKnockoutFixture,
} from "@/lib/wc26/bracket-view";
import {
  WC26_ARCHIVE_DATA_AS_OF,
  WC26_ARCHIVE_LABEL,
  isWc26TournamentComplete,
} from "@/lib/wc26/archive";
import BracketPageBand from "./BracketPageBand";
import BracketView, { BracketViewSkeleton } from "./BracketView";
import BracketDegradedBanner from "./BracketDegradedBanner";
import BracketLivePolling from "./BracketLivePolling";
import BracketLiveLineupBar from "./BracketLiveLineupBar";
import Wc26TopScorers from "@/components/wc26/Wc26TopScorers";
import bracketStyles from "./bracket.module.css";
import viewStyles from "./BracketView.module.css";

function formatLastUpdated(date: Date, locale: string): string {
  return date.toLocaleString(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function BracketPageClient() {
  const t = useTranslations("wc26.bracket");
  const fixtures = useEffectiveFixtures();
  const syncStatus = useWc26SyncStatus();
  const [hydrated, setHydrated] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const archiveComplete = isWc26TournamentComplete();

  useEffect(() => {
    setHydrated(true);
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const onUpdate = () => setLastUpdated(new Date());
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, onUpdate);
    return () =>
      window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, onUpdate);
  }, []);

  const rounds = useMemo(
    () => buildKnockoutBracketRounds(fixtures),
    [fixtures],
  );

  const convergingView = useMemo(
    () =>
      buildConvergingBracketView(rounds, fixtures, {
        r32: t("rounds.r32"),
        r16: t("rounds.r16"),
        qf: t("rounds.qf"),
        sf: t("rounds.sf"),
        third: t("rounds.3rd"),
        final: t("rounds.final"),
      }),
    [rounds, fixtures, t],
  );

  const liveKnockout = useMemo(
    () => !archiveComplete && hasLiveKnockoutMatch(fixtures),
    [fixtures, archiveComplete],
  );
  const spotlightFixture = useMemo(
    () => (archiveComplete ? null : pickNextKnockoutFixture(fixtures)),
    [fixtures, archiveComplete],
  );

  const hasMatches = convergingView.matchByNumber.size > 0;
  const hasColumns = convergingView.columns.length > 0;

  return (
    <main className={bracketStyles.bracketPage}>
      <BracketLivePolling enabled={liveKnockout} archiveMode={archiveComplete} />

      <Wc26Breadcrumb
        items={[
          { label: WC26_ARCHIVE_LABEL, href: WC26_HUB_HREF },
          { label: t("tabs.bracket") },
        ]}
      />

      {archiveComplete ? (
        <p className={bracketStyles.archiveBadgeInline}>
          {WC26_ARCHIVE_LABEL} · data as of {WC26_ARCHIVE_DATA_AS_OF}
        </p>
      ) : null}

      <BracketPageBand
        eyebrow={t("eyebrow")}
        title={t("title")}
        subtitle={t("subtitle")}
        note={t("note")}
        tabs={{
          bracket: t("tabs.bracket"),
          schedule: t("tabs.schedule"),
          results: t("tabs.results"),
          groups: t("tabs.groups"),
          stats: t("tabs.stats"),
        }}
      />

      {hydrated && lastUpdated && !archiveComplete ? (
        <p className={viewStyles.lastUpdated}>
          {t("lastUpdated", {
            time: formatLastUpdated(lastUpdated, "en"),
          })}
        </p>
      ) : null}

      {syncStatus === "degraded" && !archiveComplete ? (
        <BracketDegradedBanner message={t("degraded")} />
      ) : null}

      {!hasColumns ? (
        <p>Could not load bracket data. Please refresh.</p>
      ) : hasMatches ? (
        <BracketView
          view={convergingView}
          viewMatchCenterLabel={t("card.viewMatchCenter")}
          liveLabel={t("live.live")}
        />
      ) : (
        <>
          <BracketViewSkeleton />
          <p>Could not load bracket data. Please refresh.</p>
        </>
      )}

      {!archiveComplete ? (
        <BracketLiveLineupBar
          fixture={spotlightFixture}
          lineupsBanner={t("live.lineupsBanner")}
          matchCenterLabel={t("live.matchCenter")}
        />
      ) : null}

      <div className={bracketStyles.topScorersBlock}>
        <Wc26TopScorers />
      </div>

      <p className={bracketStyles.hubBack}>
        <Link href={WC26_HUB_HREF}>← {t("backToHub")}</Link>
      </p>
    </main>
  );
}
"use client";

import { useMemo, useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import { WC26_HUB_HREF } from "@/lib/wc26-sections";
import { buildKnockoutBracketRounds } from "@/lib/wc26-standings";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import {
  buildBracketGridView,
  hasLiveKnockoutMatch,
  pickNextKnockoutFixture,
} from "@/lib/wc26/bracket-view";
import BracketPageBand from "./BracketPageBand";
import BracketGrid from "./BracketGrid";
import BracketSkeleton from "./BracketSkeleton";
import BracketDegradedBanner from "./BracketDegradedBanner";
import BracketLivePolling from "./BracketLivePolling";
import BracketLiveLineupBar from "./BracketLiveLineupBar";
import Wc26TopScorers from "@/components/wc26/Wc26TopScorers";
import styles from "./bracket.module.css";

export default function BracketPageClient() {
  const t = useTranslations("wc26.bracket");
  const fixtures = useEffectiveFixtures();
  const syncStatus = useWc26SyncStatus();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const rounds = useMemo(
    () => buildKnockoutBracketRounds(fixtures),
    [fixtures],
  );
  const grid = useMemo(
    () => buildBracketGridView(rounds, fixtures),
    [rounds, fixtures],
  );
  const liveKnockout = useMemo(
    () => hasLiveKnockoutMatch(fixtures),
    [fixtures],
  );
  const spotlightFixture = useMemo(
    () => pickNextKnockoutFixture(fixtures),
    [fixtures],
  );

  const roundLabels = {
    r32: t("rounds.r32"),
    r16: t("rounds.r16"),
    qf: t("rounds.qf"),
    sf: t("rounds.sf"),
    third: t("rounds.3rd"),
    final: t("rounds.final"),
  };

  const showSkeleton = !hydrated;

  return (
    <main className={styles.bracketPage}>
      <BracketLivePolling enabled={liveKnockout} />

      <Wc26Breadcrumb
        items={[
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: t("tabs.bracket") },
        ]}
      />

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

      {syncStatus === "degraded" ? (
        <BracketDegradedBanner message={t("degraded")} />
      ) : null}

      {showSkeleton ? (
        <BracketSkeleton />
      ) : (
        <BracketGrid
          grid={grid}
          roundLabels={roundLabels}
          viewMatchCenterLabel={t("card.viewMatchCenter")}
          liveLabel={t("live.live")}
        />
      )}

      {!showSkeleton ? (
        <BracketLiveLineupBar
          fixture={spotlightFixture}
          lineupsBanner={t("live.lineupsBanner")}
          matchCenterLabel={t("live.matchCenter")}
        />
      ) : null}

      {!showSkeleton ? (
        <div className={styles.topScorersBlock}>
          <Wc26TopScorers />
        </div>
      ) : null}

      <p className={styles.hubBack}>
        <Link href={WC26_HUB_HREF}>← {t("backToHub")}</Link>
      </p>
    </main>
  );
}

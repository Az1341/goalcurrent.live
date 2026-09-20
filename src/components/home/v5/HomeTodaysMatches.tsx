"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useIsClientMounted } from "@/lib/client/use-local-kickoff";
import {
  formatDeviceTimezoneShort,
  formatKickoffLocalDate,
} from "@/lib/formatKickoffLocal";
import {
  countMatchdayFilters,
  filterMatchdayCards,
  groupMatchdayByCompetition,
  orderTodaysMatchday,
  type MatchdayCard,
  type MatchdayCompetitionId,
  type MatchdayFilter,
} from "@/lib/home/matchday";
import { MatchdayMatchCard } from "./HomeLiveMatchCards";
import styles from "../home-v5.module.css";

const INITIAL_PER_COMP = 6;

type HomeTodaysMatchesProps = {
  cards?: readonly MatchdayCard[];
  loading?: boolean;
  anyError?: boolean;
  anyStale?: boolean;
  fetchedAt?: string | null;
  feedErrors?: Partial<Record<MatchdayCompetitionId, boolean>>;
};

export default function HomeTodaysMatches({
  cards = [],
  loading = false,
  anyError = false,
  anyStale = false,
  fetchedAt = null,
  feedErrors = {},
}: HomeTodaysMatchesProps) {
  const t = useTranslations("home.matchday");
  const mounted = useIsClientMounted();
  const [now, setNow] = useState(() => new Date());
  const [filter, setFilter] = useState<MatchdayFilter>("all");
  const [expanded, setExpanded] = useState<Partial<Record<MatchdayCompetitionId, boolean>>>({});

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const todays = useMemo(() => orderTodaysMatchday(cards, now), [cards, now]);
  const filtered = useMemo(
    () => filterMatchdayCards(todays, filter),
    [todays, filter],
  );
  const counts = useMemo(() => countMatchdayFilters(todays), [todays]);
  const groups = useMemo(
    () => groupMatchdayByCompetition(filtered),
    [filtered],
  );

  const tzLabel = mounted ? formatDeviceTimezoneShort() : "";
  const dateLabel = mounted
    ? formatKickoffLocalDate(now.toISOString())
    : "";

  if (loading) {
    return (
      <section
        className={styles.todaySection}
        aria-labelledby="home-today-heading"
        data-gc-home-matchday
        data-gc-matchday-state="loading"
      >
        <h2 id="home-today-heading" className={styles.sectionTitleLarge}>
          {t("title")}
        </h2>
        <p className={styles.matchdayMeta}>{t("loading")}</p>
        <div className={`${styles.skeleton} animate-skeleton-shimmer`} />
      </section>
    );
  }

  const filterButtons: { id: MatchdayFilter; label: string; count: number }[] = [
    { id: "all", label: t("filterAll"), count: counts.all },
    { id: "live", label: t("filterLive"), count: counts.live },
    { id: "finished", label: t("filterFinished"), count: counts.finished },
    { id: "upcoming", label: t("filterUpcoming"), count: counts.upcoming },
  ];

  return (
    <section
      className={styles.todaySection}
      aria-labelledby="home-today-heading"
      data-gc-home-matchday
    >
      <div className={styles.matchdayHeader}>
        <h2 id="home-today-heading" className={styles.sectionTitleLarge}>
          {t("title")}
        </h2>
        <p className={styles.matchdayMeta}>
          {dateLabel}
          {tzLabel ? ` ? ${t("timezoneLabel", { tz: tzLabel })}` : null}
        </p>
      </div>

      {anyStale ? (
        <p className={styles.matchdayWarning} role="status" data-gc-matchday-stale>
          {fetchedAt
            ? t("staleWarning", { fetchedAt })
            : t("freshnessUnknown")}
        </p>
      ) : null}

      {anyError ? (
        <p className={styles.matchdayWarning} role="status" data-gc-matchday-error>
          {t("partialError")}
          {Object.entries(feedErrors)
            .filter(([, err]) => err)
            .map(([id]) => ` [${id}]`)
            .join("")}
        </p>
      ) : null}

      <div className={styles.matchdayFilters} role="tablist" aria-label={t("filtersAria")}>
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            role="tab"
            aria-selected={filter === btn.id}
            className={
              filter === btn.id
                ? styles.matchdayFilterActive
                : styles.matchdayFilter
            }
            onClick={() => setFilter(btn.id)}
            data-gc-matchday-filter={btn.id}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      {!todays.length ? (
        <p className={styles.matchdayEmpty} data-gc-matchday-empty>
          {t("empty")}
        </p>
      ) : !filtered.length ? (
        <p className={styles.matchdayEmpty}>{t("emptyFilter")}</p>
      ) : (
        <div className={styles.todayLeagueGroups}>
          {groups.map((group) => {
            const showAll = Boolean(expanded[group.competitionId]);
            const visible = showAll
              ? group.cards
              : group.cards.slice(0, INITIAL_PER_COMP);
            const hidden = group.cards.length - visible.length;
            return (
              <div
                key={group.competitionId}
                className={styles.todayLeagueGroup}
                data-gc-matchday-comp={group.competitionId}
              >
                <div className={styles.todayGroupTitle}>
                  <span className={styles.todayGroupIcon} aria-hidden="true">
                    {"\u26bd"}
                  </span>
                  {group.label}
                  <span className={styles.matchdayCompCount}>
                    ({group.cards.length})
                  </span>
                </div>
                {!group.liveScoresSupported ? (
                  <p className={styles.matchdayCoverageNote}>
                    {t("liveScoreUnavailable")}
                  </p>
                ) : null}
                <div className={styles.todayCardGrid}>
                  {visible.map((fixture) => (
                    <MatchdayMatchCard
                      key={fixture.qualifiedId}
                      card={fixture}
                      compact
                    />
                  ))}
                </div>
                {hidden > 0 ? (
                  <button
                    type="button"
                    className={styles.matchdayShowAll}
                    onClick={() =>
                      setExpanded((prev) => ({
                        ...prev,
                        [group.competitionId]: true,
                      }))
                    }
                    data-gc-matchday-show-all={group.competitionId}
                  >
                    {t("showAll", { count: group.cards.length })}
                  </button>
                ) : null}
                <p className={styles.matchdayCompLink}>
                  <Link href={group.hubPath}>{t("competitionHub")}</Link>
                </p>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

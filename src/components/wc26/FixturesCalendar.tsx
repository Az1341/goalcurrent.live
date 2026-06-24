"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import {
  WC26_TOURNAMENT,
  WC26_TEAM_COUNT,
  WC26_VENUE_COUNT,
  getTeamById,
  getVenueById,
  groupLabel,
} from "@/data/wc26";
import {
  getEffectiveFixtures,
  getFixtureScore,
  WC26_FIXTURES_UPDATED_EVENT,
  type EffectiveFixture,
} from "@/lib/wc26-fixture-overlay";
import {
  formatFixtureStatusLabel,
} from "@/lib/wc26-live";
import {
  buildCalendarDays,
  filterFixturesForPage,
  formatLongLocalDate,
  shortDayParts,
  formatStageLabel,
  formatVisitorTimezone,
  getDistinctStages,
  localDateKey,
  pickDefaultDateKey,
  sortFixturesByKickoff,
  type FixturePageFilters,
  type Wc26TvRegionCode,
  classifyFixtureMatch,
  type FixtureMatchClass,
} from "@/lib/wc26-fixtures-page";
import { formatVisitorKickoffTime } from "@/lib/wc26-format";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import TvRegionSelect from "@/components/wc26/TvRegionSelect";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import { useIsClient } from "@/lib/use-is-client";
import { useWc26SyncStatus } from "@/lib/use-wc26-sync-status";
import type { Wc26GroupId } from "@/types/group";
import { WC26_GROUP_IDS } from "@/types/group";
import Wc26GamesProgress from "./Wc26GamesProgress";
import styles from "./wc26.module.css";

function topStatusLabel(fixture: EffectiveFixture, matchClass: FixtureMatchClass): string {
  if (matchClass === "live") {
    const label = formatFixtureStatusLabel(fixture.status);
    return label === "Live" ? "LIVE" : label;
  }
  if (matchClass === "ft") {
    return formatFixtureStatusLabel(fixture.status);
  }
  return "Upcoming";
}

function FixtureMatchCard({
  fixture,
  tvRegion,
}: {
  fixture: EffectiveFixture;
  tvRegion: Wc26TvRegionCode;
}) {
  const home = getTeamById(fixture.homeTeamId);
  const away = getTeamById(fixture.awayTeamId);
  const venue = getVenueById(fixture.venueId);
  const matchClass = classifyFixtureMatch(fixture);
  const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;
  const groupPrefix = fixture.groupId ? `${groupLabel(fixture.groupId)} · ` : "";
  const score = getFixtureScore(fixture);
  const kickoffLocal = formatVisitorKickoffTime(fixture.kickoffUtc);

  const cardStateClass =
    matchClass === "ft"
      ? styles.fixMatchDone
      : matchClass === "live"
        ? styles.fixMatchLive
        : styles.fixMatchUpcoming;

  const statusClass =
    matchClass === "live"
      ? styles.fixStatusLive
      : matchClass === "ft"
        ? styles.fixStatusFt
        : styles.fixStatusScheduled;

  return (
    <article
      className={`${styles.fixMatch} ${cardStateClass}`}
      data-match-state={matchClass}
      aria-label={`${label} — ${topStatusLabel(fixture, matchClass)}`}
    >
      <div className={styles.fixMatchTop}>
        <div>
          <div className={styles.fixMatchStage}>
            {groupPrefix}
            {formatStageLabel(fixture.stage)} · Match #{fixture.matchNumber}
          </div>
          {venue ? (
            <div className={styles.fixMatchVenue}>
              {venue.name}
              {venue.city ? ` (${venue.city})` : ""}
            </div>
          ) : null}
        </div>
        <div className={styles.fixMatchStatusWrap}>
          <span className={`${styles.fixStatus} ${statusClass}`}>
            {matchClass === "live" ? (
              <span className={styles.fixLiveDot} aria-hidden="true">
                ●
              </span>
            ) : null}
            {topStatusLabel(fixture, matchClass)}
          </span>
          <FavouriteMatchButton matchId={fixture.id} label={label} />
        </div>
      </div>

      <div className={styles.fixTeams}>
        <div className={styles.fixTeam}>
          <div className={styles.fixFlag}>
            {home ? <TeamFlag teamId={home.id} size={52} /> : null}
          </div>
          <div className={styles.fixTeamName}>
            <TeamLink teamId={fixture.homeTeamId}>
              {home?.name ?? fixture.homeTeamId}
            </TeamLink>
          </div>
        </div>
        <div className={styles.fixCentre}>
          {matchClass === "live" ? (
            <>
              {score ? (
                <div className={styles.fixCentreScore}>{score.home} – {score.away}</div>
              ) : (
                <div className={styles.fixCentreScore}>– – –</div>
              )}
              {fixture.elapsed != null ? (
                <div className={styles.fixCentreMinute}>{fixture.elapsed}&apos;</div>
              ) : (
                <div className={styles.fixCentreNote}>
                  {formatFixtureStatusLabel(fixture.status)}
                </div>
              )}
            </>
          ) : matchClass === "ft" ? (
            <>
              {score ? (
                <div className={`${styles.fixCentreScore} ${styles.fixCentreScoreFt}`}>
                  {score.home} – {score.away}
                </div>
              ) : (
                <div className={styles.fixCentreScore}>– – –</div>
              )}
              <div className={styles.fixCentreNote}>
                {formatFixtureStatusLabel(fixture.status)}
              </div>
            </>
          ) : (
            <>
              <div className={styles.fixCentreKickoff}>{kickoffLocal}</div>
              <div className={styles.fixCentreNote}>{formatVisitorTimezone()}</div>
            </>
          )}
        </div>
        <div className={styles.fixTeam}>
          <div className={styles.fixFlag}>
            {away ? <TeamFlag teamId={away.id} size={52} /> : null}
          </div>
          <div className={styles.fixTeamName}>
            <TeamLink teamId={fixture.awayTeamId}>
              {away?.name ?? fixture.awayTeamId}
            </TeamLink>
          </div>
        </div>
      </div>

      <div className={styles.fixExtras}>
        <p className={styles.fixExtrasNote}>
          Match details update from the live feed when available — no hardcoded
          results.
        </p>
        <div className={styles.fixExtrasActions}>
          <MatchDetailLink fixtureId={fixture.id} className={styles.fixDetailLink} />
          <MatchTvBroadcast tvRegion={tvRegion} matchNumber={fixture.matchNumber} variant="chips" />
        </div>
      </div>
    </article>
  );
}

export default function FixturesCalendar() {
  const [fixtures, setFixtures] = useState<readonly EffectiveFixture[]>(() =>
    getEffectiveFixtures(),
  );
  const [search, setSearch] = useState("");
  const [groupId, setGroupId] = useState<"" | Wc26GroupId>("");
  const [stage, setStage] = useState<FixturePageFilters["stage"]>("");
  const [status, setStatus] = useState<FixturePageFilters["status"]>("");
  const { tvRegion, setTvRegion, ready: tvReady } = useWc26TvRegion();
  const clientReady = useIsClient();
  const todayKey = useMemo(
    () => (clientReady ? localDateKey(new Date().toISOString()) : ""),
    [clientReady],
  );
  const [selectedDate, setSelectedDate] = useState("");
  const syncStatus = useWc26SyncStatus();
  const calRowRef = useRef<HTMLDivElement>(null);
  const dayButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const initialScrollDone = useRef(false);

  const scrollActiveDayIntoView = useCallback(
    (dateKey: string, behavior: ScrollBehavior = "smooth") => {
      const container = calRowRef.current;
      const day = dayButtonRefs.current.get(dateKey);
      if (!container || !day) {
        return;
      }
      const containerWidth = container.offsetWidth;
      const dayOffset = day.offsetLeft + day.offsetWidth / 2;
      const scrollPosition = dayOffset - containerWidth / 2;
      container.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior,
      });
    },
    [],
  );

  useEffect(() => {
    if (clientReady && todayKey) {
      setSelectedDate((prev) => prev || todayKey);
    }
  }, [clientReady, todayKey]);

  const refreshFixtures = useCallback(() => {
    setFixtures(getEffectiveFixtures());
  }, []);

  useEffect(() => {
    window.addEventListener(WC26_FIXTURES_UPDATED_EVENT, refreshFixtures);
    return () =>
      window.removeEventListener(WC26_FIXTURES_UPDATED_EVENT, refreshFixtures);
  }, [refreshFixtures]);

  const calendarDays = useMemo(
    () => buildCalendarDays(fixtures),
    [fixtures],
  );

  const activeDateKey = useMemo(() => {
    if (selectedDate && calendarDays.some((d) => d.dateKey === selectedDate)) {
      return selectedDate;
    }
    if (!clientReady) {
      return calendarDays[0]?.dateKey ?? "";
    }
    return pickDefaultDateKey(calendarDays);
  }, [calendarDays, selectedDate, clientReady]);

  const stages = useMemo(() => getDistinctStages(fixtures), [fixtures]);

  const filtered = useMemo(
    () =>
      sortFixturesByKickoff(
        filterFixturesForPage(fixtures, {
          search,
          groupId,
          stage,
          status,
          dateKey: activeDateKey,
        }),
      ),
    [fixtures, search, groupId, stage, status, activeDateKey],
  );

  useEffect(() => {
    if (!activeDateKey || !clientReady) {
      return;
    }
    const behavior: ScrollBehavior = initialScrollDone.current ? "smooth" : "instant";
    const frame = requestAnimationFrame(() => {
      scrollActiveDayIntoView(activeDateKey, behavior);
      initialScrollDone.current = true;
    });
    return () => cancelAnimationFrame(frame);
  }, [activeDateKey, clientReady, calendarDays.length, scrollActiveDayIntoView]);

  return (
    <section aria-labelledby="fixtures-calendar-heading" className={styles.fixturesCalendar}>
      <h2 id="fixtures-calendar-heading" className={styles.visuallyHidden}>
        World Cup 2026 fixture calendar
      </h2>

      <div className={styles.syncStatusSlot} aria-hidden={syncStatus !== "pending"}>
        {syncStatus === "pending" ? (
          <p className={styles.syncStatus} role="status" aria-live="polite">
            <span className={styles.syncStatusDot} aria-hidden="true" />
            Syncing live data…
          </p>
        ) : null}
      </div>

      <div className={styles.fixMetrics} aria-label="Tournament facts">
        <div className={`${styles.fixMetric} ${styles.fixMetricTeams}`}>
          <b>{WC26_TEAM_COUNT}</b>
          <span>Teams</span>
        </div>
        <div className={`${styles.fixMetric} ${styles.fixMetricMatches}`}>
          <b>{WC26_TOURNAMENT.fixtureCount}</b>
          <span>Matches</span>
        </div>
        <div className={`${styles.fixMetric} ${styles.fixMetricVenues}`}>
          <b>{WC26_VENUE_COUNT}</b>
          <span>Venues</span>
        </div>
        <div className={`${styles.fixMetric} ${styles.fixMetricHosts}`}>
          <b>{WC26_TOURNAMENT.hosts.length}</b>
          <span>Host nations</span>
        </div>
      </div>

      <Wc26GamesProgress />

      <div className={styles.fixFilters}>
        <input
          type="search"
          className={styles.fixFilterInput}
          placeholder="Search team, venue, city, stage…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search fixtures"
        />
        <select
          className={styles.fixFilterSelect}
          value={groupId}
          onChange={(e) => {
            const value = e.target.value;
            setGroupId(value === "" ? "" : (value as Wc26GroupId));
          }}
          aria-label="Filter by group"
        >
          <option value="">All groups</option>
          {WC26_GROUP_IDS.map((id) => (
            <option key={id} value={id}>
              {groupLabel(id)}
            </option>
          ))}
        </select>
        <select
          className={styles.fixFilterSelect}
          value={stage}
          onChange={(e) =>
            setStage(e.target.value as FixturePageFilters["stage"])
          }
          aria-label="Filter by stage"
        >
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {formatStageLabel(s)}
            </option>
          ))}
        </select>
        <select
          className={styles.fixFilterSelect}
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as FixturePageFilters["status"])
          }
          aria-label="Filter by match status"
        >
          <option value="">All matches</option>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="ft">Finished</option>
        </select>
      </div>

      <section className={styles.fixCalendar} aria-label="Official match calendar">
        <div className={styles.fixCalHead}>
          <div>
            <div className={styles.fixCalTitle}>Official Match Calendar</div>
            <div className={styles.fixCalMeta} suppressHydrationWarning>
              {activeDateKey
                ? formatLongLocalDate(activeDateKey)
                : "Select a match day"}
            </div>
          </div>
          <div className={styles.fixCalTotal}>
            {fixtures.length} loaded · {WC26_TOURNAMENT.fixtureCount} total
          </div>
        </div>
        <div
          ref={calRowRef}
          className={styles.fixCalRow}
          role="tablist"
          aria-label="Match days"
        >
          {calendarDays.map((day) => {
            const isSelected = day.dateKey === activeDateKey;
            const isToday = todayKey !== "" && day.dateKey === todayKey;
            return (
              <button
                key={day.dateKey}
                type="button"
                role="tab"
                ref={(node) => {
                  if (node) {
                    dayButtonRefs.current.set(day.dateKey, node);
                  } else {
                    dayButtonRefs.current.delete(day.dateKey);
                  }
                }}
                aria-selected={isSelected}
                aria-current={isToday ? "date" : undefined}
                className={`${styles.fixCalDay} ${isSelected ? styles.fixCalDayActive : ""} ${isToday ? styles.fixCalDayToday : ""}`}
                onClick={() => setSelectedDate(day.dateKey)}
              >
                <span className={styles.fixCalDow}>{day.dow}</span>
                <span className={styles.fixCalNum}>{day.dayNum}</span>
                <span className={styles.fixCalCnt}>{day.count}m</span>
              </button>
            );
          })}
        </div>
      </section>

      {tvReady ? (
        <TvRegionSelect tvRegion={tvRegion} onChange={setTvRegion} />
      ) : (
        <div className={styles.fixTvBar} aria-hidden="true">
          <strong>TV in:</strong>
          <span className={styles.fixTvSelectPlaceholder}>Loading regions…</span>
        </div>
      )}

      {activeDateKey ? (
        <section className={styles.fixDayBlock} aria-labelledby="fix-day-head">
          <div className={styles.fixDayHead}>
            <div className={styles.fixDayLeft}>
              <div className={styles.fixDateBadge} aria-hidden="true">
                <b>{shortDayParts(activeDateKey).dayNum}</b>
                <span>{shortDayParts(activeDateKey).month}</span>
              </div>
              <div>
                <div id="fix-day-head" className={styles.fixDayName}>
                  {formatLongLocalDate(activeDateKey)}
                </div>
                <div className={styles.fixDaySub} suppressHydrationWarning>
                  {clientReady
                    ? `Times in your local timezone (${formatVisitorTimezone()})`
                    : "Times in your local timezone"}
                </div>
              </div>
            </div>
            <span className={styles.fixDayCount}>
              {filtered.length} match{filtered.length === 1 ? "" : "es"}
            </span>
          </div>
          <div className={styles.fixMatchList}>
            {filtered.length === 0 ? (
              <p className={styles.fixEmpty}>
                No fixtures match your filters for this day.
              </p>
            ) : (
              filtered.map((fixture) => (
                <FixtureMatchCard
                  key={fixture.id}
                  fixture={fixture}
                  tvRegion={tvRegion}
                />
              ))
            )}
          </div>
        </section>
      ) : (
        <p className={styles.fixEmpty}>No fixtures loaded.</p>
      )}
    </section>
  );
}

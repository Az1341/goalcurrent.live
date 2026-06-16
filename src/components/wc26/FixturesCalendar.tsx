"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  WC26_TV_REGIONS,
  buildCalendarDays,
  filterFixturesForPage,
  fixtureStatusBadgeLabel,
  formatLongLocalDate,
  formatStageLabel,
  formatVisitorTimezone,
  getDistinctStages,
  getTvChannels,
  localDateKey,
  pickDefaultDateKey,
  sortFixturesByKickoff,
  type FixturePageFilters,
  type Wc26TvRegionCode,
  classifyFixtureMatch,
} from "@/lib/wc26-fixtures-page";
import type { Wc26GroupId } from "@/types/group";
import { WC26_GROUP_IDS } from "@/types/group";
import Wc26GamesProgress from "./Wc26GamesProgress";
import styles from "./wc26.module.css";

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
  const channels = getTvChannels(tvRegion);
  const score = getFixtureScore(fixture);

  return (
    <article
      className={`${styles.fixMatch} ${
        matchClass === "ft"
          ? styles.fixMatchDone
          : matchClass === "live"
            ? styles.fixMatchLive
            : ""
      }`}
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
          <span
            className={`${styles.fixStatus} ${
              matchClass === "live"
                ? styles.fixStatusLive
                : matchClass === "ft"
                  ? styles.fixStatusFt
                  : styles.fixStatusScheduled
            }`}
          >
            {matchClass === "live" ? (
              <span className={styles.fixLiveDot} aria-hidden="true">
                ●
              </span>
            ) : null}
            {fixtureStatusBadgeLabel(fixture)}
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
          {score ? (
            <>
              <div className={styles.fixCentreTime}>
                {score.home} – {score.away}
              </div>
              <div className={styles.fixCentreNote}>
                {formatFixtureStatusLabel(fixture.status)}
                {fixture.elapsed != null && matchClass === "live"
                  ? ` · ${fixture.elapsed}'`
                  : ""}
              </div>
            </>
          ) : matchClass === "upcoming" ? (
            <>
              <div className={styles.fixCentreTime}>
                {new Intl.DateTimeFormat(undefined, {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(new Date(fixture.kickoffUtc))}
              </div>
              <div className={styles.fixCentreNote}>{formatVisitorTimezone()}</div>
            </>
          ) : (
            <>
              <div className={styles.fixCentreStatus}>
                {matchClass === "live" ? "Live" : "Full time"}
              </div>
              <div className={styles.fixCentreNote}>
                {formatFixtureStatusLabel(fixture.status)}
              </div>
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
          <div className={styles.fixTv}>
            {channels.map((channel) => (
              <span key={channel} className={styles.fixTvChip}>
                {channel}
              </span>
            ))}
          </div>
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
  const [tvRegion, setTvRegion] = useState<Wc26TvRegionCode>("GB");
  const [selectedDate, setSelectedDate] = useState("");

  const refreshFixtures = useCallback(() => {
    setFixtures(getEffectiveFixtures());
  }, []);

  useEffect(() => {
    refreshFixtures();
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
    return pickDefaultDateKey(calendarDays);
  }, [calendarDays, selectedDate]);

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

  const todayKey = localDateKey(new Date().toISOString());

  return (
    <section aria-labelledby="fixtures-calendar-heading" className={styles.fixturesCalendar}>
      <h2 id="fixtures-calendar-heading" className={styles.visuallyHidden}>
        World Cup 2026 fixture calendar
      </h2>

      <div className={styles.fixMetrics} aria-label="Tournament facts">
        <div className={styles.fixMetric}>
          <b>{WC26_TEAM_COUNT}</b>
          <span>Teams</span>
        </div>
        <div className={styles.fixMetric}>
          <b>{WC26_TOURNAMENT.fixtureCount}</b>
          <span>Matches</span>
        </div>
        <div className={styles.fixMetric}>
          <b>{WC26_VENUE_COUNT}</b>
          <span>Venues</span>
        </div>
        <div className={styles.fixMetric}>
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
            <div className={styles.fixCalMeta}>
              {activeDateKey
                ? formatLongLocalDate(activeDateKey)
                : "Select a match day"}
            </div>
          </div>
          <div className={styles.fixCalTotal}>
            {fixtures.length} loaded · {WC26_TOURNAMENT.fixtureCount} total
          </div>
        </div>
        <div className={styles.fixCalRow} role="tablist" aria-label="Match days">
          {calendarDays.map((day) => {
            const isActive = day.dateKey === activeDateKey;
            const isToday = day.dateKey === todayKey;
            return (
              <button
                key={day.dateKey}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.fixCalDay} ${isActive ? styles.fixCalDayActive : ""} ${isToday ? styles.fixCalDayToday : ""}`}
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

      <div className={styles.fixTvBar}>
        <strong>TV in:</strong>
        <select
          className={styles.fixTvSelect}
          value={tvRegion}
          onChange={(e) => setTvRegion(e.target.value as Wc26TvRegionCode)}
          aria-label="TV region"
        >
          {WC26_TV_REGIONS.map((region) => (
            <option key={region.code} value={region.code}>
              {region.label}
            </option>
          ))}
        </select>
        <span className={styles.fixTzPill}>{formatVisitorTimezone()} times</span>
      </div>

      {activeDateKey ? (
        <section className={styles.fixDayBlock} aria-labelledby="fix-day-head">
          <div className={styles.fixDayHead}>
            <div className={styles.fixDayLeft}>
              <div className={styles.fixDateBadge} aria-hidden="true">
                <b>{shortDayFromKey(activeDateKey).dayNum}</b>
                <span>{shortDayFromKey(activeDateKey).month}</span>
              </div>
              <div>
                <div id="fix-day-head" className={styles.fixDayName}>
                  {formatLongLocalDate(activeDateKey)}
                </div>
                <div className={styles.fixDaySub}>
                  Times in your local timezone ({formatVisitorTimezone()})
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

function shortDayFromKey(dateKey: string): { dayNum: number; month: string } {
  const d = new Date(`${dateKey}T12:00:00`);
  return {
    dayNum: d.getDate(),
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(d),
  };
}

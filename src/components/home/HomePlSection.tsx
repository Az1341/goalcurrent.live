"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import useSWR from "swr";
import type {
  PlFixtureRow,
  PlFixturesApiResponse,
  PlStandingRow,
  PlStandingsApiResponse,
  PlTeamsApiResponse,
} from "@/lib/pl/types";
import {
  buildZeroStandingsFromTeams,
  resolveDisplayStandings,
} from "@/lib/pl/standings-display";
import { PlTeamBadge } from "@/components/pl/PlShared";
import { fetcher, LIVE_SWR_OPTIONS } from "@/lib/client/fetcher";
import styles from "@/app/[locale]/page.module.css";

const PL_QUICK_LINKS = [
  { href: "/premier-league", labelKey: "plHome" },
  { href: "/premier-league/fixtures", labelKey: "fixtures" },
  { href: "/premier-league/table", labelKey: "table" },
  { href: "/premier-league/live", labelKey: "live" },
] as const;

function findNextFixture(fixtures: PlFixtureRow[]): PlFixtureRow | null {
  const now = Date.now();
  const live = fixtures.filter((f) => f.status === "LIVE");
  if (live.length) return live[0];
  const upcoming = fixtures
    .filter((f) => f.status === "UPCOMING" && new Date(f.kickoffUtc).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
  return upcoming[0] ?? null;
}

function findLatestResult(fixtures: PlFixtureRow[]): PlFixtureRow | null {
  const finished = fixtures
    .filter((f) => f.status === "FT")
    .sort(
      (a, b) =>
        new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime(),
    );
  return finished[0] ?? null;
}

function formatPlKickoff(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function PlFixtureCompact({ fixture }: { fixture: PlFixtureRow }) {
  const href = `/premier-league/match/${fixture.fixtureId}`;
  const score =
    fixture.homeScore != null && fixture.awayScore != null
      ? `${fixture.homeScore}–${fixture.awayScore}`
      : null;

  return (
    <Link href={href} className={styles.plFixtureCompact}>
      <div className={styles.plFixtureTeams}>
        <PlTeamBadge name={fixture.homeTeamName} logo={fixture.homeTeamLogo} size={20} />
        <span className={styles.plFixtureTeamName}>{fixture.homeTeamName}</span>
        <span className={styles.plFixtureScore}>{score ?? "vs"}</span>
        <span className={styles.plFixtureTeamName}>{fixture.awayTeamName}</span>
        <PlTeamBadge name={fixture.awayTeamName} logo={fixture.awayTeamLogo} size={20} />
      </div>
      <span className={styles.plFixtureMeta}>
        {fixture.status === "LIVE"
          ? `Live${fixture.elapsed != null ? ` · ${fixture.elapsed}'` : ""}`
          : fixture.status === "FT"
            ? "Full time"
            : formatPlKickoff(fixture.kickoffUtc)}
      </span>
    </Link>
  );
}

function PlTableCompact({ rows }: { rows: readonly PlStandingRow[] }) {
  return (
    <table className={styles.plMiniTable}>
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Club</th>
          <th scope="col">P</th>
          <th scope="col">Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.teamId}>
            <td>{row.rank}</td>
            <td>
              <span className={styles.plMiniClub}>
                <PlTeamBadge name={row.teamName} logo={row.teamLogo} size={18} />
                <span>{row.teamName}</span>
              </span>
            </td>
            <td>{row.played}</td>
            <td className={styles.plMiniPts}>{row.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function HomePlSection() {
  const t = useTranslations("nav");

  const {
    data: fixturesData,
    error: fixturesError,
    isLoading: fixturesLoading,
  } = useSWR<PlFixturesApiResponse>("/api/pl/fixtures", fetcher, LIVE_SWR_OPTIONS);

  const {
    data: standingsRaw,
    error: standingsError,
    isLoading: standingsLoading,
  } = useSWR<PlStandingsApiResponse>("/api/pl/standings", fetcher, LIVE_SWR_OPTIONS);

  const needsTeamsFallback =
    standingsRaw !== undefined && standingsRaw.standings.length === 0;

  const { data: teamsData } = useSWR<PlTeamsApiResponse>(
    needsTeamsFallback ? "/api/pl/teams" : null,
    fetcher,
    LIVE_SWR_OPTIONS,
  );

  const standingsData = useMemo((): PlStandingsApiResponse | null => {
    if (!standingsRaw) return null;
    if (standingsRaw.standings.length > 0) return standingsRaw;
    if (!teamsData?.teams.length) return standingsRaw;
    return {
      ...standingsRaw,
      standings: buildZeroStandingsFromTeams(
        teamsData.teams.map((team) => ({
          id: team.teamId,
          name: team.name,
          logo: team.logo,
        })),
      ),
    };
  }, [standingsRaw, teamsData]);

  const loading = fixturesLoading || standingsLoading;
  const error = fixturesError ?? standingsError;

  const nextFixture = useMemo(
    () =>
      fixturesData?.fixtures.length
        ? findNextFixture(fixturesData.fixtures)
        : null,
    [fixturesData],
  );

  const latestResult = useMemo(
    () =>
      fixturesData?.fixtures.length
        ? findLatestResult(fixturesData.fixtures)
        : null,
    [fixturesData],
  );

  const topFive = useMemo(() => {
    if (!standingsData?.standings.length) return [];
    return resolveDisplayStandings(standingsData.standings).slice(0, 5);
  }, [standingsData]);

  return (
    <section className={styles.sectionBlock} aria-labelledby="home-pl-heading">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <span className={styles.sectionBar} aria-hidden="true" />
          <h2 id="home-pl-heading" className={styles.sectionTitle}>
            Premier League 2026/27
          </h2>
        </div>
        <Link href="/premier-league" className={styles.sectionLink}>
          PL Hub →
        </Link>
      </div>

      {loading ? (
        <p className={styles.columnEmpty}>Loading Premier League data…</p>
      ) : null}

      {error ? (
        <p className={styles.columnEmpty}>
          Premier League data is temporarily unavailable.{" "}
          <Link href="/premier-league">Visit PL hub</Link>
        </p>
      ) : null}

      {!loading && !error ? (
        <>
          <div className={styles.plHomeGrid}>
            <div className={styles.plHomeCard}>
              <h3 className={styles.plHomeCardTitle}>Next / Live</h3>
              {nextFixture ? (
                <PlFixtureCompact fixture={nextFixture} />
              ) : (
                <p className={styles.plHomeEmpty}>No upcoming fixtures scheduled.</p>
              )}
            </div>

            <div className={styles.plHomeCard}>
              <h3 className={styles.plHomeCardTitle}>Latest Result</h3>
              {latestResult ? (
                <PlFixtureCompact fixture={latestResult} />
              ) : (
                <p className={styles.plHomeEmpty}>No results yet this season.</p>
              )}
            </div>

            <div className={`${styles.plHomeCard} ${styles.plHomeCardWide}`}>
              <div className={styles.plHomeCardHead}>
                <h3 className={styles.plHomeCardTitle}>Table — Top 5</h3>
                <Link href="/premier-league/table" className={styles.plHomeCardLink}>
                  Full table →
                </Link>
              </div>
              {topFive.length ? (
                <PlTableCompact rows={topFive} />
              ) : (
                <p className={styles.plHomeEmpty}>Table data loading…</p>
              )}
            </div>
          </div>

          <nav className={styles.plQuickLinks} aria-label="Premier League quick links">
            {PL_QUICK_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={styles.plQuickLink}>
                {t(link.labelKey)}
              </Link>
            ))}
          </nav>
        </>
      ) : null}
    </section>
  );
}

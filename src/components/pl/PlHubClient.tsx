"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import type {
  PlFixtureRow,
  PlFixturesApiResponse,
  PlStandingRow,
  PlStandingsApiResponse,
  PlTeamsApiResponse,
} from "@/lib/pl/types";
import {
  buildZeroStandingsFromTeams,
  isPreseasonStandings,
  resolveDisplayStandings,
} from "@/lib/pl/standings-display";
import {
  PL_BROADCASTER_UNAVAILABLE,
  resolvePlBroadcasterForVisitor,
} from "@/lib/pl/pl-broadcasters";
import { PL_SECTION_NAV } from "@/lib/nav";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlData.module.css";
import tableStyles from "./PlTable.module.css";
import {
  PlEmptyPanel,
  PlErrorPanel,
  PlLoadingPanel,
  PlTeamBadge,
} from "./PlShared";

type ViewState = "loading" | "error" | "ready";

const HUB_LINKS = PL_SECTION_NAV;

function withVisitorBroadcasters(
  body: PlFixturesApiResponse,
): PlFixturesApiResponse {
  const visitorBroadcaster = resolvePlBroadcasterForVisitor();
  if (visitorBroadcaster === PL_BROADCASTER_UNAVAILABLE) return body;
  return {
    ...body,
    fixtures: body.fixtures.map((fixture) => ({
      ...fixture,
      broadcaster: visitorBroadcaster,
    })),
  };
}

function findNextFixture(fixtures: PlFixtureRow[]): PlFixtureRow | null {
  const now = Date.now();
  const upcoming = fixtures
    .filter((f) => f.status === "UPCOMING" && new Date(f.kickoffUtc).getTime() >= now)
    .sort(
      (a, b) =>
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
  if (upcoming.length) return upcoming[0];
  const live = fixtures.filter((f) => f.status === "LIVE");
  if (live.length) return live[0];
  return null;
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

function HubStandingRow({ row }: { row: PlStandingRow }) {
  return (
    <tr>
      <td className={tableStyles.colRank}>{row.rank}</td>
      <td className={tableStyles.colClub}>
        <div className={tableStyles.clubCell}>
          <PlTeamBadge name={row.teamName} logo={row.teamLogo} size={22} />
          <span className={tableStyles.clubName}>{row.teamName}</span>
        </div>
      </td>
      <td>{row.played}</td>
      <td className={tableStyles.colPts}>{row.points}</td>
    </tr>
  );
}

export default function PlHubClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [fixturesData, setFixturesData] = useState<PlFixturesApiResponse | null>(
    null,
  );
  const [standingsData, setStandingsData] =
    useState<PlStandingsApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setView("loading");
      try {
        const [fixturesRes, standingsRes] = await Promise.all([
          fetch("/api/pl/fixtures", { cache: "no-store" }),
          fetch("/api/pl/standings", { cache: "no-store" }),
        ]);

        if (!fixturesRes.ok || !standingsRes.ok) {
          throw new Error("Could not load Premier League hub data.");
        }

        let fixturesBody = withVisitorBroadcasters(
          (await fixturesRes.json()) as PlFixturesApiResponse,
        );
        let standingsBody = (await standingsRes.json()) as PlStandingsApiResponse;

        if (!standingsBody.standings.length) {
          const teamsRes = await fetch("/api/pl/teams", { cache: "no-store" });
          if (teamsRes.ok) {
            const teamsBody = (await teamsRes.json()) as PlTeamsApiResponse;
            if (teamsBody.teams.length) {
              standingsBody = {
                ...standingsBody,
                standings: buildZeroStandingsFromTeams(
                  teamsBody.teams.map((team) => ({
                    id: team.teamId,
                    name: team.name,
                    logo: team.logo,
                  })),
                ),
              };
            }
          }

          if (!standingsBody.standings.length && fixturesBody.fixtures.length) {
            const teams = new Map<
              number,
              { id: number; name: string; logo: string | null }
            >();
            for (const fixture of fixturesBody.fixtures) {
              teams.set(fixture.homeTeamId, {
                id: fixture.homeTeamId,
                name: fixture.homeTeamName,
                logo: fixture.homeTeamLogo,
              });
              teams.set(fixture.awayTeamId, {
                id: fixture.awayTeamId,
                name: fixture.awayTeamName,
                logo: fixture.awayTeamLogo,
              });
            }
            if (teams.size) {
              standingsBody = {
                ...standingsBody,
                standings: buildZeroStandingsFromTeams([...teams.values()]),
              };
            }
          }
        }

        if (cancelled) return;
        setFixturesData(fixturesBody);
        setStandingsData(standingsBody);
        setView("ready");
      } catch (error) {
        if (cancelled) return;
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setView("error");
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const nextFixture = useMemo(
    () =>
      fixturesData?.fixtures.length
        ? findNextFixture(fixturesData.fixtures)
        : null,
    [fixturesData?.fixtures],
  );

  const latestResult = useMemo(
    () =>
      fixturesData?.fixtures.length
        ? findLatestResult(fixturesData.fixtures)
        : null,
    [fixturesData?.fixtures],
  );

  const tableSnapshot = useMemo(() => {
    if (!standingsData?.standings.length) return [];
    return resolveDisplayStandings(standingsData.standings).slice(0, 6);
  }, [standingsData?.standings]);

  const preseasonTable =
    tableSnapshot.length > 0 && isPreseasonStandings(tableSnapshot);

  const configured =
    fixturesData?.configured !== false || standingsData?.configured !== false;

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League 2026/27</h1>
        <p className={styles.heroSub}>
          Your {SITE_NAME} hub — fixtures, table, clubs and stats from official
          API data.
        </p>
      </header>

      {view === "loading" ? (
        <PlLoadingPanel title="Loading hub" text="Fetching Premier League data…" />
      ) : null}
      {view === "error" ? (
        <PlErrorPanel
          title="Could not load hub"
          text={errorMessage ?? "Premier League data is temporarily unavailable."}
        />
      ) : null}

      {view === "ready" ? (
        <>
          <div className={styles.hubGrid}>
            <section className={styles.hubCard} aria-labelledby="pl-next-fixture">
              <h2 id="pl-next-fixture" className={styles.hubCardTitle}>
                Next fixture
              </h2>
              {nextFixture ? (
                <PlFixtureCard fixture={nextFixture} />
              ) : (
                <PlEmptyPanel
                  title="No upcoming fixtures"
                  text={
                    configured
                      ? "The next Premier League match will appear here when scheduled."
                      : "Fixtures will appear when the API key is configured on the server."
                  }
                />
              )}
            </section>

            <section className={styles.hubCard} aria-labelledby="pl-latest-result">
              <h2 id="pl-latest-result" className={styles.hubCardTitle}>
                Latest result
              </h2>
              {latestResult ? (
                <PlFixtureCard fixture={latestResult} />
              ) : (
                <PlEmptyPanel
                  title="No results yet"
                  text="Completed matches will appear here once the season begins."
                />
              )}
            </section>

            <section
              className={`${styles.hubCard} ${styles.hubCardWide}`}
              aria-labelledby="pl-table-snapshot"
            >
              <div className={styles.hubCardHeader}>
                <h2 id="pl-table-snapshot" className={styles.hubCardTitle}>
                  Table snapshot
                </h2>
                <Link href="/premier-league/table" className={styles.hubLink}>
                  Full table →
                </Link>
              </div>
              {tableSnapshot.length ? (
                <>
                  {preseasonTable ? (
                    <p className={styles.hubNote}>
                      Pre-season — alphabetical order until matches begin.
                    </p>
                  ) : null}
                  <div className={tableStyles.tableWrap}>
                    <table className={tableStyles.table}>
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col" className={tableStyles.colClub}>
                            Club
                          </th>
                          <th scope="col">P</th>
                          <th scope="col" className={tableStyles.colPts}>
                            Pts
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableSnapshot.map((row) => (
                          <HubStandingRow key={row.teamId} row={row} />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <p className={styles.hubNote}>Loading club list for table snapshot…</p>
              )}
            </section>

            <section className={styles.hubCard} aria-labelledby="pl-sections">
              <h2 id="pl-sections" className={styles.hubCardTitle}>
                Explore
              </h2>
              <nav className={styles.hubLinks} aria-label="Premier League sections">
                {HUB_LINKS.map((item) => (
                  <Link key={item.href} href={item.href} className={styles.hubLink}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </section>
          </div>

          <p className={styles.meta}>
            Data from API-Football · Updated{" "}
            {new Date(
              fixturesData?.fetchedAt ?? standingsData?.fetchedAt ?? Date.now(),
            ).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </>
      ) : null}
    </main>
  );
}

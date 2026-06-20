"use client";

import { useEffect, useMemo, useState } from "react";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import type { PlFixtureRow, PlFixturesApiResponse } from "@/lib/pl/types";
import {
  PL_BROADCASTER_UNAVAILABLE,
  resolvePlBroadcasterForVisitor,
} from "@/lib/pl/pl-broadcasters";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlFixtures.module.css";

type ViewState = "loading" | "error" | "empty" | "ready";
type WeekFilter = "all" | number;

const MATCHWEEKS = Array.from({ length: 38 }, (_, index) => index + 1);

function withVisitorBroadcasters(
  body: PlFixturesApiResponse,
): PlFixturesApiResponse {
  const visitorBroadcaster = resolvePlBroadcasterForVisitor();
  if (visitorBroadcaster === PL_BROADCASTER_UNAVAILABLE) {
    return body;
  }

  return {
    ...body,
    fixtures: body.fixtures.map((fixture) => ({
      ...fixture,
      broadcaster: visitorBroadcaster,
    })),
  };
}

function sortByKickoff(fixtures: PlFixtureRow[]): PlFixtureRow[] {
  return [...fixtures].sort(
    (a, b) =>
      new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
  );
}

export default function PlFixturesClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlFixturesApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<WeekFilter>("all");

  useEffect(() => {
    let cancelled = false;

    async function loadFixtures() {
      setView("loading");
      setErrorMessage(null);

      try {
        const res = await fetch("/api/pl/fixtures", { cache: "no-store" });
        if (!res.ok) {
          throw new Error(`Request failed (${res.status})`);
        }

        const body = withVisitorBroadcasters(
          (await res.json()) as PlFixturesApiResponse,
        );
        if (cancelled) return;

        setData(body);

        if (!body.fixtures.length) {
          setView("empty");
          return;
        }

        setView("ready");
      } catch (error) {
        if (cancelled) return;
        setData(null);
        setErrorMessage(
          error instanceof Error ? error.message : "Unknown error",
        );
        setView("error");
      }
    }

    void loadFixtures();
    return () => {
      cancelled = true;
    };
  }, []);

  const availableWeeks = useMemo(() => {
    if (!data?.fixtures.length) return [] as number[];
    const weeks = new Set<number>();
    for (const fixture of data.fixtures) {
      if (fixture.matchweek !== null) {
        weeks.add(fixture.matchweek);
      }
    }
    return [...weeks].sort((a, b) => a - b);
  }, [data?.fixtures]);

  const filteredFixtures = useMemo(() => {
    if (!data?.fixtures.length) return [] as PlFixtureRow[];

    const fixtures =
      selectedWeek === "all"
        ? data.fixtures
        : data.fixtures.filter((fixture) => fixture.matchweek === selectedWeek);

    return sortByKickoff(fixtures);
  }, [data?.fixtures, selectedWeek]);

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Fixtures will appear when the API key is configured on the server."
      : "The 2026/27 Premier League fixtures are not available yet. Check back when the season starts.");

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Fixtures 2026/27</h1>
        <p className={styles.heroSub}>
          Full season schedule on {SITE_NAME} — kickoffs shown in your local
          timezone.
        </p>
      </header>

      {view === "loading" ? (
        <div className={styles.panel} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.panelTitle}>Loading fixtures</p>
          <p className={styles.panelText}>Fetching Premier League schedule…</p>
        </div>
      ) : null}

      {view === "error" ? (
        <div className={styles.panel} role="alert">
          <p className={styles.panelTitle}>Could not load fixtures</p>
          <p className={styles.panelText}>
            {errorMessage ??
              "The fixtures API is temporarily unavailable. Please try again shortly."}
          </p>
        </div>
      ) : null}

      {view === "empty" ? (
        <div className={styles.panel} role="status">
          <p className={styles.panelTitle}>Fixtures not available yet</p>
          <p className={styles.panelText}>{emptyMessage}</p>
        </div>
      ) : null}

      {view === "ready" && data ? (
        <>
          <div className={styles.weekFilter} role="tablist" aria-label="Matchweek filter">
            <button
              type="button"
              role="tab"
              aria-selected={selectedWeek === "all"}
              className={`${styles.weekChip} ${selectedWeek === "all" ? styles.weekChipActive : ""}`}
              onClick={() => setSelectedWeek("all")}
            >
              ALL
            </button>
            {MATCHWEEKS.map((week) => {
              const hasFixtures = availableWeeks.includes(week);
              return (
                <button
                  key={week}
                  type="button"
                  role="tab"
                  aria-selected={selectedWeek === week}
                  className={`${styles.weekChip} ${selectedWeek === week ? styles.weekChipActive : ""} ${!hasFixtures ? styles.weekChipMuted : ""}`}
                  onClick={() => setSelectedWeek(week)}
                >
                  W{week}
                </button>
              );
            })}
          </div>

          {filteredFixtures.length === 0 ? (
            <div className={styles.panel} role="status">
              <p className={styles.panelTitle}>
                {selectedWeek === "all"
                  ? "No fixtures found"
                  : `No fixtures for Matchweek ${selectedWeek}`}
              </p>
              <p className={styles.panelText}>
                Try another matchweek or check back when the schedule is published.
              </p>
            </div>
          ) : (
            <section className={styles.group} aria-label="Fixtures list">
              {selectedWeek !== "all" ? (
                <h2 className={styles.sectionTitle}>Matchweek {selectedWeek}</h2>
              ) : null}
              {filteredFixtures.map((fixture) => (
                <PlFixtureCard key={fixture.fixtureId} fixture={fixture} />
              ))}
            </section>
          )}

          <p className={styles.meta}>
            Source: {data.source} · {data.fixtures.length} fixtures · Updated{" "}
            {new Date(data.fetchedAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </>
      ) : null}
    </main>
  );
}

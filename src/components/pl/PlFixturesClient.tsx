"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import { useLiveFixtures } from "@/lib/client/useLiveFixtures";
import { resolveCurrentMatchweek } from "@/lib/pl/current-matchweek";
import type { PlFixtureRow, PlFixturesApiResponse } from "@/lib/pl/types";
import {
  PL_BROADCASTER_UNAVAILABLE,
  resolvePlBroadcasterForVisitor,
} from "@/lib/pl/pl-broadcasters";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlFixtures.module.css";

type WeekFilter = "all" | number;

const MATCHWEEKS = Array.from({ length: 38 }, (_, index) => index + 1);
const ALL_TAB_BATCH = 40;

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
  const { data: rawData, error, isLoading, mutate } = useLiveFixtures();

  const data = useMemo(
    () => (rawData ? withVisitorBroadcasters(rawData) : null),
    [rawData],
  );

  /**
   * Default to the current matchweek (never "all" — rendering all 380 cards
   * blocks the main thread). `null` until the visitor picks a chip.
   */
  const [chosenWeek, setChosenWeek] = useState<WeekFilter | null>(null);
  const defaultWeek = useMemo(
    () => (data ? resolveCurrentMatchweek(data.fixtures) : null) ?? 1,
    [data],
  );
  const selectedWeek: WeekFilter = chosenWeek ?? defaultWeek;
  const setSelectedWeek = setChosenWeek;
  const activeChipRef = useRef<HTMLButtonElement | null>(null);
  const didScrollToDefault = useRef(false);
  const [allTabVisible, setAllTabVisible] = useState(ALL_TAB_BATCH);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("fixture");
    if (!raw) return;
    const id = Number.parseInt(raw, 10);
    if (Number.isFinite(id) && id > 0) {
      window.location.replace(`/premier-league/match/${id}`);
    }
  }, []);

  /** Bring the default chip into view — W6+ sits off-screen on mobile. */
  useEffect(() => {
    if (didScrollToDefault.current || chosenWeek !== null || !data) return;
    const chip = activeChipRef.current;
    if (!chip) return;
    didScrollToDefault.current = true;
    chip.scrollIntoView({ block: "nearest", inline: "center" });
  }, [chosenWeek, data, defaultWeek]);

  const availableWeeks = useMemo(() => {
    if (!data?.fixtures.length) return [] as number[];
    const weeks = new Set<number>();
    for (const fixture of data.fixtures) {
      if (fixture.matchweek !== null) {
        weeks.add(fixture.matchweek);
      }
    }
    return [...weeks].sort((a, b) => a - b);
  }, [data]);

  const filteredFixtures = useMemo(() => {
    if (!data?.fixtures.length) return [] as PlFixtureRow[];

    const fixtures =
      selectedWeek === "all"
        ? data.fixtures
        : data.fixtures.filter((fixture) => fixture.matchweek === selectedWeek);

    return sortByKickoff(fixtures);
  }, [data, selectedWeek]);

  const deferredFixtures = useDeferredValue(filteredFixtures);
  const fixturesToRender =
    selectedWeek === "all"
      ? deferredFixtures.slice(0, allTabVisible)
      : deferredFixtures;
  const listIsDeferred = deferredFixtures !== filteredFixtures;
  const hasMoreAll =
    selectedWeek === "all" && allTabVisible < deferredFixtures.length;

  const emptyMessage =
    data?.error ??
    (data?.configured === false
      ? "Fixtures will appear when the API key is configured on the server."
      : "The 2026/27 Premier League fixtures are not available yet. Check back when the season starts.");

  const showLoading = isLoading && !data;
  const showError = Boolean(error) && !data;
  const showEmpty = data != null && data.fixtures.length === 0;
  const showReady = data != null && data.fixtures.length > 0;

  return (
    <main className={styles.plPage}>
      <header className={styles.hero}>
        <h1 className={styles.heroTitle}>Premier League Fixtures 2026/27</h1>
        <p className={styles.heroSub}>
          Full season schedule on {SITE_NAME} — kickoffs shown in your local
          timezone.
        </p>
      </header>

      {showLoading ? (
        <div className={styles.panel} role="status" aria-live="polite">
          <div className={styles.spinner} aria-hidden="true" />
          <p className={styles.panelTitle}>Loading fixtures</p>
          <p className={styles.panelText}>Fetching Premier League schedule…</p>
        </div>
      ) : null}

      {showError ? (
        <div className={styles.panel} role="alert">
          <p className={styles.panelTitle}>Could not load fixtures</p>
          <p className={styles.panelText}>
            The fixtures API is temporarily unavailable. Please try again shortly.
          </p>
          <button
            type="button"
            className={styles.retryBtn}
            onClick={() => void mutate()}
          >
            Try again
          </button>
        </div>
      ) : null}

      {showEmpty ? (
        <div className={styles.panel} role="status">
          <p className={styles.panelTitle}>Fixtures not available yet</p>
          <p className={styles.panelText}>{emptyMessage}</p>
        </div>
      ) : null}

      {showReady && data ? (
        <>
          <div className={styles.weekFilter} role="tablist" aria-label="Matchweek filter">
            <button
              type="button"
              role="tab"
              aria-selected={selectedWeek === "all"}
              className={`${styles.weekChip} ${selectedWeek === "all" ? styles.weekChipActive : ""}`}
              onClick={() => {
                setSelectedWeek("all");
                setAllTabVisible(ALL_TAB_BATCH);
              }}
            >
              ALL
            </button>
            {MATCHWEEKS.map((week) => {
              const hasFixtures = availableWeeks.includes(week);
              return (
                <button
                  key={week}
                  ref={selectedWeek === week ? activeChipRef : undefined}
                  type="button"
                  role="tab"
                  aria-selected={selectedWeek === week}
                  className={`${styles.weekChip} ${selectedWeek === week ? styles.weekChipActive : ""} ${!hasFixtures ? styles.weekChipMuted : ""}`}
                  onClick={() => {
                    setSelectedWeek(week);
                    setAllTabVisible(ALL_TAB_BATCH);
                  }}
                >
                  W{week}
                </button>
              );
            })}
          </div>

          {listIsDeferred ? (
            <div className={styles.panel} role="status" aria-live="polite">
              <div className={styles.spinner} aria-hidden="true" />
              <p className={styles.panelTitle}>Updating fixtures</p>
            </div>
          ) : null}

          {filteredFixtures.length === 0 && !listIsDeferred ? (
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
          ) : null}

          {fixturesToRender.length > 0 && !listIsDeferred ? (
            <section className={styles.group} aria-label="Fixtures list">
              {selectedWeek !== "all" ? (
                <h2 className={styles.sectionTitle}>Matchweek {selectedWeek}</h2>
              ) : null}
              {fixturesToRender.map((fixture) => (
                <PlFixtureCard key={fixture.fixtureId} fixture={fixture} />
              ))}
              {hasMoreAll ? (
                <button
                  type="button"
                  className={styles.loadMoreBtn}
                  onClick={() =>
                    setAllTabVisible((count) =>
                      Math.min(count + ALL_TAB_BATCH, deferredFixtures.length),
                    )
                  }
                >
                  Show more fixtures (
                  {deferredFixtures.length - allTabVisible} remaining)
                </button>
              ) : null}
            </section>
          ) : null}

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

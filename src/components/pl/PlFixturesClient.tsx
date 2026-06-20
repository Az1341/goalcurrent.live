"use client";

import { useEffect, useMemo, useState } from "react";
import AdSenseUnit from "@/components/AdSenseUnit";
import type {
  PlFixtureRow,
  PlFixturesApiResponse,
  PlFixtureStatus,
} from "@/lib/pl/types";
import { SITE_NAME } from "@/lib/site-url";
import styles from "./PlFixtures.module.css";

type ViewState = "loading" | "error" | "empty" | "ready";

function teamInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].slice(0, 3).toUpperCase();
  }
  return parts
    .slice(0, 2)
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase();
}

function formatLocalKickoff(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function statusClass(status: PlFixtureStatus): string {
  switch (status) {
    case "LIVE":
      return styles.statusLive;
    case "FT":
      return styles.statusFt;
    case "POSTPONED":
      return styles.statusPostponed;
    case "CANCELLED":
      return styles.statusCancelled;
    default:
      return styles.statusUpcoming;
  }
}

function statusLabel(status: PlFixtureStatus): string {
  switch (status) {
    case "LIVE":
      return "Live";
    case "FT":
      return "FT";
    case "POSTPONED":
      return "Postponed";
    case "CANCELLED":
      return "Cancelled";
    default:
      return "Upcoming";
  }
}

function TeamBadge({
  name,
  logo,
}: {
  name: string;
  logo: string | null;
}) {
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = logo && !logoFailed;

  return (
    <span className={styles.badge} aria-hidden="true">
      {showLogo ? (
        <img
          src={logo}
          alt=""
          width={24}
          height={24}
          loading="lazy"
          onError={() => setLogoFailed(true)}
        />
      ) : (
        teamInitials(name)
      )}
    </span>
  );
}

function FixtureCard({ fixture }: { fixture: PlFixtureRow }) {
  const showScore =
    fixture.homeScore !== null &&
    fixture.awayScore !== null &&
    (fixture.status === "FT" || fixture.status === "LIVE");

  return (
    <article className={styles.card}>
      <div className={styles.cardMeta}>
        <span className={`${styles.status} ${statusClass(fixture.status)}`}>
          {statusLabel(fixture.status)}
        </span>
        <span className={styles.kickoff}>
          {formatLocalKickoff(fixture.kickoffUtc)}
        </span>
        {fixture.venue ? (
          <span className={styles.venue}>{fixture.venue}</span>
        ) : null}
      </div>

      <div className={styles.matchRow}>
        <div className={styles.teamSide}>
          <TeamBadge name={fixture.homeTeamName} logo={fixture.homeTeamLogo} />
          <span className={styles.teamName}>{fixture.homeTeamName}</span>
        </div>

        <div className={styles.scoreBox}>
          {showScore ? (
            <>
              <span className={styles.score}>
                {fixture.homeScore} - {fixture.awayScore}
              </span>
              {fixture.status === "LIVE" && fixture.elapsed !== null ? (
                <span className={styles.elapsed}>{fixture.elapsed}&apos;</span>
              ) : null}
            </>
          ) : (
            <span className={styles.vs}>VS</span>
          )}
        </div>

        <div className={`${styles.teamSide} ${styles.teamSideAway}`}>
          <TeamBadge name={fixture.awayTeamName} logo={fixture.awayTeamLogo} />
          <span className={styles.teamName}>{fixture.awayTeamName}</span>
        </div>
      </div>
    </article>
  );
}

function groupFixturesByMatchweek(
  fixtures: PlFixtureRow[],
): Array<{ key: string; label: string; items: PlFixtureRow[] }> {
  const groups = new Map<string, PlFixtureRow[]>();

  for (const fixture of fixtures) {
    const key =
      fixture.matchweek !== null
        ? `mw-${fixture.matchweek}`
        : fixture.round ?? "unknown";
    const existing = groups.get(key) ?? [];
    existing.push(fixture);
    groups.set(key, existing);
  }

  return Array.from(groups.entries()).map(([key, items]) => {
    const matchweek = items[0]?.matchweek;
    const label =
      matchweek !== null && matchweek !== undefined
        ? `Matchweek ${matchweek}`
        : items[0]?.round ?? "Fixtures";

    return { key, label, items };
  });
}

export default function PlFixturesClient() {
  const [view, setView] = useState<ViewState>("loading");
  const [data, setData] = useState<PlFixturesApiResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

        const body = (await res.json()) as PlFixturesApiResponse;
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

  const groups = useMemo(
    () => (data?.fixtures ? groupFixturesByMatchweek(data.fixtures) : []),
    [data?.fixtures],
  );

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

      <div className={styles.adWrap}>
        <AdSenseUnit slot="4567890123" />
      </div>

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
          {groups.map((group) => (
            <section key={group.key} className={styles.group}>
              <h2 className={styles.sectionTitle}>{group.label}</h2>
              {group.items.map((fixture) => (
                <FixtureCard key={fixture.fixtureId} fixture={fixture} />
              ))}
            </section>
          ))}

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

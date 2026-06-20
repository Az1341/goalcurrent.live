"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  buildGoogleCalendarUrl,
  downloadIcsFile,
  type CalendarEventInput,
} from "@/lib/calendar";
import type { PlFixtureRow, PlFixtureStatus } from "@/lib/pl/types";
import {
  isPlBroadcasterAvailable,
} from "@/lib/pl/pl-broadcasters";
import { absoluteUrl } from "@/lib/site-url";
import styles from "./PlFixtures.module.css";

const PL_COMPETITION = "Premier League 2026/27";

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

function toCalendarEvent(fixture: PlFixtureRow): CalendarEventInput {
  return {
    homeTeam: fixture.homeTeamName,
    awayTeam: fixture.awayTeamName,
    kickoffUtc: fixture.kickoffUtc,
    venue: fixture.venue ?? undefined,
    competition: PL_COMPETITION,
    matchPageUrl: absoluteUrl(
      `/premier-league/match/${fixture.fixtureId}`,
    ),
    broadcaster: isPlBroadcasterAvailable(fixture.broadcaster)
      ? fixture.broadcaster
      : undefined,
  };
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

type PlFixtureCardProps = {
  fixture: PlFixtureRow;
};

export default function PlFixtureCard({ fixture }: PlFixtureCardProps) {
  const showScore =
    fixture.homeScore !== null &&
    fixture.awayScore !== null &&
    (fixture.status === "FT" || fixture.status === "LIVE");

  const calendarEvent = useMemo(
    () => toCalendarEvent(fixture),
    [fixture],
  );
  const googleCalendarUrl = useMemo(
    () => buildGoogleCalendarUrl(calendarEvent),
    [calendarEvent],
  );

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
        {isPlBroadcasterAvailable(fixture.broadcaster) ? (
          <span className={styles.broadcaster}>{fixture.broadcaster}</span>
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

      <div className={styles.calendarActions}>
        <Link
          href={`/premier-league/match/${fixture.fixtureId}`}
          className={`${styles.calendarLink} ${styles.calendarLinkPrimary}`}
        >
          Match Centre
        </Link>
        <div className={styles.calendarActionsRow}>
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.calendarLink}
          >
            Calendar
          </a>
          <button
            type="button"
            className={styles.calendarLink}
            onClick={() => downloadIcsFile(calendarEvent)}
          >
            Download
          </button>
        </div>
      </div>
    </article>
  );
}

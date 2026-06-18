"use client";

import { useMemo, useState } from "react";
import { WC26_GROUP_IDS, WC26_TEAMS, WC26_TEAM_COUNT } from "@/data/wc26";
import TeamCard from "./TeamCard";
import {
  filterTeams,
  formatTeamResultCount,
  type TeamGroupFilter,
} from "@/lib/wc26-team-filter";
import styles from "./wc26.module.css";

export default function TeamsSection() {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState<TeamGroupFilter>("all");

  const filteredTeams = useMemo(
    () => filterTeams(WC26_TEAMS, query, groupFilter),
    [query, groupFilter],
  );

  const resultLabel = formatTeamResultCount(
    filteredTeams.length,
    WC26_TEAM_COUNT,
    query,
    groupFilter,
  );

  const searchSummary =
    query.trim() || groupFilter !== "all"
      ? `Showing ${filteredTeams.length} of ${WC26_TEAM_COUNT} qualified nations${
          query.trim() ? ` matching “${query.trim()}”` : ""
        }${groupFilter !== "all" ? ` in Group ${groupFilter.toUpperCase()}` : ""}.`
      : `All ${WC26_TEAM_COUNT} qualified nations at FIFA World Cup 2026. Search by team name, FIFA code, or group.`;

  return (
    <section aria-labelledby="teams-section-heading">
      <h2 id="teams-section-heading" className={styles.sectionTitle}>
        Qualified nations
      </h2>

      <p className={styles.phaseNote}>
        Browse every nation at World Cup 2026 — search by name, FIFA code, or
        group letter. Use the filters below to narrow the grid.
      </p>

      <div className={styles.teamsToolbar}>
        <input
          type="search"
          className={styles.fixFilterInput}
          placeholder="Search team, code, or group…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search teams"
        />
        <p className={styles.teamsResultCount} aria-live="polite">
          {resultLabel}
        </p>
      </div>

      <div
        className={styles.filterRow}
        role="group"
        aria-label="Filter teams by group"
      >
        <button
          type="button"
          className={`${styles.filterChip} ${groupFilter === "all" ? styles.filterChipActive : ""}`}
          aria-pressed={groupFilter === "all"}
          onClick={() => setGroupFilter("all")}
        >
          ALL
        </button>
        {WC26_GROUP_IDS.map((groupId) => (
          <button
            key={groupId}
            type="button"
            className={`${styles.filterChip} ${groupFilter === groupId ? styles.filterChipActive : ""}`}
            aria-pressed={groupFilter === groupId}
            onClick={() => setGroupFilter(groupId)}
          >
            {groupId.toUpperCase()}
          </button>
        ))}
      </div>

      <p className={styles.teamsSearchSummary}>{searchSummary}</p>

      {filteredTeams.length === 0 ? (
        <p className={styles.teamsEmpty} role="status">
          No teams match your search. Try a different name, FIFA code, or group.
        </p>
      ) : (
        <div className={styles.tileGrid}>
          {filteredTeams.map((team) => (
            <TeamCard key={team.id} team={team} />
          ))}
        </div>
      )}
    </section>
  );
}

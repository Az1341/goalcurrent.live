/**
 * World Cup 2026 — single source of truth (official static metadata).
 *
 * Teams, groups, venues, and group-stage fixtures from FIFA official sources.
 * No API calls, scores, or standings calculations in this module.
 */

// ── Types (re-exported for convenience) ───────────────────────────────────────
export type { Team, TeamId } from "@/types/team";
export type { Group, Wc26GroupId } from "@/types/group";
export type { Venue, VenueId, HostCountry } from "@/types/venue";
export type {
  Fixture,
  FixtureStage,
  FixtureStatus,
} from "@/types/fixture";
export type { StandingRow, GroupStandings } from "@/types/standing";

export {
  WC26_GROUP_IDS,
  TEAMS_PER_GROUP,
  isWc26GroupId,
  groupLabel,
} from "@/types/group";

export {
  EMPTY_STANDING_STATS,
  createEmptyStandingRow,
} from "@/types/standing";

// ── Data ──────────────────────────────────────────────────────────────────────
export {
  WC26_TEAMS,
  getTeamById,
  getTeamsByGroup,
} from "./teams";

export {
  normalizeTeamName,
  resolveTeamId,
  getTeamFlagCode,
  getTeamDisplayName,
} from "@/lib/teamIdentity";

export {
  WC26_GROUPS,
  getGroupById,
  WC26_TEAM_COUNT,
  WC26_GROUP_COUNT,
} from "./groups";

export {
  WC26_VENUES,
  getVenueById,
  WC26_VENUE_COUNT,
} from "./venues";

export {
  WC26_TOURNAMENT,
  WC26_FIXTURES,
  WC26_GROUP_STAGE_FIXTURE_COUNT,
  getFixtureById,
  getFixturesByGroup,
  getFixturesByStage,
  getFixturesByTeam,
} from "./fixtures";

// ── Placeholder standings (zeroed rows, not calculated) ───────────────────────
import type { GroupStandings } from "@/types/standing";
import type { Wc26GroupId } from "@/types/group";
import { TEAMS_PER_GROUP, WC26_GROUP_IDS } from "@/types/group";
import { createEmptyStandingRow } from "@/types/standing";
import { WC26_GROUPS } from "./groups";
import { WC26_TEAMS } from "./teams";
import { WC26_VENUES } from "./venues";
import { WC26_FIXTURES } from "./fixtures";
import { getTeamById } from "./teams";

/** Empty group tables — one zeroed row per team, ready for future data. */
export const WC26_PLACEHOLDER_STANDINGS: readonly GroupStandings[] =
  WC26_GROUPS.map((group) => ({
    groupId: group.id,
    rows: group.teamIds.map((teamId) => {
      if (!getTeamById(teamId)) {
        throw new Error(`Unknown team id in standings placeholder: ${teamId}`);
      }
      return createEmptyStandingRow(teamId);
    }),
  }));

export function getPlaceholderStandingsByGroup(
  groupId: Wc26GroupId,
): GroupStandings | undefined {
  return WC26_PLACEHOLDER_STANDINGS.find((table) => table.groupId === groupId);
}

// ── Dataset validation (runs at import time in dev/build) ─────────────────────

function validateWc26Dataset(): void {
  if (WC26_TEAMS.length !== 48) {
    throw new Error(`Expected 48 teams, found ${WC26_TEAMS.length}`);
  }

  const teamIds = new Set(WC26_TEAMS.map((team) => team.id));
  if (teamIds.size !== 48) {
    throw new Error("Duplicate team IDs in WC26_TEAMS");
  }

  if (WC26_GROUPS.length !== 12) {
    throw new Error(`Expected 12 groups, found ${WC26_GROUPS.length}`);
  }

  const assignedTeamIds = new Set<string>();
  for (const group of WC26_GROUPS) {
    if (group.teamIds.length !== TEAMS_PER_GROUP) {
      throw new Error(
        `Group ${group.id} has ${group.teamIds.length} teams, expected ${TEAMS_PER_GROUP}`,
      );
    }
    for (const teamId of group.teamIds) {
      if (!teamIds.has(teamId)) {
        throw new Error(`Group ${group.id} references unknown team: ${teamId}`);
      }
      if (assignedTeamIds.has(teamId)) {
        throw new Error(`Team ${teamId} appears in more than one group`);
      }
      assignedTeamIds.add(teamId);
    }
  }

  if (assignedTeamIds.size !== 48) {
    throw new Error(
      `Expected 48 unique group assignments, found ${assignedTeamIds.size}`,
    );
  }

  for (const groupId of WC26_GROUP_IDS) {
    if (!WC26_GROUPS.some((group) => group.id === groupId)) {
      throw new Error(`Missing group: ${groupId}`);
    }
  }

  if (WC26_VENUES.length !== 16) {
    throw new Error(`Expected 16 venues, found ${WC26_VENUES.length}`);
  }

  const venueIds = new Set(WC26_VENUES.map((venue) => venue.id));
  if (venueIds.size !== 16) {
    throw new Error("Duplicate venue IDs in WC26_VENUES");
  }

  for (const team of WC26_TEAMS) {
    if (!team.flagCode.trim()) {
      throw new Error(`Team ${team.id} is missing flagCode`);
    }
  }

  for (const fixture of WC26_FIXTURES) {
    if (!teamIds.has(fixture.homeTeamId)) {
      throw new Error(
        `Fixture ${fixture.id} references unknown home team: ${fixture.homeTeamId}`,
      );
    }
    if (!teamIds.has(fixture.awayTeamId)) {
      throw new Error(
        `Fixture ${fixture.id} references unknown away team: ${fixture.awayTeamId}`,
      );
    }
    if (!venueIds.has(fixture.venueId)) {
      throw new Error(
        `Fixture ${fixture.id} references unknown venue: ${fixture.venueId}`,
      );
    }
    if (fixture.status !== "scheduled") {
      throw new Error(`Fixture ${fixture.id} must have status "scheduled"`);
    }
  }
}

validateWc26Dataset();

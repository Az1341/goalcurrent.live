/**
 * World Cup 2026 — single source of truth (placeholder data).
 *
 * Import from this module in pages and components when wiring real content.
 * No API calls, scores, or standings calculations in this phase.
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
  buildTeamId,
} from "./teams";

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
  getFixtureById,
  getFixturesByGroup,
  getFixturesByStage,
} from "./fixtures";

// ── Placeholder standings (zeroed rows, not calculated) ───────────────────────
import type { GroupStandings } from "@/types/standing";
import type { Wc26GroupId } from "@/types/group";
import { createEmptyStandingRow } from "@/types/standing";
import { WC26_GROUPS } from "./groups";
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

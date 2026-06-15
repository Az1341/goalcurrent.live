import type { Group } from "@/types/group";
import {
  WC26_GROUP_IDS,
  groupLabel,
  type Wc26GroupId,
} from "@/types/group";
import { getTeamsByGroup, WC26_TEAMS } from "./teams";

/** Twelve groups with four placeholder team slots each. */
export const WC26_GROUPS: readonly Group[] = WC26_GROUP_IDS.map((id) => ({
  id,
  label: groupLabel(id),
  teamIds: getTeamsByGroup(id).map((team) => team.id),
}));

const groupById = new Map<Wc26GroupId, Group>(
  WC26_GROUPS.map((group) => [group.id, group]),
);

export function getGroupById(id: Wc26GroupId): Group | undefined {
  return groupById.get(id);
}

/** Total qualified teams in the placeholder dataset. */
export const WC26_TEAM_COUNT = 48;

/** Total groups in the 2026 format. */
export const WC26_GROUP_COUNT = 12;

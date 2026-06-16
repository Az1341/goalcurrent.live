/**
 * WC26 route helpers — re-exports types from the data layer.
 * Group and team data live in @/data/wc26.
 */
export {
  WC26_GROUP_IDS,
  type Wc26GroupId,
  isWc26GroupId,
  groupLabel,
} from "@/data/wc26";

export const GROUPS_HUB_HREF = "/worldcup2026/groups";

export const WC26_HUB_HREF = "/worldcup2026";

/** Teams that qualify automatically from each group in the 48-team format. */
export const WC26_QUALIFYING_SPOTS = 2 as const;

export function groupHref(id: import("@/data/wc26").Wc26GroupId): string {
  return `/worldcup2026/groups/${id}`;
}

/** WC26 group identifiers — structure only, no team or score data. */
export const WC26_GROUPS = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
] as const;

export type Wc26GroupId = (typeof WC26_GROUPS)[number];

export function isWc26GroupId(value: string): value is Wc26GroupId {
  return (WC26_GROUPS as readonly string[]).includes(value);
}

export function groupLabel(id: Wc26GroupId): string {
  return `Group ${id.toUpperCase()}`;
}

export function groupHref(id: Wc26GroupId): string {
  return `/worldcup2026/groups/${id}`;
}

export const GROUPS_HUB_HREF = "/worldcup2026/groups";

export const WC26_HUB_HREF = "/worldcup2026";

import type { Group } from "@/types/group";
import {
  WC26_GROUP_IDS,
  groupLabel,
  type Wc26GroupId,
} from "@/types/group";

/** Twelve groups — FIFA final draw, December 2025 (team IDs only). */
export const WC26_GROUPS: readonly Group[] = [
  {
    id: "a",
    label: groupLabel("a"),
    teamIds: ["mex", "rsa", "kor", "cze"],
  },
  {
    id: "b",
    label: groupLabel("b"),
    teamIds: ["can", "bih", "qat", "sui"],
  },
  {
    id: "c",
    label: groupLabel("c"),
    teamIds: ["bra", "mar", "hai", "sco"],
  },
  {
    id: "d",
    label: groupLabel("d"),
    teamIds: ["usa", "par", "aus", "tur"],
  },
  {
    id: "e",
    label: groupLabel("e"),
    teamIds: ["ger", "cuw", "civ", "ecu"],
  },
  {
    id: "f",
    label: groupLabel("f"),
    teamIds: ["ned", "jpn", "swe", "tun"],
  },
  {
    id: "g",
    label: groupLabel("g"),
    teamIds: ["bel", "egy", "irn", "nzl"],
  },
  {
    id: "h",
    label: groupLabel("h"),
    teamIds: ["esp", "cpv", "ksa", "uru"],
  },
  {
    id: "i",
    label: groupLabel("i"),
    teamIds: ["fra", "sen", "irq", "nor"],
  },
  {
    id: "j",
    label: groupLabel("j"),
    teamIds: ["arg", "alg", "aut", "jor"],
  },
  {
    id: "k",
    label: groupLabel("k"),
    teamIds: ["por", "cod", "uzb", "col"],
  },
  {
    id: "l",
    label: groupLabel("l"),
    teamIds: ["eng", "cro", "gha", "pan"],
  },
] as const;

const groupById = new Map<Wc26GroupId, Group>(
  WC26_GROUPS.map((group) => [group.id, group]),
);

export function getGroupById(id: Wc26GroupId): Group | undefined {
  return groupById.get(id);
}

/** Total qualified teams. */
export const WC26_TEAM_COUNT = 48;

/** Total groups in the 2026 format. */
export const WC26_GROUP_COUNT = 12;

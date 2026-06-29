import type { TeamId } from "@/types/team";
import type { Wc26GroupId } from "@/types/group";

/** Final group-stage qualification outcome (28 June 2026). */
export type Wc26QualificationStatus =
  | "winner"
  | "runner-up"
  | "third-qualified"
  | "eliminated";

export type Wc26TeamStanding = {
  readonly teamId: TeamId;
  readonly mp: number;
  readonly w: number;
  readonly d: number;
  readonly l: number;
  readonly gf: number;
  readonly ga: number;
  readonly gd: number;
  readonly pts: number;
  readonly qualified: Wc26QualificationStatus;
};

export type Wc26FinalGroup = {
  readonly groupId: Wc26GroupId;
  readonly label: string;
  readonly teams: readonly Wc26TeamStanding[];
};

/** Group stage FINAL — hardcoded 28 June 2026 (NBC, Al Jazeera, Yahoo cross-check). */
export const WC26_FINAL_GROUPS: readonly Wc26FinalGroup[] = [
  {
    groupId: "a",
    label: "Group A",
    teams: [
      { teamId: "mex", mp: 3, w: 3, d: 0, l: 0, gf: 6, ga: 0, gd: 6, pts: 9, qualified: "winner" },
      { teamId: "rsa", mp: 3, w: 1, d: 1, l: 1, gf: 2, ga: 3, gd: -1, pts: 4, qualified: "runner-up" },
      { teamId: "kor", mp: 3, w: 1, d: 0, l: 2, gf: 2, ga: 3, gd: -1, pts: 3, qualified: "eliminated" },
      { teamId: "cze", mp: 3, w: 0, d: 1, l: 2, gf: 2, ga: 6, gd: -4, pts: 1, qualified: "eliminated" },
    ],
  },
  {
    groupId: "b",
    label: "Group B",
    teams: [
      { teamId: "sui", mp: 3, w: 2, d: 1, l: 0, gf: 5, ga: 1, gd: 4, pts: 7, qualified: "winner" },
      { teamId: "can", mp: 3, w: 1, d: 1, l: 1, gf: 8, ga: 3, gd: 5, pts: 4, qualified: "runner-up" },
      { teamId: "bih", mp: 3, w: 1, d: 1, l: 1, gf: 4, ga: 5, gd: -1, pts: 4, qualified: "third-qualified" },
      { teamId: "qat", mp: 3, w: 0, d: 1, l: 2, gf: 1, ga: 9, gd: -8, pts: 1, qualified: "eliminated" },
    ],
  },
  {
    groupId: "c",
    label: "Group C",
    teams: [
      { teamId: "bra", mp: 3, w: 2, d: 1, l: 0, gf: 7, ga: 1, gd: 6, pts: 7, qualified: "winner" },
      { teamId: "mar", mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 3, gd: 3, pts: 7, qualified: "runner-up" },
      { teamId: "sco", mp: 3, w: 1, d: 0, l: 2, gf: 1, ga: 4, gd: -3, pts: 3, qualified: "eliminated" },
      { teamId: "hai", mp: 3, w: 0, d: 0, l: 3, gf: 2, ga: 8, gd: -6, pts: 0, qualified: "eliminated" },
    ],
  },
  {
    groupId: "d",
    label: "Group D",
    teams: [
      { teamId: "usa", mp: 3, w: 2, d: 0, l: 1, gf: 8, ga: 4, gd: 4, pts: 6, qualified: "winner" },
      { teamId: "aus", mp: 3, w: 1, d: 1, l: 1, gf: 2, ga: 2, gd: 0, pts: 4, qualified: "runner-up" },
      { teamId: "par", mp: 3, w: 1, d: 1, l: 1, gf: 2, ga: 4, gd: -2, pts: 4, qualified: "third-qualified" },
      { teamId: "tur", mp: 3, w: 1, d: 0, l: 2, gf: 3, ga: 5, gd: -2, pts: 3, qualified: "eliminated" },
    ],
  },
  {
    groupId: "e",
    label: "Group E",
    teams: [
      { teamId: "ger", mp: 3, w: 2, d: 0, l: 1, gf: 10, ga: 2, gd: 8, pts: 6, qualified: "winner" },
      { teamId: "civ", mp: 3, w: 2, d: 0, l: 1, gf: 4, ga: 2, gd: 2, pts: 6, qualified: "runner-up" },
      { teamId: "ecu", mp: 3, w: 1, d: 1, l: 1, gf: 2, ga: 2, gd: 0, pts: 4, qualified: "third-qualified" },
      { teamId: "cuw", mp: 3, w: 0, d: 1, l: 2, gf: 1, ga: 9, gd: -8, pts: 1, qualified: "eliminated" },
    ],
  },
  {
    groupId: "f",
    label: "Group F",
    teams: [
      { teamId: "ned", mp: 3, w: 2, d: 1, l: 0, gf: 10, ga: 4, gd: 6, pts: 7, qualified: "winner" },
      { teamId: "jpn", mp: 3, w: 1, d: 2, l: 0, gf: 7, ga: 3, gd: 4, pts: 5, qualified: "runner-up" },
      { teamId: "swe", mp: 3, w: 1, d: 1, l: 1, gf: 7, ga: 7, gd: 0, pts: 4, qualified: "third-qualified" },
      { teamId: "tun", mp: 3, w: 0, d: 0, l: 3, gf: 2, ga: 12, gd: -10, pts: 0, qualified: "eliminated" },
    ],
  },
  {
    groupId: "g",
    label: "Group G",
    teams: [
      { teamId: "bel", mp: 3, w: 1, d: 2, l: 0, gf: 6, ga: 3, gd: 3, pts: 5, qualified: "winner" },
      { teamId: "egy", mp: 3, w: 1, d: 2, l: 0, gf: 5, ga: 3, gd: 2, pts: 5, qualified: "runner-up" },
      { teamId: "irn", mp: 3, w: 0, d: 3, l: 0, gf: 3, ga: 3, gd: 0, pts: 3, qualified: "eliminated" },
      { teamId: "nzl", mp: 3, w: 0, d: 1, l: 2, gf: 4, ga: 10, gd: -5, pts: 1, qualified: "eliminated" },
    ],
  },
  {
    groupId: "h",
    label: "Group H",
    teams: [
      { teamId: "esp", mp: 3, w: 2, d: 1, l: 0, gf: 5, ga: 0, gd: 5, pts: 7, qualified: "winner" },
      { teamId: "cpv", mp: 3, w: 0, d: 3, l: 0, gf: 3, ga: 2, gd: 1, pts: 3, qualified: "runner-up" },
      { teamId: "uru", mp: 3, w: 0, d: 2, l: 1, gf: 3, ga: 4, gd: -1, pts: 2, qualified: "eliminated" },
      { teamId: "ksa", mp: 3, w: 0, d: 2, l: 1, gf: 1, ga: 5, gd: -4, pts: 2, qualified: "eliminated" },
    ],
  },
  {
    groupId: "i",
    label: "Group I",
    teams: [
      { teamId: "fra", mp: 3, w: 3, d: 0, l: 0, gf: 10, ga: 2, gd: 8, pts: 9, qualified: "winner" },
      { teamId: "nor", mp: 3, w: 2, d: 0, l: 1, gf: 8, ga: 7, gd: 1, pts: 6, qualified: "runner-up" },
      { teamId: "sen", mp: 3, w: 1, d: 0, l: 2, gf: 8, ga: 6, gd: 2, pts: 3, qualified: "third-qualified" },
      { teamId: "irq", mp: 3, w: 0, d: 0, l: 3, gf: 1, ga: 12, gd: -11, pts: 0, qualified: "eliminated" },
    ],
  },
  {
    groupId: "j",
    label: "Group J",
    teams: [
      { teamId: "arg", mp: 3, w: 3, d: 0, l: 0, gf: 8, ga: 1, gd: 7, pts: 9, qualified: "winner" },
      { teamId: "aut", mp: 3, w: 1, d: 1, l: 1, gf: 6, ga: 6, gd: 0, pts: 4, qualified: "runner-up" },
      { teamId: "alg", mp: 3, w: 1, d: 1, l: 1, gf: 5, ga: 7, gd: -2, pts: 4, qualified: "third-qualified" },
      { teamId: "jor", mp: 3, w: 0, d: 0, l: 3, gf: 2, ga: 7, gd: -5, pts: 0, qualified: "eliminated" },
    ],
  },
  {
    groupId: "k",
    label: "Group K",
    teams: [
      { teamId: "col", mp: 3, w: 2, d: 1, l: 0, gf: 4, ga: 1, gd: 3, pts: 7, qualified: "winner" },
      { teamId: "por", mp: 3, w: 1, d: 2, l: 0, gf: 6, ga: 1, gd: 5, pts: 5, qualified: "runner-up" },
      { teamId: "cod", mp: 3, w: 1, d: 1, l: 1, gf: 4, ga: 3, gd: 1, pts: 4, qualified: "third-qualified" },
      { teamId: "uzb", mp: 3, w: 0, d: 0, l: 3, gf: 2, ga: 11, gd: -9, pts: 0, qualified: "eliminated" },
    ],
  },
  {
    groupId: "l",
    label: "Group L",
    teams: [
      { teamId: "eng", mp: 3, w: 2, d: 1, l: 0, gf: 6, ga: 2, gd: 4, pts: 7, qualified: "winner" },
      { teamId: "cro", mp: 3, w: 2, d: 0, l: 1, gf: 5, ga: 5, gd: 0, pts: 6, qualified: "runner-up" },
      { teamId: "gha", mp: 3, w: 1, d: 1, l: 1, gf: 2, ga: 2, gd: 0, pts: 4, qualified: "eliminated" },
      { teamId: "pan", mp: 3, w: 0, d: 0, l: 3, gf: 0, ga: 4, gd: -4, pts: 0, qualified: "eliminated" },
    ],
  },
];

/** End-of-group-stage snapshot when the live top scorers API is unavailable. */
export const WC26_TOP_SCORERS_FALLBACK = [
  { rank: 1, playerName: "L. Messi", teamName: "Argentina", goals: 6 },
  { rank: 2, playerName: "E. Haaland", teamName: "Norway", goals: 4 },
  { rank: 2, playerName: "K. Mbappé", teamName: "France", goals: 4 },
  { rank: 2, playerName: "O. Dembélé", teamName: "France", goals: 4 },
  { rank: 2, playerName: "Vinícius Júnior", teamName: "Brazil", goals: 4 },
  { rank: 6, playerName: "B. Brobbey", teamName: "Netherlands", goals: 3 },
  { rank: 6, playerName: "J. David", teamName: "Canada", goals: 3 },
  { rank: 6, playerName: "D. Undav", teamName: "Germany", goals: 3 },
  { rank: 6, playerName: "M. Cunha", teamName: "Brazil", goals: 3 },
  { rank: 6, playerName: "I. Saibari", teamName: "Morocco", goals: 3 },
  { rank: 6, playerName: "I. Sarr", teamName: "Senegal", goals: 3 },
  { rank: 6, playerName: "J. Manzambi", teamName: "Switzerland", goals: 3 },
] as const;

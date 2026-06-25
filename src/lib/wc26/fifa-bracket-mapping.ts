import type { Wc26GroupId } from "@/types/group";
import type {
  BracketMatchTemplate,
  BracketSlotRef,
  KnockoutRoundTemplate,
} from "@/lib/wc26/bracket-types";

export type { KnockoutFeedSlot, KnockoutRoundTemplate } from "@/lib/wc26/bracket-types";

function third(groups: readonly Wc26GroupId[], label?: string): BracketSlotRef {
  const groupList = groups.map((id) => id.toUpperCase()).join("/");
  return {
    kind: "third-place",
    groups,
    label: label ?? `Best 3rd place (Groups ${groupList})`,
  };
}

/** Official FIFA World Cup 2026 Round of 32 templates (match numbers 73–88). */
export const FIFA_ROUND_OF_32_TEMPLATES: readonly BracketMatchTemplate[] = [
  {
    matchNumber: 73,
    round: "Round of 32",
    home: { kind: "group-runner-up", groupId: "a" },
    away: { kind: "group-runner-up", groupId: "b" },
  },
  {
    matchNumber: 74,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "e" },
    away: third(["a", "b", "c", "d", "f"]),
  },
  {
    matchNumber: 75,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "f" },
    away: { kind: "group-runner-up", groupId: "c" },
  },
  {
    matchNumber: 76,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "c" },
    away: { kind: "group-runner-up", groupId: "f" },
  },
  {
    matchNumber: 77,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "i" },
    away: third(["c", "d", "f", "g", "h"]),
  },
  {
    matchNumber: 78,
    round: "Round of 32",
    home: { kind: "group-runner-up", groupId: "e" },
    away: { kind: "group-runner-up", groupId: "i" },
  },
  {
    matchNumber: 79,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "a" },
    away: third(["c", "e", "f", "h", "i"]),
  },
  {
    matchNumber: 80,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "l" },
    away: third(["e", "h", "i", "j", "k"]),
  },
  {
    matchNumber: 81,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "d" },
    away: third(["b", "e", "f", "i", "j"]),
  },
  {
    matchNumber: 82,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "g" },
    away: third(["a", "e", "h", "i", "j"]),
  },
  {
    matchNumber: 83,
    round: "Round of 32",
    home: { kind: "group-runner-up", groupId: "k" },
    away: { kind: "group-runner-up", groupId: "l" },
  },
  {
    matchNumber: 84,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "h" },
    away: { kind: "group-runner-up", groupId: "j" },
  },
  {
    matchNumber: 85,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "b" },
    away: third(["e", "f", "g", "i", "j"]),
  },
  {
    matchNumber: 86,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "j" },
    away: { kind: "group-runner-up", groupId: "h" },
  },
  {
    matchNumber: 87,
    round: "Round of 32",
    home: { kind: "group-winner", groupId: "k" },
    away: third(["d", "e", "i", "j", "l"]),
  },
  {
    matchNumber: 88,
    round: "Round of 32",
    home: { kind: "group-runner-up", groupId: "d" },
    away: { kind: "group-runner-up", groupId: "g" },
  },
];

/** Later knockout rounds — winner feeds from prior match numbers (FIFA path). */
export const FIFA_KNOCKOUT_ROUND_TEMPLATES: readonly KnockoutRoundTemplate[] = [
  {
    round: "Round of 16",
    matches: [
      { matchNumber: 89, home: { kind: "winner", matchNumber: 73 }, away: { kind: "winner", matchNumber: 75 } },
      { matchNumber: 90, home: { kind: "winner", matchNumber: 74 }, away: { kind: "winner", matchNumber: 77 } },
      { matchNumber: 91, home: { kind: "winner", matchNumber: 76 }, away: { kind: "winner", matchNumber: 78 } },
      { matchNumber: 92, home: { kind: "winner", matchNumber: 79 }, away: { kind: "winner", matchNumber: 80 } },
      { matchNumber: 93, home: { kind: "winner", matchNumber: 83 }, away: { kind: "winner", matchNumber: 84 } },
      { matchNumber: 94, home: { kind: "winner", matchNumber: 81 }, away: { kind: "winner", matchNumber: 82 } },
      { matchNumber: 95, home: { kind: "winner", matchNumber: 86 }, away: { kind: "winner", matchNumber: 88 } },
      { matchNumber: 96, home: { kind: "winner", matchNumber: 85 }, away: { kind: "winner", matchNumber: 87 } },
    ],
  },
  {
    round: "Quarter-finals",
    matches: [
      { matchNumber: 97, home: { kind: "winner", matchNumber: 89 }, away: { kind: "winner", matchNumber: 90 } },
      { matchNumber: 98, home: { kind: "winner", matchNumber: 93 }, away: { kind: "winner", matchNumber: 94 } },
      { matchNumber: 99, home: { kind: "winner", matchNumber: 91 }, away: { kind: "winner", matchNumber: 92 } },
      { matchNumber: 100, home: { kind: "winner", matchNumber: 95 }, away: { kind: "winner", matchNumber: 96 } },
    ],
  },
  {
    round: "Semi-finals",
    matches: [
      { matchNumber: 101, home: { kind: "winner", matchNumber: 97 }, away: { kind: "winner", matchNumber: 98 } },
      { matchNumber: 102, home: { kind: "winner", matchNumber: 99 }, away: { kind: "winner", matchNumber: 100 } },
    ],
  },
  {
    round: "Third place",
    matches: [
      { matchNumber: 103, home: { kind: "loser", matchNumber: 101 }, away: { kind: "loser", matchNumber: 102 } },
    ],
  },
  {
    round: "Final",
    matches: [
      { matchNumber: 104, home: { kind: "winner", matchNumber: 101 }, away: { kind: "winner", matchNumber: 102 } },
    ],
  },
];

/** @deprecated Use FIFA_ROUND_OF_32_TEMPLATES — kept for Group B report compatibility. */
export const GROUP_B_ROUND_OF_32_MATCHES = FIFA_ROUND_OF_32_TEMPLATES.filter(
  (match) =>
    match.home.kind !== "third-place" &&
    match.away.kind !== "third-place" &&
    (match.home.groupId === "b" ||
      match.away.groupId === "b" ||
      (match.home.kind === "group-runner-up" && match.home.groupId === "a")),
);

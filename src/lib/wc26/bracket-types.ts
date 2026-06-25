import type { Wc26GroupId } from "@/types/group";

export type BracketSlotRef =
  | { readonly kind: "group-winner"; readonly groupId: Wc26GroupId }
  | { readonly kind: "group-runner-up"; readonly groupId: Wc26GroupId }
  | {
      readonly kind: "third-place";
      readonly groups: readonly Wc26GroupId[];
      readonly label: string;
    };

export type BracketMatchTemplate = {
  readonly matchNumber: number;
  readonly round: string;
  readonly home: BracketSlotRef;
  readonly away: BracketSlotRef;
};

export type KnockoutFeedSlot =
  | { readonly kind: "winner"; readonly matchNumber: number }
  | { readonly kind: "loser"; readonly matchNumber: number };

export type KnockoutRoundTemplate = {
  readonly round: string;
  readonly matches: readonly {
    readonly matchNumber: number;
    readonly home: KnockoutFeedSlot;
    readonly away: KnockoutFeedSlot;
  }[];
};
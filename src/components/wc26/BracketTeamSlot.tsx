import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import type { ResolvedBracketSide } from "@/lib/wc26-standings";
import styles from "./wc26.module.css";

type BracketTeamSlotProps = {
  side: ResolvedBracketSide;
  isWinner?: boolean;
};

export default function BracketTeamSlot({ side, isWinner = false }: BracketTeamSlotProps) {
  if (side.teamId) {
    return (
      <div
        className={`${styles.bracketMatchSide} ${
          isWinner ? styles.bracketMatchSideWinner : ""
        }`}
      >
        <TeamFlag teamId={side.teamId} size={20} />
        <TeamLink teamId={side.teamId}>{side.label}</TeamLink>
      </div>
    );
  }

  return (
    <div
      className={`${styles.bracketMatchSide} ${styles.bracketMatchSidePending} ${
        isWinner ? styles.bracketMatchSideWinner : ""
      }`}
    >
      {side.label}
    </div>
  );
}
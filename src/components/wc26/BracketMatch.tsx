import type { ResolvedBracketMatch } from "@/lib/wc26-standings";
import BracketMatchKickoff from "@/components/wc26/BracketMatchKickoff";
import BracketTeamSlot from "@/components/wc26/BracketTeamSlot";
import styles from "./wc26.module.css";

type BracketMatchProps = {
  match: ResolvedBracketMatch;
};

export default function BracketMatch({ match }: BracketMatchProps) {
  const homeWinner = Boolean(
    match.winnerTeamId && match.home.teamId === match.winnerTeamId,
  );
  const awayWinner = Boolean(
    match.winnerTeamId && match.away.teamId === match.winnerTeamId,
  );

  return (
    <div className={styles.bracketMatchCard}>
      <div className={styles.bracketMatchMeta}>
        Match {match.matchNumber} · {match.round}
        {match.score ? <span className={styles.bracketMatchScore}>{match.score}</span> : null}
      </div>
      {match.kickoffUtc && match.venueId ? (
        <BracketMatchKickoff kickoffUtc={match.kickoffUtc} venueId={match.venueId} />
      ) : null}
      <div className={styles.bracketMatchTeams}>
        <BracketTeamSlot side={match.home} isWinner={homeWinner} />
        <div className={styles.bracketMatchVs}>vs</div>
        <BracketTeamSlot side={match.away} isWinner={awayWinner} />
      </div>
    </div>
  );
}
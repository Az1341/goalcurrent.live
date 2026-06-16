import type { GroupStandings } from "@/types/standing";
import { getTeamById } from "@/data/wc26";
import { isQualifyingStandingPosition } from "@/lib/wc26-standings";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import styles from "./wc26.module.css";

const STANDINGS_COLUMNS = [
  { key: "team", label: "Team", align: "left" as const },
  { key: "played", label: "P" },
  { key: "won", label: "W" },
  { key: "drawn", label: "D" },
  { key: "lost", label: "L" },
  { key: "goalsFor", label: "GF" },
  { key: "goalsAgainst", label: "GA" },
  { key: "goalDifference", label: "GD" },
  { key: "points", label: "Pts" },
];

type StandingsTableProps = {
  standings: GroupStandings;
  title?: string;
  qualifyingSpots?: number;
};

export default function StandingsTable({
  standings,
  title,
  qualifyingSpots = 0,
}: StandingsTableProps) {
  return (
    <div className={styles.standingsShell}>
      {title ? <div className={styles.standingsHead}>{title}</div> : null}
      <table className={styles.standingsTable}>
        <thead>
          <tr>
            {STANDINGS_COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={col.align === "left" ? styles.colTeam : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {standings.rows.map((row, index) => {
            const team = getTeamById(row.teamId);
            const qualified =
              qualifyingSpots > 0 &&
              isQualifyingStandingPosition(index, qualifyingSpots);

            return (
              <tr
                key={row.teamId}
                className={qualified ? styles.standingsRowQualified : undefined}
                aria-label={
                  qualified && team
                    ? `${team.name} — qualification zone`
                    : undefined
                }
              >
                <td className={styles.colTeam}>
                  <span className={styles.teamCell}>
                    {qualified ? (
                      <span className={styles.standingsQualBadge} aria-hidden="true">
                        Q
                      </span>
                    ) : null}
                    {team ? <TeamFlag teamId={team.id} size={22} /> : null}
                    {team ? (
                      <TeamLink teamId={team.id}>{team.name}</TeamLink>
                    ) : (
                      <span>{row.teamId}</span>
                    )}
                  </span>
                </td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalDifference}</td>
                <td>{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

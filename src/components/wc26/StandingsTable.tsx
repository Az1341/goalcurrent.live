import type { GroupStandings } from "@/types/standing";
import { getTeamById } from "@/data/wc26";
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
};

export default function StandingsTable({ standings, title }: StandingsTableProps) {
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
          {standings.rows.map((row) => {
            const team = getTeamById(row.teamId);

            return (
              <tr key={row.teamId}>
                <td className={styles.colTeam}>{team?.name ?? row.teamId}</td>
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

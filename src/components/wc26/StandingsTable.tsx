import type { GroupStandings } from "@/types/standing";
import { getTeamById } from "@/data/wc26";
import { isQualifyingStandingPosition } from "@/lib/wc26-standings";
import type { GroupFormResult } from "@/lib/wc26-group-hub";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import type { TeamId } from "@/types/team";
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
  { key: "points", label: "PTS" },
] as const;

type StandingsTableProps = {
  standings: GroupStandings;
  title?: string;
  qualifyingSpots?: number;
  formByTeamId?: ReadonlyMap<TeamId, readonly GroupFormResult[]>;
  groupComplete?: boolean;
};

function FormBadges({ form }: { form: readonly GroupFormResult[] }) {
  if (form.length === 0) {
    return <span className={styles.formEmpty}>—</span>;
  }

  return (
    <span className={styles.formBadges} aria-label={`Form: ${form.join(" ")}`}>
      {form.map((result, index) => (
        <span
          key={`${result}-${index}`}
          className={
            result === "W"
              ? styles.formWin
              : result === "D"
                ? styles.formDraw
                : styles.formLoss
          }
        >
          {result}
        </span>
      ))}
    </span>
  );
}

export default function StandingsTable({
  standings,
  title,
  qualifyingSpots = 0,
  formByTeamId,
  groupComplete = false,
}: StandingsTableProps) {
  const showForm = Boolean(formByTeamId);
  return (
    <div className={styles.standingsShell}>
      {title ? <div className={styles.standingsHead}>{title}</div> : null}
      <table className={`${styles.tableGroup} ${styles.standingsTable}`}>
        <thead>
          <tr>
            {STANDINGS_COLUMNS.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={
                  col.key === "team"
                    ? styles.colTeam
                    : col.key === "points"
                      ? styles.colPts
                      : undefined
                }
              >
                {col.label}
              </th>
            ))}
            {showForm ? (
              <th scope="col" className={styles.colForm}>
                Form
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {standings.rows.map((row, index) => {
            const team = getTeamById(row.teamId);
            const qualified =
              qualifyingSpots > 0 &&
              isQualifyingStandingPosition(index, qualifyingSpots);
            const eliminated =
              groupComplete &&
              qualifyingSpots > 0 &&
              !qualified;

            return (
              <tr
                key={row.teamId}
                className={
                  groupComplete && qualified
                    ? styles.standingsRowQualified
                    : groupComplete && eliminated
                      ? styles.standingsRowEliminated
                      : undefined
                }
                aria-label={
                  qualified && team
                    ? `${team.name} — qualification zone`
                    : undefined
                }
              >
                <td className={styles.colTeam}>
                  <span className={styles.teamCell}>
                    {team ? <TeamFlag teamId={team.id} size={22} /> : null}
                    {team ? (
                      <TeamLink teamId={team.id}>{team.name}</TeamLink>
                    ) : (
                      <span>{row.teamId}</span>
                    )}
                    {groupComplete && qualified ? (
                      <span className={styles.standingsQualAfter}>[Qualified]</span>
                    ) : null}
                    {eliminated ? (
                      <span className={styles.standingsEliminated}>[Eliminated]</span>
                    ) : null}
                  </span>
                </td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalsFor}</td>
                <td>{row.goalsAgainst}</td>
                <td>{row.goalDifference}</td>
                <td className={styles.colPts}>{row.points}</td>
                {showForm ? (
                  <td className={styles.colForm}>
                    <FormBadges form={formByTeamId?.get(row.teamId) ?? []} />
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

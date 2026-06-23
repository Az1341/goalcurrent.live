"use client";

import Link from "next/link";
import { getTeamById } from "@/data/wc26";
import TeamFlag from "@/components/TeamFlag";
import { useWc26Standings } from "@/lib/use-wc26-standings";
import { groupHref } from "@/lib/wc26-groups";
import type { Wc26GroupId } from "@/types/group";
import wc26Styles from "@/components/wc26/wc26.module.css";
import styles from "@/app/page.module.css";

const PREVIEW_GROUPS: readonly Wc26GroupId[] = ["a", "b", "c", "d"];

export default function HomeWc26StandingsPreview() {
  const allStandings = useWc26Standings();

  return (
    <section className={styles.sectionBlock} aria-labelledby="wc-standings-preview">
      <div className={styles.sectionHeader}>
        <div className={styles.sectionTitleRow}>
          <span className={styles.sectionBar} aria-hidden="true" />
          <h2 id="wc-standings-preview" className={styles.sectionTitle}>
            World Cup Standings Preview
          </h2>
        </div>
        <Link href="/worldcup2026" className={styles.sectionLink}>
          WC26 Hub →
        </Link>
      </div>

      <div className={styles.wcStandingsGrid}>
        {PREVIEW_GROUPS.map((groupId) => {
          const table = allStandings.find((g) => g.groupId === groupId);
          if (!table) return null;

          return (
            <div key={groupId} className={styles.wcGroupMini}>
              <Link href={groupHref(groupId)} className={wc26Styles.standingsHead}>
                Group {groupId.toUpperCase()}
              </Link>
              <table className={styles.wcGroupMiniTable}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col" className={styles.wcGroupMiniTeamCol}>
                      Team
                    </th>
                    <th scope="col">Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, index) => {
                    const team = getTeamById(row.teamId);
                    return (
                      <tr key={row.teamId}>
                        <td>{index + 1}</td>
                        <td>
                          <span className={styles.wcGroupMiniTeam}>
                            {team ? <TeamFlag teamId={team.id} size={16} /> : null}
                            <span>{team?.name ?? row.teamId}</span>
                          </span>
                        </td>
                        <td className={styles.wcGroupMiniPts}>{row.points}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <Link href="/worldcup2026/standings" className={styles.wcStandingsFullLink}>
        View Full World Cup Standings →
      </Link>
    </section>
  );
}

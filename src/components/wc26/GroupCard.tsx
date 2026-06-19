import Link from "next/link";
import { getTeamsByGroup, groupLabel, type Wc26GroupId } from "@/data/wc26";
import { groupHref } from "@/lib/wc26-groups";
import { teamHref } from "@/lib/wc26-teams";
import TeamFlag from "@/components/TeamFlag";
import styles from "./wc26.module.css";

type GroupCardProps = {
  groupId: Wc26GroupId;
};

export default function GroupCard({ groupId }: GroupCardProps) {
  const teams = getTeamsByGroup(groupId);

  return (
    <article className={styles.groupCard}>
      <Link href={groupHref(groupId)} className={styles.groupCardLetter}>
        {groupLabel(groupId)}
      </Link>
      <ul className={styles.groupCardTeams}>
        {teams.map((team) => (
          <li key={team.id} className={styles.groupCardTeamItem}>
            <div className={styles.groupCardTeamRow}>
              <TeamFlag teamId={team.id} size={22} />
              <span>{team.name}</span>
            </div>
            <Link
              href={teamHref(team.id)}
              className={styles.groupCardTeamProfile}
              aria-label={`View ${team.name} team profile`}
            >
              View profile
            </Link>
          </li>
        ))}
      </ul>
      <Link href={groupHref(groupId)} className={styles.groupCardSub}>
        View group page →
      </Link>
    </article>
  );
}

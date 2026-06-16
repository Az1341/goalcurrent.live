import Link from "next/link";
import { getTeamsByGroup, groupLabel, type Wc26GroupId } from "@/data/wc26";
import { groupHref } from "@/lib/wc26-groups";
import TeamFlag from "@/components/TeamFlag";
import styles from "./wc26.module.css";

type GroupCardProps = {
  groupId: Wc26GroupId;
};

export default function GroupCard({ groupId }: GroupCardProps) {
  const teams = getTeamsByGroup(groupId);

  return (
    <Link href={groupHref(groupId)} className={styles.groupCard}>
      <div className={styles.groupCardLetter}>{groupLabel(groupId)}</div>
      <ul className={styles.groupCardTeams}>
        {teams.map((team) => (
          <li key={team.id} className={styles.groupCardTeamRow}>
            <TeamFlag teamId={team.id} size={22} />
            <span>{team.name}</span>
          </li>
        ))}
      </ul>
      <div className={styles.groupCardSub}>View group page →</div>
    </Link>
  );
}

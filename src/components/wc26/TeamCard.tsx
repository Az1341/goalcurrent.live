import TeamFlag from "@/components/TeamFlag";
import type { Team } from "@/types/team";
import { groupHref, groupLabel } from "@/lib/wc26-groups";
import Link from "next/link";
import styles from "./wc26.module.css";

type TeamCardProps = {
  team: Team;
};

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className={styles.tileCard}>
      <TeamFlag teamId={team.id} size={36} />
      <div className={styles.tileLabel}>{team.name}</div>      <div className={styles.tileCode}>{team.code}</div>
      <Link href={groupHref(team.groupId)} className={styles.tileGroupLink}>
        {groupLabel(team.groupId)}
      </Link>
    </div>
  );
}

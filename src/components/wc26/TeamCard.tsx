"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteTeamButton } from "@/components/FavouriteButton";
import type { Team } from "@/types/team";
import { groupHref, groupLabel } from "@/lib/wc26-groups";
import { teamHref } from "@/lib/wc26-teams";
import styles from "./wc26.module.css";

type TeamCardProps = {
  team: Team;
};

export default function TeamCard({ team }: TeamCardProps) {
  return (
    <div className={styles.tileCard}>
      <div className={styles.tileCardTop}>
        <Link href={teamHref(team.id)} className={styles.tileFlagLink}>
          <TeamFlag teamId={team.id} size={36} />
        </Link>
        <FavouriteTeamButton teamId={team.id} teamName={team.name} />
      </div>
      <Link href={teamHref(team.id)} className={styles.tileLabelLink}>
        <div className={styles.tileLabel}>{team.name}</div>
        <div className={styles.tileCode}>{team.code}</div>
      </Link>
      <Link href={groupHref(team.groupId)} className={styles.tileGroupLink}>
        {groupLabel(team.groupId)}
      </Link>
    </div>
  );
}

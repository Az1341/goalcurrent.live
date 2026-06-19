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
        <Link href={teamHref(team.id)} className={styles.tileFlagLink} aria-label={`View ${team.name} team profile`}>
          <TeamFlag teamId={team.id} size={36} />
        </Link>
        <FavouriteTeamButton teamId={team.id} teamName={team.name} />
      </div>
      <Link
        href={teamHref(team.id)}
        className={styles.tileLabelLink}
        aria-label={`View ${team.name} team profile`}
      >
        <div className={styles.tileLabel}>{team.name}</div>
        <div className={styles.tileCode}>{team.code}</div>
        <div className={styles.tileProfileHint}>View team profile</div>
      </Link>
      <Link href={groupHref(team.groupId)} className={styles.tileGroupLink} aria-label={`View ${groupLabel(team.groupId)}`}>
        {groupLabel(team.groupId)}
      </Link>
    </div>
  );
}

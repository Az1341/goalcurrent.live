"use client";

import Image from "next/image";
import { useState } from "react";
import { shouldUseUnoptimizedImage } from "@/lib/images";
import type { MatchLineupPlayer } from "@/types/match-detail";
import styles from "./wc26.module.css";

function playerSurname(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

function PlayerChip({ player }: { player: MatchLineupPlayer }) {
  const [failed, setFailed] = useState(false);
  const initial = playerSurname(player.name).charAt(0).toUpperCase() || "?";
  const showPhoto = Boolean(player.photo) && !failed;

  return (
    <div className={styles.playerChip} title={player.name}>
      <div className={styles.playerChipAvatar}>
        {showPhoto ? (
          <Image
            src={player.photo!}
            alt={player.name}
            width={40}
            height={40}
            className={styles.playerChipPhoto}
            unoptimized={shouldUseUnoptimizedImage(player.photo!)}
            onError={() => setFailed(true)}
          />
        ) : (
          <span className={styles.playerChipInitial}>{initial}</span>
        )}
        <span className={styles.playerChipNumber}>{player.number ?? "–"}</span>
        {player.is_captain ? (
          <span className={styles.playerChipCaptain} aria-label="Captain">
            C
          </span>
        ) : null}
      </div>
      <span className={styles.playerChipName}>{playerSurname(player.name)}</span>
    </div>
  );
}

type PlayerRowProps = {
  label: string;
  players: readonly MatchLineupPlayer[];
};

/** Horizontal scroll row of starting XI chips with photo, number, and captain badge. */
export default function PlayerRow({ label, players }: PlayerRowProps) {
  if (players.length === 0) {
    return null;
  }

  return (
    <div className={styles.playerRow}>
      <p className={styles.playerRowLabel}>{label}</p>
      <div className={styles.playerRowTrack} role="list" aria-label={label}>
        {players.map((player) => (
          <div key={`${player.number ?? "na"}-${player.name}`} role="listitem">
            <PlayerChip player={player} />
          </div>
        ))}
      </div>
    </div>
  );
}

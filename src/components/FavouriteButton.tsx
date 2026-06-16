"use client";

import {
  isMatchFavourited,
  isTeamFavourited,
  toggleFavouriteMatch,
  toggleFavouriteTeam,
} from "@/lib/favourites";
import { useFavourites } from "@/lib/use-favourites";
import styles from "@/components/wc26/wc26.module.css";

type FavouriteTeamButtonProps = {
  teamId: string;
  teamName: string;
  className?: string;
};

type FavouriteMatchButtonProps = {
  matchId: string;
  label: string;
  className?: string;
};

export function FavouriteTeamButton({
  teamId,
  teamName,
  className,
}: FavouriteTeamButtonProps) {
  useFavourites();
  const active = isTeamFavourited(teamId);

  return (
    <button
      type="button"
      className={`${styles.favBtn} ${active ? styles.favBtnActive : ""} ${className ?? ""}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${teamName} from favourites` : `Add ${teamName} to favourites`}
      title={active ? "Remove from favourites" : "Add to favourites"}
      onClick={() => toggleFavouriteTeam(teamId)}
    >
      {active ? "★" : "☆"}
    </button>
  );
}

export function FavouriteMatchButton({
  matchId,
  label,
  className,
}: FavouriteMatchButtonProps) {
  useFavourites();
  const active = isMatchFavourited(matchId);

  return (
    <button
      type="button"
      className={`${styles.favBtn} ${active ? styles.favBtnActive : ""} ${className ?? ""}`}
      aria-pressed={active}
      aria-label={active ? `Remove ${label} from favourites` : `Add ${label} to favourites`}
      title={active ? "Remove from favourites" : "Add to favourites"}
      onClick={() => toggleFavouriteMatch(matchId)}
    >
      {active ? "★" : "☆"}
    </button>
  );
}

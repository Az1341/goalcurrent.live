"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getFixtureById, getTeamById, groupLabel } from "@/data/wc26";
import { FAVOURITES_HREF } from "@/lib/nav";
import { useFavourites } from "@/lib/use-favourites";
import { formatVisitorKickoff } from "@/lib/wc26-format";
import { matchHref } from "@/lib/wc26-match";
import { teamHref } from "@/lib/wc26-teams";
import styles from "@/app/page.module.css";

const MAX_MATCHES = 4;
const MAX_TEAMS = 4;

export default function HomeFavouritesStrip() {
  const [mounted, setMounted] = useState(false);
  const { teams, matches } = useFavourites();

  useEffect(() => {
    setMounted(true);
  }, []);

  const favouriteMatches = useMemo(
    () =>
      matches
        .map((matchId) => {
          const fixture = getFixtureById(matchId);
          if (!fixture) {
            return null;
          }
          const home = getTeamById(fixture.homeTeamId);
          const away = getTeamById(fixture.awayTeamId);
          return {
            matchId,
            home,
            away,
            kickoff: formatVisitorKickoff(fixture.kickoffUtc),
          };
        })
        .filter((item): item is NonNullable<typeof item> => item != null)
        .slice(0, MAX_MATCHES),
    [matches],
  );

  const favouriteTeams = useMemo(
    () =>
      teams
        .map((teamId) => getTeamById(teamId))
        .filter((team): team is NonNullable<typeof team> => team != null)
        .slice(0, MAX_TEAMS),
    [teams],
  );

  const hasAny = favouriteMatches.length > 0 || favouriteTeams.length > 0;
  const showFavourites = mounted && hasAny;

  return (
    <section className={styles.favouritesStrip} aria-labelledby="home-favourites-heading">
      <div className={styles.favouritesStripHead}>
        <h2 id="home-favourites-heading" className={styles.favouritesStripTitle}>
          Your Favourites
        </h2>
        <Link href={FAVOURITES_HREF} className={styles.favouritesStripLink}>
          Manage →
        </Link>
      </div>

      {!showFavourites ? (
        <p className={styles.favouritesEmpty}>
          Star a match or team to see them here. Browse{" "}
          <Link href="/live">live scores</Link> or{" "}
          <Link href="/worldcup2026/teams">World Cup teams</Link>.
        </p>
      ) : (
        <ul className={styles.favouritesList}>
          {favouriteMatches.map(({ matchId, home, away, kickoff }) => (
            <li key={`match-${matchId}`}>
              <Link href={matchHref(matchId)} className={styles.favouritesChip}>
                {home ? <TeamFlag teamId={home.id} size={20} /> : null}
                <span className={styles.favouritesChipLabel}>
                  {home?.name ?? "TBD"} vs {away?.name ?? "TBD"}
                </span>
                <span className={styles.favouritesChipMeta}>{kickoff}</span>
              </Link>
            </li>
          ))}
          {favouriteTeams.map((team) => (
            <li key={`team-${team.id}`}>
              <Link href={teamHref(team.id)} className={styles.favouritesChip}>
                <TeamFlag teamId={team.id} size={20} />
                <span className={styles.favouritesChipLabel}>{team.name}</span>
                <span className={styles.favouritesChipMeta}>{groupLabel(team.groupId)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import TeamFlag from "@/components/TeamFlag";
import { getFixtureById, getTeamById, groupLabel } from "@/data/wc26";
import { resolveFixtureParticipant } from "@/lib/wc26-live";
import { FAVOURITES_HREF } from "@/lib/nav";
import { useFavourites } from "@/lib/use-favourites";
import { useIsClient } from "@/lib/use-is-client";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { LocalizedKickoffLabel } from "@/components/match/LocalizedKickoff";
import { matchHref } from "@/lib/wc26-match";
import { teamHref } from "@/lib/wc26-teams";
import styles from "@/app/[locale]/page.module.css";
const MAX_MATCHES = 4;
const MAX_TEAMS = 4;

export default function HomeFavouritesStrip() {
  const t = useTranslations("favourites");
  const mounted = useIsClient();
  const { teams, matches } = useFavourites();
  const effectiveFixtures = useEffectiveFixtures();

  const favouriteMatches = useMemo(
    () =>
      matches
        .map((matchId) => {
          const fixture = getFixtureById(matchId);
          if (!fixture) {
            return null;
          }
          const effective =
            effectiveFixtures.find((entry) => entry.id === matchId) ?? fixture;
          const home = resolveFixtureParticipant(effective, "home", effectiveFixtures);
          const away = resolveFixtureParticipant(effective, "away", effectiveFixtures);
          return {
            matchId,
            home,
            away,
            kickoffUtc: effective.kickoffUtc,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item != null)
        .slice(0, MAX_MATCHES),
    [effectiveFixtures, matches],
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
          {t("stripTitle")}
        </h2>
        <Link href={FAVOURITES_HREF} className={styles.favouritesStripLink}>
          {t("manage")} →
        </Link>
      </div>

      {!showFavourites ? (
        <p className={styles.favouritesEmpty}>
          {t("emptyStripLead")}{" "}
          <Link href="/live">{t("liveScores")}</Link> {t("or")}{" "}
          <Link href="/worldcup2026/teams">{t("worldCupTeams")}</Link>.
        </p>      ) : (
        <ul className={styles.favouritesList}>
          {favouriteMatches.map(({ matchId, home, away, kickoffUtc }) => (
            <li key={`match-${matchId}`}>
              <Link href={matchHref(matchId)} className={styles.favouritesChip}>
                <TeamFlag teamId={home.teamId} teamName={home.label} size={20} />
                <span className={styles.favouritesChipLabel}>
                  {home.label} vs {away.label}
                </span>
                <span className={styles.favouritesChipMeta}>
                  <LocalizedKickoffLabel iso={kickoffUtc} />
                </span>
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

"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import {
  demoMatchId,
  isDemoMatchId,
  removeFavouriteCompetition,
  removeFavouriteMatch,
  removeFavouriteTeam,
} from "@/lib/favourites";
import { useFavourites } from "@/lib/use-favourites";
import { formatKickoffUtc } from "@/lib/wc26-format";
import { PLACEHOLDER_MATCHES } from "@/data/placeholder-matches";
import {
  getFixtureById,
  getTeamById,
  groupLabel,
} from "@/data/wc26";
import layoutStyles from "@/components/layout/layout.module.css";
import styles from "@/components/wc26/wc26.module.css";

const COMPETITION_LABELS: Record<string, string> = {
  wc26: "FIFA World Cup 2026",
};

export default function FavouritesPageContent() {
  const { teams, matches, competitions } = useFavourites();
  const hasAny =
    teams.length > 0 || matches.length > 0 || competitions.length > 0;

  return (
    <main className={layoutStyles.content}>
      <h1 className={styles.pageTitle}>Favourites</h1>
      <p className={styles.pageIntro}>
        Your saved teams, matches and competitions across GoalCurrent.online.
      </p>

      {!hasAny ? (
        <div className={styles.favEmpty}>
          <h2>No favourites saved yet</h2>
          <p>
            Star a team on the{" "}
            <Link href="/worldcup2026/teams">Teams page</Link>, a fixture on{" "}
            <Link href="/worldcup2026/fixtures">Fixtures</Link>, or a match on
            the homepage.
          </p>
        </div>
      ) : null}

      <section aria-labelledby="fav-teams-heading">
        <h2 id="fav-teams-heading" className={styles.sectionTitle}>
          Favourite teams
        </h2>
        {teams.length === 0 ? (
          <p className={styles.favSectionEmpty}>No teams saved yet.</p>
        ) : (
          <ul className={styles.favList}>
            {teams.map((teamId) => {
              const team = getTeamById(teamId);
              if (!team) {
                return null;
              }
              return (
                <li key={teamId} className={styles.favListItem}>
                  <TeamFlag teamId={team.id} size={24} />
                  <span className={styles.favListLabel}>{team.name}</span>
                  <span className={styles.favListMeta}>
                    {groupLabel(team.groupId)}
                  </span>
                  <button
                    type="button"
                    className={styles.favRemoveBtn}
                    onClick={() => removeFavouriteTeam(teamId)}
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="fav-matches-heading">
        <h2 id="fav-matches-heading" className={styles.sectionTitle}>
          Favourite matches
        </h2>
        {matches.length === 0 ? (
          <p className={styles.favSectionEmpty}>No matches saved yet.</p>
        ) : (
          <ul className={styles.favList}>
            {matches.map((matchId) => {
              const wc26Fixture = getFixtureById(matchId);
              if (wc26Fixture) {
                const home = getTeamById(wc26Fixture.homeTeamId);
                const away = getTeamById(wc26Fixture.awayTeamId);
                const label = `${home?.name ?? wc26Fixture.homeTeamId} vs ${away?.name ?? wc26Fixture.awayTeamId}`;
                return (
                  <li key={matchId} className={styles.favListItem}>
                    {home ? <TeamFlag teamId={home.id} size={24} /> : null}
                    <span className={styles.favListVs}>vs</span>
                    {away ? <TeamFlag teamId={away.id} size={24} /> : null}
                    <span className={styles.favListLabel}>{label}</span>
                    <span className={styles.favListMeta}>
                      {formatKickoffUtc(wc26Fixture.kickoffUtc)} UTC
                    </span>
                    <button
                      type="button"
                      className={styles.favRemoveBtn}
                      onClick={() => removeFavouriteMatch(matchId)}
                    >
                      Remove
                    </button>
                  </li>
                );
              }

              if (isDemoMatchId(matchId)) {
                const demoId = Number.parseInt(matchId.slice(5), 10);
                const demo = PLACEHOLDER_MATCHES.find((m) => m.id === demoId);
                if (!demo) {
                  return null;
                }
                return (
                  <li key={matchId} className={styles.favListItem}>
                    <TeamFlag teamName={demo.home} size={24} />
                    <span className={styles.favListVs}>vs</span>
                    <TeamFlag teamName={demo.away} size={24} />
                    <span className={styles.favListLabel}>
                      {demo.home} vs {demo.away}
                    </span>
                    <span className={styles.favListMeta}>{demo.round}</span>
                    <button
                      type="button"
                      className={styles.favRemoveBtn}
                      onClick={() => removeFavouriteMatch(matchId)}
                    >
                      Remove
                    </button>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        )}
      </section>

      <section aria-labelledby="fav-competitions-heading">
        <h2 id="fav-competitions-heading" className={styles.sectionTitle}>
          Favourite competitions
        </h2>
        {competitions.length === 0 ? (
          <p className={styles.favSectionEmpty}>No competitions saved yet.</p>
        ) : (
          <ul className={styles.favList}>
            {competitions.map((competitionId) => (
              <li key={competitionId} className={styles.favListItem}>
                <span className={styles.favListLabel}>
                  {COMPETITION_LABELS[competitionId] ?? competitionId}
                </span>
                <button
                  type="button"
                  className={styles.favRemoveBtn}
                  onClick={() => removeFavouriteCompetition(competitionId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className={styles.hubBack}>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import {
  removeFavouriteCompetition,
  removeFavouriteMatch,
  removeFavouriteTeam,
} from "@/lib/favourites";
import { useFavourites } from "@/lib/use-favourites";
import { formatVisitorKickoff } from "@/lib/wc26-format";
import { matchHref } from "@/lib/wc26-match";
import { teamHref } from "@/lib/wc26-teams";
import {
  getFixtureById,
  getTeamById,
  groupLabel,
} from "@/data/wc26";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import { SITE_NAME } from "@/lib/site-url";
import layoutStyles from "@/components/layout/layout.module.css";
import styles from "@/components/wc26/wc26.module.css";

const COMPETITION_LABELS: Record<string, string> = {
  wc26: "FIFA World Cup 2026",
};

export default function FavouritesPageContent() {
  const { teams, matches, competitions } = useFavourites();
  const { tvRegion } = useWc26TvRegion();
  const hasAny =
    teams.length > 0 || matches.length > 0 || competitions.length > 0;

  return (
    <main className={layoutStyles.content}>
      <h1 className={styles.pageTitle}>Favourites</h1>
      <p className={styles.pageIntro}>
        Your saved teams, matches and competitions across {SITE_NAME}.
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
                  <Link href={teamHref(team.id)} className={styles.favListMain}>
                    <TeamFlag teamId={team.id} size={24} />
                    <span className={styles.favListLabel}>{team.name}</span>
                    <span className={styles.favListMeta}>
                      {groupLabel(team.groupId)}
                    </span>
                  </Link>
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
                  <li key={matchId} style={{ listStyle: "none", marginBottom: 10 }}>
                    <div style={{
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 12,
                      overflow: "hidden",
                    }}>
                      {/* Match teams row */}
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        padding: "14px 16px 10px",
                        gap: 8,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
                          {home ? <TeamFlag teamId={home.id} size={28} /> : null}
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{home?.name ?? "Home"}</span>
                        </div>
                        <div style={{ textAlign: "center", minWidth: 60 }}>
                          <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>vs</div>
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                            {formatVisitorKickoff(wc26Fixture.kickoffUtc)}
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-start" }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: "#0f172a" }}>{away?.name ?? "Away"}</span>
                          {away ? <TeamFlag teamId={away.id} size={28} /> : null}
                        </div>
                      </div>
                      {/* TV broadcast */}
                      <div style={{ padding: "0 16px 4px", fontSize: 12, color: "#64748b" }}>
                        <MatchTvBroadcast
                          tvRegion={tvRegion}
                          matchNumber={wc26Fixture.matchNumber}
                          variant="chips"
                          className={styles.favListTv}
                        />
                      </div>
                      {/* Actions */}
                      <div style={{
                        display: "flex",
                        gap: 8,
                        padding: "10px 16px 12px",
                        borderTop: "1px solid #f1f5f9",
                      }}>
                        <Link href={matchHref(matchId)} style={{
                          flex: 1,
                          padding: "8px 12px",
                          background: "#7B0D1E",
                          color: "#fff",
                          borderRadius: 8,
                          textDecoration: "none",
                          fontWeight: 700,
                          fontSize: 13,
                          textAlign: "center",
                        }}>
                          ⚽ Match Details & Live Score
                        </Link>
                        <button
                          type="button"
                          style={{
                            padding: "8px 12px",
                            background: "transparent",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            fontSize: 12,
                            color: "#64748b",
                            cursor: "pointer",
                          }}
                          onClick={() => removeFavouriteMatch(matchId)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={matchId} className={styles.favListItem}>
                  <span className={styles.favListLabel}>Saved match ({matchId})</span>
                  <span className={styles.favListMeta}>No longer available</span>
                  <button
                    type="button"
                    className={styles.favRemoveBtn}
                    onClick={() => removeFavouriteMatch(matchId)}
                  >
                    Remove
                  </button>
                </li>
              );
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

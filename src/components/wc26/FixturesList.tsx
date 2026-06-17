"use client";

import type { Fixture } from "@/types/fixture";
import { getTeamById, getVenueById } from "@/data/wc26";
import { formatVisitorKickoff } from "@/lib/wc26-format";
import { useWc26TvRegion } from "@/lib/use-wc26-tv-region";
import TeamFlag from "@/components/TeamFlag";
import MatchDetailLink from "@/components/match/MatchDetailLink";
import MatchTvBroadcast from "@/components/wc26/MatchTvBroadcast";
import TeamLink from "@/components/wc26/TeamLink";
import { FavouriteMatchButton } from "@/components/FavouriteButton";
import styles from "./wc26.module.css";

type FixturesListProps = {
  fixtures: readonly Fixture[];
};

export default function FixturesList({ fixtures }: FixturesListProps) {
  const { tvRegion } = useWc26TvRegion();

  if (fixtures.length === 0) {
    return (
      <p className={styles.standingsEmpty}>No fixtures scheduled for this section.</p>
    );
  }

  return (
    <ul className={styles.fixtureList}>
      {fixtures.map((fixture) => {
        const home = getTeamById(fixture.homeTeamId);
        const away = getTeamById(fixture.awayTeamId);
        const venue = getVenueById(fixture.venueId);
        const label = `${home?.name ?? fixture.homeTeamId} vs ${away?.name ?? fixture.awayTeamId}`;

        return (
          <li key={fixture.id} className={styles.fixtureRow}>
            <div className={styles.fixtureMeta}>
              <span className={styles.fixtureStage}>
                {fixture.matchday
                  ? `Matchday ${fixture.matchday}`
                  : fixture.stage.replace(/-/g, " ")}
              </span>
              <span className={styles.fixtureKickoff}>
                {formatVisitorKickoff(fixture.kickoffUtc)}
              </span>
              <FavouriteMatchButton matchId={fixture.id} label={label} />
              <MatchDetailLink fixtureId={fixture.id} className={styles.fixDetailLink} />
            </div>
            <div className={styles.fixtureMatchup}>
              <span className={styles.fixtureTeam}>
                {home ? <TeamFlag teamId={home.id} size={24} /> : null}
                <TeamLink teamId={fixture.homeTeamId}>{home?.name ?? fixture.homeTeamId}</TeamLink>
              </span>
              <span className={styles.fixtureVs}>vs</span>
              <span className={styles.fixtureTeam}>
                {away ? <TeamFlag teamId={away.id} size={24} /> : null}
                <TeamLink teamId={fixture.awayTeamId}>{away?.name ?? fixture.awayTeamId}</TeamLink>
              </span>
            </div>
            {venue ? (
              <div className={styles.fixtureVenue}>
                🏟 {venue.name}, {venue.city}
              </div>
            ) : null}
            <div className={styles.fixtureTvRow}>
              <MatchTvBroadcast tvRegion={tvRegion} variant="chips" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

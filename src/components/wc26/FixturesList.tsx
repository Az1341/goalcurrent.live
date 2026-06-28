"use client";

import type { Fixture } from "@/types/fixture";
import { getVenueById } from "@/data/wc26";
import { LocalizedKickoffLabel } from "@/components/match/LocalizedKickoff";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { resolveFixtureParticipant } from "@/lib/wc26-live";
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
  const effectiveFixtures = useEffectiveFixtures();

  if (fixtures.length === 0) {
    return (
      <p className={styles.standingsEmpty}>No fixtures scheduled for this section.</p>
    );
  }

  return (
    <ul className={styles.fixtureList}>
      {fixtures.map((fixture) => {
        const home = resolveFixtureParticipant(
          fixture,
          "home",
          effectiveFixtures,
        );
        const away = resolveFixtureParticipant(
          fixture,
          "away",
          effectiveFixtures,
        );
        const venue = getVenueById(fixture.venueId);
        const label = `${home.label} vs ${away.label}`;

        return (
          <li key={fixture.id} className={styles.fixtureRow}>
            <div className={styles.fixtureMeta}>
              <span className={styles.fixtureStage}>
                {fixture.matchday
                  ? `Matchday ${fixture.matchday}`
                  : fixture.stage.replace(/-/g, " ")}
              </span>
              <span className={styles.fixtureKickoff}>
                <LocalizedKickoffLabel iso={fixture.kickoffUtc} />
              </span>
              <FavouriteMatchButton matchId={fixture.id} label={label} />
              <MatchDetailLink fixtureId={fixture.id} className={styles.fixDetailLink} />
            </div>
            <div className={styles.fixtureMatchup}>
              <span className={styles.fixtureTeam}>
                <TeamFlag teamId={home.teamId} teamName={home.label} size={24} />
                <TeamLink teamId={home.teamId}>{home.label}</TeamLink>
              </span>
              <span className={styles.fixtureVs}>vs</span>
              <span className={styles.fixtureTeam}>
                <TeamFlag teamId={away.teamId} teamName={away.label} size={24} />
                <TeamLink teamId={away.teamId}>{away.label}</TeamLink>
              </span>
            </div>
            {venue ? (
              <div className={styles.fixtureVenue}>
                🏟 {venue.name}, {venue.city}
              </div>
            ) : null}
            <div className={styles.fixtureTvRow}>
              <MatchTvBroadcast tvRegion={tvRegion} matchNumber={fixture.matchNumber} variant="chips" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

import type { Fixture } from "@/types/fixture";
import { getTeamById, getVenueById } from "@/data/wc26";
import { formatKickoffUtc } from "@/lib/wc26-format";
import styles from "./wc26.module.css";

type FixturesListProps = {
  fixtures: readonly Fixture[];
};

export default function FixturesList({ fixtures }: FixturesListProps) {
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

        return (
          <li key={fixture.id} className={styles.fixtureRow}>
            <div className={styles.fixtureMeta}>
              <span className={styles.fixtureStage}>
                {fixture.matchday
                  ? `Matchday ${fixture.matchday}`
                  : fixture.stage.replace(/-/g, " ")}
              </span>
              <span className={styles.fixtureKickoff}>
                {formatKickoffUtc(fixture.kickoffUtc)} UTC
              </span>
            </div>
            <div className={styles.fixtureMatchup}>
              <span>{home?.name ?? fixture.homeTeamId}</span>
              <span className={styles.fixtureVs}>vs</span>
              <span>{away?.name ?? fixture.awayTeamId}</span>
            </div>
            {venue ? (
              <div className={styles.fixtureVenue}>
                🏟 {venue.name}, {venue.city}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

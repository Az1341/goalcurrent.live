import Link from "next/link";
import { getTeamById, groupLabel, type Wc26GroupId } from "@/data/wc26";
import type { Fixture } from "@/types/fixture";
import {
  formatFixtureNavLabel,
  getAdjacentFixtures,
  getSameGroupFixtures,
  matchHref,
} from "@/lib/wc26-match";
import { groupHref } from "@/lib/wc26-groups";
import styles from "./match.module.css";

type MatchRelatedLinksProps = {
  fixtureId: string;
  groupId?: Wc26GroupId | null;
};
function navMatchLabel(fixture: Fixture): string {
  return formatFixtureNavLabel(fixture);
}

export default function MatchRelatedLinks({
  fixtureId,
  groupId,
}: MatchRelatedLinksProps) {
  const { previous, next } = getAdjacentFixtures(fixtureId);
  const sameGroup = groupId ? getSameGroupFixtures(fixtureId) : [];

  return (
    <section className={styles.relatedSection} aria-labelledby="match-related-heading">
      <h2 id="match-related-heading" className={styles.relatedTitle}>
        Related
      </h2>

      <nav className={styles.matchNav} aria-label="Previous and next match">
        {previous ? (
          <Link href={matchHref(previous.id)} className={styles.matchNavLink}>
            ← {navMatchLabel(previous)}
          </Link>
        ) : (
          <span className={styles.matchNavSpacer} />
        )}
        {next ? (
          <Link href={matchHref(next.id)} className={styles.matchNavLink}>
            {navMatchLabel(next)} →
          </Link>
        ) : (
          <span className={styles.matchNavSpacer} />
        )}
      </nav>

      {groupId ? (
        <p className={styles.groupQuickLink}>
          <Link href={groupHref(groupId)} className={styles.entityLink}>
            {groupLabel(groupId)} hub →
          </Link>
        </p>
      ) : null}

      {sameGroup.length > 0 ? (
        <div className={styles.sameGroupBlock}>
          <h3 className={styles.sameGroupTitle}>Other matches in this group</h3>
          <ul className={styles.sameGroupList}>
            {sameGroup.map((fixture) => {
              const home = getTeamById(fixture.homeTeamId);
              const away = getTeamById(fixture.awayTeamId);
              return (
                <li key={fixture.id}>
                  <Link href={matchHref(fixture.id)} className={styles.sameGroupLink}>
                    {home?.name ?? fixture.homeTeamId} vs{" "}
                    {away?.name ?? fixture.awayTeamId}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

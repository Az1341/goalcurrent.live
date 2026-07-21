import { Link } from "@/i18n/navigation";
import styles from "../home-v5.module.css";

const ARTICLE_HREF = "/articles/spain-world-cup-2026-champion-masterclass";
const MATCH_HREF = "/match/fixture-104";
const TROPHY = "\u{1F3C6}";

/**
 * Homepage champion news snippet — pinned announcement under the live ticker.
 * Facts: Spain 1-0 Argentina, Match 104 / fixture-104, New York/New Jersey Stadium.
 */
export default function HomeChampionSnippet() {
  return (
    <section
      className={styles.championSnippet}
      aria-labelledby="home-champion-snippet-heading"
    >
      <p className={styles.championSnippetEyebrow}>Breaking · World Cup Final</p>
      <h2 id="home-champion-snippet-heading" className={styles.championSnippetTitle}>
        <span aria-hidden="true">{TROPHY} </span>
        Spain Crowned World Cup 2026 Champion
      </h2>
      <p className={styles.championSnippetBody}>
        Spain claimed their second World Cup title with a commanding 1-0 victory over Argentina in
        the final at New York/New Jersey Stadium. The Spanish side delivered a composed, tactical
        masterclass to lift the trophy, cementing their status as one of the tournament&apos;s
        dominant forces. Argentina, defending champions, saw their bid for back-to-back titles ended
        by an imperious display of possession football. The win marks a triumphant return to the
        World Cup summit for Spain, 16 years after their last triumph.
      </p>
      <p className={styles.championSnippetBody}>
        Full breakdown: See match stats, lineup analysis, and post-match reactions on GoalCurrent.
      </p>
      <div className={styles.championSnippetActions}>
        <Link href={MATCH_HREF} className={styles.championSnippetPrimary}>
          View M104 Breakdown
        </Link>
        <Link href={ARTICLE_HREF} className={styles.championSnippetSecondary}>
          Read the full report →
        </Link>
      </div>
    </section>
  );
}

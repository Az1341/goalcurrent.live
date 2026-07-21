import { Link } from "@/i18n/navigation";
import {
  WC26_ARCHIVE_LABEL,
  formatArchiveScoreLine,
  getWc26ArchiveFinalSummary,
} from "@/lib/wc26/archive";
import styles from "../home-v5.module.css";

const ARTICLE_HREF = "/articles/spain-world-cup-2026-champion-masterclass";
const ARCHIVE_HREF = "/worldcup2026";
const MATCH_HREF = "/match/fixture-104";

/**
 * Homepage historical archive card — not a live World Cup module.
 * Facts from curated SSOT only.
 */
export default function HomeChampionSnippet() {
  const finalSummary = getWc26ArchiveFinalSummary();
  const scoreLine = finalSummary ? formatArchiveScoreLine(finalSummary) : null;

  return (
    <section
      className={styles.championSnippet}
      aria-labelledby="home-archive-snippet-heading"
    >
      <p className={styles.championSnippetEyebrow}>{WC26_ARCHIVE_LABEL}</p>
      <h2 id="home-archive-snippet-heading" className={styles.championSnippetTitle}>
        {finalSummary
          ? `${finalSummary.winnerName} won World Cup 2026`
          : "World Cup 2026 Archive"}
      </h2>
      <p className={styles.championSnippetBody}>
        {finalSummary && scoreLine
          ? `${finalSummary.winnerName} defeated ${finalSummary.runnerUpName} in the final (${scoreLine}). Explore the permanent GoalCurrent archive for the bracket, results and tournament articles.`
          : "Explore GoalCurrent permanent World Cup 2026 Archive for final results, bracket and tournament articles."}
      </p>
      <div className={styles.championSnippetActions}>
        <Link href={ARCHIVE_HREF} className={styles.championSnippetPrimary}>
          Open World Cup 2026 Archive
        </Link>
        <Link href={MATCH_HREF} className={styles.championSnippetSecondary}>
          Final match report
        </Link>
        <Link href={ARTICLE_HREF} className={styles.championSnippetSecondary}>
          Champion article
        </Link>
      </div>
    </section>
  );
}

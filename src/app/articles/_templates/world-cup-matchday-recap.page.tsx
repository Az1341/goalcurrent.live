import type { Metadata } from "next";
import Link from "next/link";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

/** COPY to src/app/articles/{slug}/page.tsx — replace all TODO_* placeholders. */
const SLUG = "TODO_SLUG"; // e.g. world-cup-2026-june-24-recap

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function Wc26MatchdayRecapPage() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
            <h1>TODO_HEADLINE — World Cup 2026 Matchday Recap, TODO_MATCHDAY_LABEL</h1>
            <div className={styles.hereMeta}>
              <span>
                By the <strong>GoalCurrent.live Editorial Team</strong>
              </span>
              <span className={styles.sep}>·</span>
              <span>TODO_PUBLISH_DATE</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>TODO_LEAD_PARAGRAPH</p>

            <h2>TODO_HOME 0–0 TODO_AWAY — TODO_VENUE, TODO_CITY</h2>
            <h3>TODO_MATCH_ANGLE</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>TODO_HOME</span>
              <span className={styles.scoreNum}>0 – 0</span>
              <span className={styles.scoreTeam}>TODO_AWAY</span>
            </div>
            <p>TODO_MATCH_RECAP_PARAGRAPH_1</p>
            <p>
              <Link href="/match/TODO_FIXTURE_ID">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/fixtures">Today&apos;s fixtures</Link>
            </p>

            {/* Duplicate match block per featured game */}

            <h2>What it all means</h2>
            <p>TODO_WRAP_UP — standings implications, knockout picture, star performers.</p>
            <p>
              Follow every goal on{" "}
              <Link href="/live">live scores</Link> and the{" "}
              <Link href="/worldcup2026">World Cup 2026 hub</Link>.
            </p>
          </article>

          <div className={styles.copyrightCard}>
            <p>
              <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
              <br />
              Written by the GoalCurrent.live Editorial Team. Unauthorised reproduction or
              republication of this article in whole or in part is strictly prohibited without prior
              written permission.
              <br />
              For syndication enquiries visit{" "}
              <a href="https://goalcurrent.live/contact" target="_blank" rel="noopener noreferrer">
                goalcurrent.live/contact
              </a>
            </p>
          </div>

          <div className={styles.btnRow}>
            <Link href="/articles" className={styles.btnSecondary}>
              ← All Articles
            </Link>
            <Link href="/worldcup2026" className={styles.btnSecondary}>
              World Cup Hub
            </Link>
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}
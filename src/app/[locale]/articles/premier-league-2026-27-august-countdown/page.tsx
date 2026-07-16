import type { Metadata } from "next";
import ArticleBanner from "@/components/articles/ArticleBanner";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import PremierLeagueAugustCountdownBody from "./PremierLeagueAugustCountdownBody";
import styles from "../article.module.css";

const SLUG = "premier-league-2026-27-august-countdown";
const HERO_IMAGE = "/images/news/premier-league-2026-27-august-countdown/hero.svg";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticlePremierLeagueAugustCountdown() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <ArticleBanner
            src={HERO_IMAGE}
            alt="GoalCurrent.live editorial graphic for the Premier League 2026-27 season countdown preview"
          />

          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Preview · Premier League 26/27</div>
            <h1>
              Six Weeks to Kick-Off — Premier League 2026/27 Countdown While the World Cup Roars On
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>1 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>9 min read</span>
            </div>
          </div>

          <PremierLeagueAugustCountdownBody />

          <div className={styles.copyrightCard}>
            <p>
              <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
              <br />
              <ArticleCopyrightNotice />
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
            <Link href="/premier-league" className={styles.btnSecondary}>
              PL Hub
            </Link>
            <Link href="/articles/premier-league-2026-27-new-season" className={styles.btnSecondary}>
              Earlier PL preview
            </Link>
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}

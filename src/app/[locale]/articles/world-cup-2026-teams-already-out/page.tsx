import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import WorldCupEliminatedTeamsBody from "./WorldCupEliminatedTeamsBody";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-teams-already-out";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleWorldCupEliminatedTeams() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.articleBanner}>
            <Image
              src="/images/football-hero-bg.jpg"
              alt=""
              width={1280}
              height={360}
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className={styles.articleBannerImage}
            />
          </div>

          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Analysis · World Cup 2026</div>
            <h1>
              Gone Before the Final Whistle — The World Cup 2026 Teams Already Out
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>28 June 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>9 min read</span>
            </div>
          </div>

          <WorldCupEliminatedTeamsBody />

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
            <Link href="/worldcup2026" className={styles.btnSecondary}>
              WC26 Hub
            </Link>
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}
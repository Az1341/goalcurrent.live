import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import PremierLeague2627Body from "./PremierLeague2627Body";
import styles from "../article.module.css";

const SLUG = "premier-league-2026-27-new-season";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticlePremierLeague2627NewSeason() {
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
            <div className={styles.categoryPill}>Preview · Premier League 26/27</div>
            <h1>
              The New Season Starts Now — Premier League 2026/27 Preview After the World Cup
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>28 June 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>10 min read</span>
            </div>
          </div>

          <PremierLeague2627Body />

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
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}
import type { Metadata } from "next";
import ArticleBanner from "@/components/articles/ArticleBanner";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "england-advance-to-face-mexico-round-of-16";
const HERO_IMAGE = "/images/news/england-advance-to-face-mexico-round-of-16/hero.svg";
const AUTHOR = "Anoush Zafarani";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleEnglandMexicoRoundOf16() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <ArticleBanner
            src={HERO_IMAGE}
            alt="GoalCurrent.live editorial graphic for England advancing to face Mexico in the World Cup 2026 round of 16"
          />
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Report · World Cup 2026</div>
            <h1>
              England Beat DR Congo and Will Face Mexico in the Round of 16 at the Azteca
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} author={AUTHOR} />
              <span className={styles.sep}>·</span>
              <span>2 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>8 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              England&apos;s World Cup 2026 campaign found its next chapter in Atlanta — and its next
              opponent in Mexico City. The Three Lions beat DR Congo 2–1 on Tuesday afternoon at
              Atlanta Stadium to reach the round of 16, where they will meet co-hosts Mexico at the
              Estadio Azteca on Saturday 5 July. It is the tie the tournament has been building
              towards: European pedigree against Azteca noise, Harry Kane against a nation that
              believes this summer can end with a parade through the capital.
            </p>

            <h2>How England won in Atlanta</h2>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>England</span>
              <span className={styles.scoreNum}>2 – 1</span>
              <span className={styles.scoreTeam}>DR Congo</span>
            </div>
            <p>
              Thomas Tuchel&apos;s side controlled the tempo from the first whistle. Kane opened the
              scoring with a penalty after Bukayo Saka was brought down on the right — the England
              captain&apos;s sixth goal of the tournament and a reminder that he remains the reference
              point for everything the attack does. DR Congo responded through Yoane Wissa, who
              punished a rare lapse in concentration from John Stones to make it 1–1 at half-time.
            </p>
            <p>
              The second half belonged to Jude Bellingham. The Real Madrid midfielder scored with a
              solo run that began inside his own half and ended with a low shot beyond Lionel Mpasi.
              England
              managed the closing stages with the maturity of a side that has learned from previous
              knockout heartbreaks — Rice and his midfield partner kept Wissa isolated, and Jordan
              Pickford was rarely troubled after the hour mark.
            </p>
            <p>
              <Link href="/match/fixture-080">Full match centre — England vs DR Congo</Link>
            </p>

            <h2>Why Mexico awaits</h2>
            <p>
              FIFA&apos;s bracket paired the winner of Match 79 with the winner of Match 80. Mexico beat
              Ecuador 2–0 on Monday night at the Azteca — Hirving Lozano and Santiago Giménez the
              scorers — to set up this exact collision. England vs Mexico, Mexico City, 18:00 local
              on 5 July. Eighty thousand voices, altitude, and the weight of a co-host nation that
              has not lost a competitive match at the Azteca in a generation.
            </p>
            <p>
              On paper, England are favourites. Kane is in the form of his life, Saka and Phil Foden
              are supplying width and creativity, and the defensive foundation that topped Group L has
              conceded only twice in four matches. But Mexico are not a paper exercise. El Tri feed
              off atmosphere like few teams in world football, and Lozano&apos;s pace on the counter
              is precisely the weapon that could exploit England&apos;s high defensive line if
              Tuchel presses too aggressively.
            </p>

            <h2>What England must solve</h2>
            <p>
              Three questions will define the round of 16:
            </p>
            <ul>
              <li>
                <strong>Altitude and heat.</strong> Mexico City sits above 2,200 metres. England
                trained in Denver during their pre-tournament camp, but a knockout tie in July is a
                different test from a friendly in May.
              </li>
              <li>
                <strong>Wide areas.</strong> Mexico will sit compact and break through Lozano and
                Giménez. Saka and Luke Shaw must win their duels without leaving acres of space
                behind them.
              </li>
              <li>
                <strong>Set pieces.</strong> Both sides are dangerous from dead balls. England&apos;s
                height — Stones, Maguire, Kane — is an advantage, but Mexico scored twice from
                corners in the group stage.
              </li>
            </ul>

            <h2>The road beyond</h2>
            <p>
              Win on Saturday and England face the winner of the Switzerland–Algeria tie in the
              quarter-finals — potentially another North American night in Dallas or Houston. Lose,
              and the 60-year wait continues. For now, the squad will travel south with confidence
              from Atlanta and respect for what awaits at the Azteca.
            </p>
            <p>
              <Link href="/match/fixture-092">Match 92 hub — Mexico vs England</Link> ·{" "}
              <Link href="/worldcup2026/bracket">Knockout bracket</Link> ·{" "}
              <Link href="/worldcup2026/teams/eng">England team hub</Link>
            </p>
          </article>

          <div className={styles.copyrightCard}>
            <p>
              <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
              <br />
              <ArticleCopyrightNotice author={AUTHOR} />
              <br />
              For syndication enquiries visit{" "}
              <a href="https://goalcurrent.live/contact" target="_blank" rel="noopener noreferrer">
                goalcurrent.live/contact
              </a>
              .
            </p>
          </div>

          <div className={styles.btnRow}>
            <Link href="/articles" className={styles.btnSecondary}>
              ← All Articles
            </Link>
            <Link href="/worldcup2026" className={styles.btnPrimary}>
              World Cup Hub
            </Link>
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}

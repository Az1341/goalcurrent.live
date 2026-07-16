import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "england-argentina-world-cup-semifinal-analysis";
const HERO_IMAGE = "/images/news/england-argentina-world-cup-semifinal-analysis/hero.svg";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleEnglandArgentinaSemiFinal() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.articleBanner}>
            <Image
              src={HERO_IMAGE}
              alt="GoalCurrent.live editorial graphic for England 1-2 Argentina in the World Cup 2026 semi-final in Atlanta"
              width={1280}
              height={720}
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 896px"
              className={styles.articleBannerImage}
            />
          </div>
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Report · World Cup 2026</div>
            <h1>
              England 1-2 Argentina: How the Three Lions&apos; World Cup Dream Died in Atlanta
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>16 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>7 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              Sixty years. That&apos;s how long England&apos;s wait for a men&apos;s World Cup final
              will now stretch, after a stoppage-time gut-punch in Atlanta ended their 2026 campaign
              one step short of the ultimate stage. A match England led for the better part of an
              hour turned, in the space of seven brutal minutes, into another chapter in
              Argentina&apos;s growing legend of late-tournament resurrections.
            </p>

            <h2>What Happened</h2>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>England</span>
              <span className={styles.scoreNum}>1 – 2</span>
              <span className={styles.scoreTeam}>Argentina</span>
            </div>
            <p>
              For long stretches, this semi-final looked nothing like a classic. Neither team
              recorded a shot in the opening 30 minutes, marking the first time since the first
              World Cup broadcast live in 1966 that both sides had gone shotless for so long to
              start a match. It was cagey, tense, and tactical — the kind of game where one moment
              of quality was always going to matter more than volume of chances.
            </p>
            <p>
              That moment arrived just after the break. Anthony Gordon, picked out by a pinpoint
              delivery from Morgan Rogers, drilled England in front in the 55th minute. For a team
              that had never reached a World Cup final in the tournament&apos;s modern era, the goal
              represented something enormous: a genuine, live lead in a semi-final, with 35 minutes
              standing between England and history.
            </p>
            <p>
              Then came the collapse. With Argentina throwing everyone forward, Alexis Mac Allister
              crashed a header off the inside of the post — a warning England didn&apos;t heed.
              Thomas Tuchel responded to Argentina&apos;s pressure by making defensive substitutions,
              bringing on the towering Dan Burn and Nico O&apos;Reilly for Reece James and Declan Rice
              in an apparent bid to see the game out. It backfired. Enzo Fernandez, denied moments
              earlier by a Jordan Pickford save, found space from outside the box in the 85th minute
              and bent a brilliant equalizer beyond his reach. Four minutes into stoppage time,
              Lionel Messi — the architect of both goals — picked out substitute Lautaro Martinez,
              who headed home the winner and sent Argentina through to defend their title.
            </p>
            <p>
              The numbers told their own story of the second-half onslaught. Argentina finished with
              an expected-goals total of 1.84 from 15 attempts, dwarfing England&apos;s 0.53 from just
              five shots. By the numbers, this wasn&apos;t a smash-and-grab; it was a deserved, if
              brutally late, Argentine victory.
            </p>
            <p>
              <Link href="/match/fixture-102">Full match centre — England vs Argentina</Link>
            </p>

            <h2>Why England Couldn&apos;t Get Over the Line</h2>
            <p>
              <strong>1. The fatal tactical pivot.</strong> The turning point wasn&apos;t really the
              goals themselves — it was the decision that preceded them. England had been leading
              1-0 with five minutes of normal time remaining when Argentina scored twice in the
              space of seven minutes, with Fernandez&apos;s leveller and Martinez&apos;s stoppage-time
              header completing the turnaround. The switch to a back-heavy, defend-the-lead shape
              invited exactly the kind of sustained pressure Argentina thrives on. Pundit Paul Merson
              put it bluntly afterward, saying he didn&apos;t expect Tuchel — unlike a
              &quot;defensive coach&quot; — to sit back rather than throw something different at
              Argentina once the lead was secured, and that loading up on defenders only invited the
              siege that eventually broke England down.
            </p>
            <p>
              <strong>2. Messi still decides these games.</strong> Argentina&apos;s tournament has
              followed a pattern all summer: fall behind or stay level deep into matches, then let
              their captain conjure something from nothing. This was described as a first half that
              played like a street brawl and a second half that unfolded like ballet with chainsaws
              — and by the end, the outcome barely felt in doubt as long as Messi kept drawing
              breath. Both Argentine goals ran through him. England had no answer for a player
              operating at that level with a final on the line.
            </p>
            <p>
              <strong>3. A recurring pattern in knockout football.</strong> This wasn&apos;t a
              one-off. Argentina had already survived Cape Verde and Switzerland in extra time and
              completed an improbable comeback against Egypt before doing it again to England. Teams
              that know they can find a way back late are dangerous to sit against — and
              England&apos;s caution played directly into a script Argentina had already written
              three times this tournament.
            </p>
            <p>
              <strong>4. Big-game inexperience at the sharp end.</strong> England has now been here
              before and fallen short in similar fashion. This marks England&apos;s second World Cup
              semi-final in recent tournaments — losing to Croatia in 2018 — after also reaching the
              quarterfinals in 2022, without ever breaking through to a final. When the margins are
              this fine, the accumulated weight of near-misses can matter as much as any single
              tactical call.
            </p>

            <h2>What It Means for England</h2>
            <p>
              Manager Thomas Tuchel offered no excuses in the aftermath. He said he had no regrets in
              the moment, described it as one of England&apos;s best performances of the tournament,
              and said the team gave everything but simply couldn&apos;t get it over the line.
              That&apos;s the cruel arithmetic of knockout football — a strong overall performance
              means little when the result is what gets remembered.
            </p>
            <p>
              For Harry Kane, the disappointment carries extra weight. He acknowledged after the
              match that England were close to breaking through but weren&apos;t there yet. At his
              stage of a golden-generation career, &quot;close&quot; is an increasingly familiar and
              increasingly painful word.
            </p>
            <p>
              The immediate consolation is thin: a third-place play-off against France on Saturday, a
              fixture few players will approach with genuine enthusiasm after missing out on the one
              that mattered. The longer-term reality is more complicated. This England squad has now
              strung together a Round of 16 statement win, a professional quarterfinal, and a
              genuinely competitive semi-final against the reigning champions — evidence of real
              progress even in defeat. But progress isn&apos;t the same as breaking through, and the
              manner of this exit — a lead surrendered via a cautious tactical retreat against the
              best closer in the sport — will invite scrutiny of Tuchel&apos;s in-game management
              heading into the Euros.
            </p>
            <p>
              Argentina, for their part, move on to face Spain in Sunday&apos;s final, setting up a
              first-ever World Cup meeting between Messi and Lamine Yamal. For England, the wait for
              a first final since 1966 continues — and the debate over whether it was bad luck, bad
              management, or simply Messi being Messi will run for a long time yet.
            </p>
            <p>
              <Link href="/worldcup2026/bracket">Knockout bracket</Link> ·{" "}
              <Link href="/worldcup2026/teams/eng">England team hub</Link> ·{" "}
              <Link href="/worldcup2026/teams/arg">Argentina team hub</Link>
            </p>
          </article>

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
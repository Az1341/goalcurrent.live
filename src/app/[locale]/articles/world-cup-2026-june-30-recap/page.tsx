import type { Metadata } from "next";
import ArticleBanner from "@/components/articles/ArticleBanner";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-june-30-recap";
const HERO_IMAGE = "/images/news/world-cup-2026-june-30-recap/hero.svg";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJune30Recap() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <ArticleBanner
            src={HERO_IMAGE}
            alt="GoalCurrent.live editorial graphic for the World Cup 2026 knockout matchday recap on 30 June"
          />
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
            <h1>
              France Cruise, Norway Survive on Pens, Mexico Roar at the Azteca — World Cup 2026
              Matchday Recap, 30 June
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>1 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>11 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              Monday 30 June was the night the FIFA World Cup 2026 knockout stage found its rhythm
              across three time zones. From Arlington in the Texas afternoon through East Rutherford in
              the New York evening to a deafening Mexico City midnight, the round of 32 delivered
              penalties, a European heavyweight cruising, and a co-host nation feeding off Azteca
              energy. It followed a weekend that had already produced drama — Brazil edging Japan in
              Monterrey, Morocco eliminating the Netherlands on spot kicks in Houston — and raised the
              stakes for everyone still chasing the trophy in North America.
            </p>

            <h2>Ivory Coast 1–1 Norway (4–3 pens) — Dallas Stadium, Arlington</h2>
            <h3>Haaland keeps his World Cup alive in a Texas shootout</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Ivory Coast</span>
              <span className={styles.scoreNum}>1 – 1</span>
              <span className={styles.scoreTeam}>Norway</span>
            </div>
            <p>
              The opening knockout match on US soil on Monday afternoon was worth the wait. Ivory Coast,
              runners-up from Group E behind Germany, took a deserved first-half lead through Sébastien
              Haller&apos;s poacher&apos;s finish after Franck Kessié had won the midfield battle.
              Norway, Group I runners-up behind France, looked flat until Erling Haaland dragged them
              back into the contest — a thunderous low drive from the edge of the area that left
              Yahia Fofana with no chance.
            </p>
            <p>
              Extra time produced chances at both ends but no winner. The shootout was pure theatre:
              Haaland converted Norway&apos;s first; Haller missed Ivory Coast&apos;s fourth; Martin
              Ødegaard rolled in the decisive kick to make it 4–3. Norway advance to face the winner of
              Morocco&apos;s path in the round of 16 — and Haaland, who scored twice against Senegal in
              the group stage, remains the story every neutral wants to follow.
            </p>
            <p>
              <Link href="/match/fixture-078">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/bracket">Knockout bracket</Link>
            </p>

            <h2>France 3–1 Scotland — New York/New Jersey Stadium, East Rutherford</h2>
            <h3>Mbappé and Dembélé send a message in the Meadowlands</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>France</span>
              <span className={styles.scoreNum}>3 – 1</span>
              <span className={styles.scoreTeam}>Scotland</span>
            </div>
            <p>
              France, Group I winners, were always favourites against Scotland — the best third-placed
              side from the group-stage permutations — but Les Bleus still needed to prove the
              sluggish moments from the group were behind them. Kylian Mbappé answered emphatically,
              scoring once and assisting Ousmane Dembélé before half-time as France took control in
              front of a crowd that felt more Paris than New Jersey.
            </p>
            <p>
              Scotland, to their credit, refused to fold. Scott McTominay halved the deficit with a
              header from a corner that briefly ignited the tartan section, and for ten minutes France
              looked unsettled. Adrien Rabiot&apos;s late third — a driven finish from the edge of the
              box after Mbappé had carried the ball 40 yards — killed the comeback and confirmed a
              quarter-final path that will terrify the rest of the draw. France have now scored in
              every knockout game they have played since 2018; Scotland depart with pride and one of
              the tournament&apos;s best travelling supports.
            </p>
            <p>
              <Link href="/match/fixture-077">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/teams/fra">France team hub</Link>
            </p>

            <h2>Mexico 2–0 Ecuador — Mexico City Stadium, Mexico City</h2>
            <h3>El Tri ride Azteca noise into the round of 16</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Mexico</span>
              <span className={styles.scoreNum}>2 – 0</span>
              <span className={styles.scoreTeam}>Ecuador</span>
            </div>
            <p>
              The final match of the day belonged to the hosts. Mexico, Group A winners, faced Ecuador —
              third-placed survivors from Group E behind Germany and Ivory Coast — in a stadium that has
              hosted World Cup history before and felt every bit as intimidating on Monday night.
              Hirving Lozano&apos;s early strike, a curling effort into the far corner, sent the Azteca
              into delirium. Santiago Giménez sealed it in the second half with a header from a
              whipped cross that Ecuador&apos;s defence could only watch.
            </p>
            <p>
              Ecuador, who had pushed Norway all the way in the group stage, lacked the cutting edge
              to trouble a Mexico side feeding off 80,000 voices. Enner Valencia was isolated up front,
              and El Tri&apos;s midfield pressed with the urgency of a nation that believes this
              tournament can end with a parade through the capital. Mexico advance to a round-of-16 tie
              that will test whether their defensive organisation can survive against sharper European
              or South American opposition — but on this evidence, the co-hosts are not ready to go home.
            </p>
            <p>
              <Link href="/match/fixture-079">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/a">Group A standings</Link>
            </p>

            <h2>Also on the knockout weekend</h2>
            <p>
              Sunday&apos;s slate set the tone. Brazil beat Japan 2–1 in Monterrey to open the round of
              32 — Vinícius Júnior and Rodrygo combining for the winner after Takefusa Kubo had
              stunned the Seleção with an early opener. Later, Morocco produced the upset of the
              tournament so far: a 1–1 draw with the Netherlands followed by a 3–2 penalty shootout
              victory in Houston that sent the Oranje home and the Atlas Lions into the last 16.
            </p>
            <p>
              Read the full report on Morocco&apos;s dramatic win in our dedicated match piece:{" "}
              <Link href="/worldcup2026/news/morocco-knock-out-netherlands-on-penalties">
                Morocco knock out the Netherlands on penalties
              </Link>
              .
            </p>

            <h2>What it all means</h2>
            <p>
              Six round-of-32 ties are decided. France, Mexico, Norway, Brazil and Morocco join the
              growing list of nations with knockout tickets punched — alongside confirmed pairings
              already locked for England vs DR Congo, USA vs Bosnia, Belgium vs Algeria, Portugal vs
              Croatia, Spain vs Austria, and Switzerland vs Algeria on the days ahead. The bracket is
              taking shape: European heavyweights and co-host ambition on one side, South American
              pedigree and African resilience on the other.
            </p>
            <p>
              Tuesday 1 July brings England against DR Congo in Atlanta, USA against Bosnia in Santa
              Clara, and Belgium against Senegal in Seattle — three fixtures that will further define
              the road to MetLife on 19 July. Follow every kick-off on{" "}
              <Link href="/live">live scores</Link>, study the path on the{" "}
              <Link href="/worldcup2026/bracket">knockout bracket</Link>, and catch up on all{" "}
              <Link href="/worldcup2026/fixtures">fixtures</Link> at the{" "}
              <Link href="/worldcup2026">World Cup 2026 hub</Link> on GoalCurrent.live.
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

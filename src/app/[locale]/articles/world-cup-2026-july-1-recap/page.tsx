import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-july-1-recap";
const HERO_IMAGE = "/images/news/world-cup-2026-july-1-recap/hero.svg";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJuly1Recap() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.articleBanner}>
            <Image
              src={HERO_IMAGE}
              alt="GoalCurrent.live editorial graphic for the World Cup 2026 knockout matchday recap on 1 July"
              width={1280}
              height={720}
              priority
              unoptimized
              sizes="(max-width: 768px) 100vw, 896px"
              className={styles.articleBannerImage}
            />
          </div>
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
            <h1>
              England Cruise, USA Survive, Belgium Edge Senegal — World Cup 2026 Matchday Recap, 1
              July
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>2 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>10 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              Tuesday 1 July narrowed the FIFA World Cup 2026 field again. Three round-of-32 ties
              across the American time zones — from Atlanta at lunchtime through Seattle in the
              afternoon to Santa Clara deep into the Pacific evening — sent England, the United
              States and Belgium into the last 16. It followed Monday&apos;s drama in Texas, New Jersey
              and Mexico City, where France, Norway and co-hosts Mexico had already punched their
              tickets. With eight knockout places now decided, the bracket is taking shape: European
              heavyweights on one side, co-host ambition on the other, and a mouth-watering England
              vs Mexico collision locked in for Mexico City on Saturday.
            </p>

            <h2>England 3–1 DR Congo — Atlanta Stadium, Atlanta</h2>
            <h3>Kane and Bellingham ease the Three Lions past the Leopards</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>England</span>
              <span className={styles.scoreNum}>3 – 1</span>
              <span className={styles.scoreTeam}>DR Congo</span>
            </div>
            <p>
              England, Group L winners, were always favourites against DR Congo — the African
              side who had thrilled neutrals by reaching the knockout stage for the first time — but
              favourites still have to perform under a humid Atlanta sun. Harry Kane answered with
              two goals that reminded everyone why he remains the tournament&apos;s most reliable
              finisher, and Jude Bellingham added a third with a driving run from midfield that
              carried the ball 30 yards before he found the far corner.
            </p>
            <p>
              DR Congo, to their credit, refused to disappear. Yoane Wissa halved the deficit with a
              sharp near-post finish that briefly unsettled the English back line, and for ten
              minutes the Leopards pressed with the freedom of a side with nothing to lose. England
              reasserted control through Declan Rice&apos;s screening and Bukayo Saka&apos;s width, and
              when the final whistle blew the Three Lions had their date with destiny: a round-of-16
              tie against Mexico at the Azteca on 5 July.
            </p>
            <p>
              <Link href="/match/fixture-080">Full match centre</Link> ·{" "}
              <Link href="/articles/england-advance-to-face-mexico-round-of-16">
                England vs Mexico preview
              </Link>
            </p>

            <h2>Belgium 1–0 Senegal — Seattle Stadium, Seattle</h2>
            <h3>Trossard finishes the job in the Pacific Northwest</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Belgium</span>
              <span className={styles.scoreNum}>1 – 0</span>
              <span className={styles.scoreTeam}>Senegal</span>
            </div>
            <p>
              Belgium and Senegal brought Group G&apos;s heavyweight pedigree to Seattle, and for long
              periods it looked like a chess match played in slow motion. Kevin De Bruyne pulled the
              strings from deep, Sadio Mané threatened on the break, and both goalkeepers were
              called into action before half-time. The breakthrough, when it came, was pure
              poacher&apos;s instinct: Leandro Trossard arriving at the back post to steer home a
              De Bruyne cross that Senegal&apos;s defence had failed to clear.
            </p>
            <p>
              Senegal pushed hard in the second half — Mané twice went close from the edge of the area
              — but Belgium&apos;s defensive organisation, rebuilt after a wobbly group stage, held
              firm. Roberto Martínez&apos;s side advance to face the winner of the USA–Bosnia tie, with
              a potential quarter-final against Brazil looming on the horizon if results continue to
              favour the European contenders.
            </p>
            <p>
              <Link href="/match/fixture-082">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/g">Group G standings</Link>
            </p>

            <h2>USA 2–1 Bosnia and Herzegovina — San Francisco Bay Area Stadium, Santa Clara</h2>
            <h3>Pulisic delivers when the co-hosts needed him most</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>USA</span>
              <span className={styles.scoreNum}>2 – 1</span>
              <span className={styles.scoreTeam}>Bosnia and Herzegovina</span>
            </div>
            <p>
              The final match of the day belonged to the co-hosts — and to Christian Pulisic, who
              scored once and created the other in a performance that carried the Stars and Stripes
              through a nervy evening in Silicon Valley. Bosnia, organised and physical, took an
              early lead through a set-piece header that silenced the home crowd, and for twenty
              minutes the USA looked like a team feeling the weight of a nation&apos;s expectation.
            </p>
            <p>
              Pulisic dragged them back. His equaliser — a curling effort from the left channel — was
              followed by a Yunus Musah tap-in after Pulisic had carved open the Bosnian defence on
              the counter. The USA held on through seven minutes of stoppage time that felt like
              seventy, and Gregg Berhalter&apos;s side advance to a round-of-16 tie that will test
              whether their youthful energy can survive against sharper European opposition.
            </p>
            <p>
              <Link href="/match/fixture-081">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/teams/usa">USA team hub</Link>
            </p>

            <h2>What to expect on 2 July</h2>
            <p>
              Wednesday brings another full slate of round-of-32 football — three ties that will
              further define the European half of the draw:
            </p>
            <ul>
              <li>
                <strong>Portugal vs Croatia</strong> — Toronto Stadium, 19:00 local. Two Iberian
                neighbours with tournament pedigree; expect Modrić&apos;s last dance against Ronaldo&apos;s
                supporting cast.
              </li>
              <li>
                <strong>Spain vs Austria</strong> — Los Angeles Stadium, 12:00 local. Spain&apos;s
                possession machine against an Austrian side that upset the odds in the group stage.
              </li>
              <li>
                <strong>Switzerland vs Algeria</strong> — BC Place Vancouver, 20:00 local. A
                six-goal group-stage thriller between these nations sets up another potentially
                explosive knockout tie on the West Coast.
              </li>
            </ul>
            <p>
              Argentina, Colombia and Australia are among the names in action on <strong>3 July</strong>{" "}
              as the round of 32 concludes. Follow every kick-off on our{" "}
              <Link href="/worldcup2026/fixtures">fixtures hub</Link> and{" "}
              <Link href="/live">live scores</Link>.
            </p>

            <h2>Bracket snapshot</h2>
            <p>
              Eight nations have confirmed round-of-16 places: Brazil, Morocco, France, Norway,
              Mexico, England, Belgium and the USA. The path to MetLife on 19 July is narrowing —
              and the England–Mexico quarter-final side of the bracket already looks like the story
              every neutral wants to follow.
            </p>
            <p>
              <Link href="/worldcup2026/bracket">View the knockout bracket</Link> ·{" "}
              <Link href="/worldcup2026">World Cup 2026 hub</Link>
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

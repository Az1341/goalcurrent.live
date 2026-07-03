import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-july-3-recap";
const HERO_IMAGE = "/images/news/world-cup-2026-july-3-recap/hero.svg";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJuly3Recap() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.articleBanner}>
            <Image
              src={HERO_IMAGE}
              alt="GoalCurrent.live editorial graphic for the World Cup 2026 round of 16 and Golden Boot race on 3 July"
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
              Round of 32 Done, Round of 16 Underway — World Cup 2026 Recap &amp; Golden Boot
              Predictions, 3 July
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>3 July 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>12 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              The FIFA World Cup 2026 knockout bracket has turned a corner. All ten round-of-32
              ties are decided — Canada, Paraguay, Brazil, Morocco, France, Norway, Mexico, England,
              the USA and Belgium survived — and the round of 16 is live across North America.
              Spain face Austria, Argentina meet Cape Verde, Portugal tackle Croatia, and six
              nations still chasing the Golden Boot enter the most demanding phase of the
              tournament. Here is where the bracket stands, what the latest results mean, and who
              we think wins the race for the top scorer.
            </p>

            <h2>Round of 32 — final results</h2>
            <p>
              The last 32 produced drama in every time zone: penalties in Houston and Arlington,
              extra time in Seattle, and a European heavyweight clearing Sweden without conceding.
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>South Africa</span>
              <span className={styles.scoreNum}>0 – 1</span>
              <span className={styles.scoreTeam}>Canada</span>
            </div>
            <p>
              <Link href="/match/fixture-073">Match 73 — Canada knock out South Africa</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Germany</span>
              <span className={styles.scoreNum}>1 – 1 (3–4 pens)</span>
              <span className={styles.scoreTeam}>Paraguay</span>
            </div>
            <p>
              <Link href="/match/fixture-074">Match 74 — Paraguay eliminate Germany on penalties</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Brazil</span>
              <span className={styles.scoreNum}>2 – 1</span>
              <span className={styles.scoreTeam}>Japan</span>
            </div>
            <p>
              <Link href="/match/fixture-075">Match 75 — Brazil beat Japan in Monterrey</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Netherlands</span>
              <span className={styles.scoreNum}>1 – 1 (2–3 pens)</span>
              <span className={styles.scoreTeam}>Morocco</span>
            </div>
            <p>
              Read our full report:{" "}
              <Link href="/worldcup2026/news/morocco-knock-out-netherlands-on-penalties">
                Morocco knock out the Netherlands on penalties
              </Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>France</span>
              <span className={styles.scoreNum}>3 – 0</span>
              <span className={styles.scoreTeam}>Sweden</span>
            </div>
            <p>
              <Link href="/match/fixture-077">Match 77 — France cruise past Sweden</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Ivory Coast</span>
              <span className={styles.scoreNum}>1 – 2</span>
              <span className={styles.scoreTeam}>Norway</span>
            </div>
            <p>
              <Link href="/match/fixture-078">Match 78 — Haaland&apos;s Norway survive in Texas</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Mexico</span>
              <span className={styles.scoreNum}>2 – 0</span>
              <span className={styles.scoreTeam}>Ecuador</span>
            </div>
            <p>
              <Link href="/match/fixture-079">Match 79 — Mexico roar at the Azteca</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>England</span>
              <span className={styles.scoreNum}>2 – 1</span>
              <span className={styles.scoreTeam}>DR Congo</span>
            </div>
            <p>
              <Link href="/articles/england-advance-to-face-mexico-round-of-16">
                England advance to face Mexico at the Azteca
              </Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>USA</span>
              <span className={styles.scoreNum}>2 – 0</span>
              <span className={styles.scoreTeam}>Bosnia</span>
            </div>
            <p>
              <Link href="/match/fixture-081">Match 81 — USA hold firm in Santa Clara</Link>
            </p>

            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Belgium</span>
              <span className={styles.scoreNum}>3 – 2 (AET)</span>
              <span className={styles.scoreTeam}>Senegal</span>
            </div>
            <p>
              <Link href="/match/fixture-082">Match 82 — Belgium edge Senegal after extra time</Link>
            </p>

            <h2>Round of 16 — what to watch now</h2>
            <p>
              Six round-of-16 fixtures are on the board. European heavyweights Portugal and Spain
              lead the way; South American favourites Argentina and Colombia follow; and
              Switzerland, Australia and Algeria still have skin in the game through fresh ties.
            </p>
            <ul>
              <li>
                <strong>Portugal vs Croatia</strong> —{" "}
                <Link href="/match/fixture-083">Match 83</Link> · tactical chess between two
                nations that know knockout football.
              </li>
              <li>
                <strong>Spain vs Austria</strong> —{" "}
                <Link href="/match/fixture-084">Match 84</Link> · La Roja&apos;s possession
                machine against a disciplined Austrian block.
              </li>
              <li>
                <strong>Switzerland vs Algeria</strong> —{" "}
                <Link href="/match/fixture-085">Match 85</Link> · North African flair meets Swiss
                structure.
              </li>
              <li>
                <strong>Argentina vs Cape Verde</strong> —{" "}
                <Link href="/match/fixture-086">Match 86</Link> · Messi&apos;s Argentina begin
                their path to a repeat title.
              </li>
              <li>
                <strong>Colombia vs Ghana</strong> —{" "}
                <Link href="/match/fixture-087">Match 87</Link> · two nations built on tempo and
                transition.
              </li>
              <li>
                <strong>Australia vs Egypt</strong> —{" "}
                <Link href="/match/fixture-088">Match 88</Link> · the Socceroos test African
                resilience on the West Coast.
              </li>
            </ul>
            <p>
              England vs Mexico at the Azteca on 5 July remains the headline quarter-final collision
              on the horizon — read our{" "}
              <Link href="/articles/england-advance-to-face-mexico-round-of-16">full preview</Link>.
              Track every kick-off on the{" "}
              <Link href="/worldcup2026/fixtures">fixtures hub</Link> and follow{" "}
              <Link href="/live">live scores</Link> as the round of 16 unfolds.
            </p>

            <h2>Golden Boot race — who leads, and who can still win?</h2>
            <p>
              The race for the FIFA World Cup Golden Boot is tighter than anyone predicted before
              the tournament. With the round of 32 complete, two players sit on six goals, a
              cluster of world-class forwards remain on four, and the expanded 48-team format means
              every surviving striker still has at least three knockout matches — and potentially
              four — to add to their tally.
            </p>

            <h3>Current top scorers (after the round of 32)</h3>
            <ul>
              <li>
                <strong>Lionel Messi (Argentina) — 6 goals.</strong> The defending champions&apos;
                captain has been clinical from open play and dead balls. Argentina face Cape Verde
                in the round of 16 — a tie that should give Messi further chances if La Albiceleste
                control possession as expected.
              </li>
              <li>
                <strong>Harry Kane (England) — 6 goals.</strong> Kane&apos;s penalty against DR
                Congo was his sixth of the tournament, level with Messi at the summit. England&apos;s
                path runs through Mexico at the Azteca and potentially deeper into the European
                half of the draw — high-stakes matches where England&apos;s captain historically
                delivers.
              </li>
              <li>
                <strong>Erling Haaland (Norway) — 4 goals.</strong> Norway&apos;s survival against
                Ivory Coast keeps Haaland in the conversation. He needs a hat-trick swing or a
                deep run to overtake the leaders, but Norway&apos;s direct style in knockout
                football suits a striker who lives on half-chances.
              </li>
              <li>
                <strong>Kylian Mbappé &amp; Ousmane Dembélé (France) — 4 goals each.</strong>{" "}
                France&apos;s 3–0 win over Sweden underlined their attacking depth. Mbappé remains
                the more likely to chase the award, but Dembélé&apos;s group-stage burst keeps him
                in the tie-break conversation on assists.
              </li>
              <li>
                <strong>Vinícius Júnior (Brazil) — 4 goals.</strong> Brazil&apos;s win over Japan
                sends Vinícius into the round of 16 with momentum. If Brazil reach the semi-finals,
                the Real Madrid winger could still mount a late charge.
              </li>
            </ul>
            <p>
              Follow the live chart on{" "}
              <Link href="/worldcup2026/bracket#top-scorers">GoalCurrent.live top scorers</Link> and
              our dedicated{" "}
              <Link href="/articles/top-scorers-world-cup-2026">Golden Boot tracker article</Link>.
            </p>

            <h3>Our predictions — who wins the Golden Boot?</h3>
            <p>
              <strong>Most likely winner: Lionel Messi.</strong> Argentina are tournament favourites,
              Messi is on six goals with Cape Verde next, and the Albiceleste&apos;s control-heavy
              approach creates repeated chances for their No 10. If Argentina reach the final,
              Messi would have seven matches — enough to add two or three more and win outright.
            </p>
            <p>
              <strong>Closest challenger: Harry Kane.</strong> England&apos;s route is harder
              tactically — Mexico at altitude, then likely European opposition — but Kane has
              scored in every knockout round so far and takes penalties. If England go deep and
              Messi goes quiet against stronger defences, Kane could pip the Argentine on the
              final weekend.
            </p>
            <p>
              <strong>Dark horse: Erling Haaland.</strong> Four goals behind the leaders sounds
              like a lot, but Haaland has scored four in a single Champions League night before.
              Norway are unfancied but not finished; a quarter-final run and two multi-goal
              performances would rewrite the chart overnight.
            </p>
            <p>
              <strong>Outside bet: Kylian Mbappé.</strong> France looked the most complete team in
              the round of 32. Mbappé on four goals with Les Bleus potentially facing three more
              knockout ties is a formula that has produced Golden Boot winners before.
            </p>
            <p>
              <strong>Long shot: Vinícius Júnior.</strong> Needs Brazil to reach the final and to
              score in most remaining matches. Possible, but Brazil&apos;s spread of goals across the
              front line makes a single-player surge less likely than Argentina or England&apos;s
              Kane-centric model.
            </p>

            <h2>Bracket snapshot</h2>
            <p>
              Sixteen nations remain in the knockout bracket. France, Norway, Brazil and Morocco
              represent Europe, Africa and South America on one side of the draw; England, Mexico,
              the USA and Belgium anchor the other. Paraguay and Canada are surprise survivors;
              Germany and the Netherlands the highest-profile exits from the round of 32.
            </p>
            <p>
              The quarter-finals will shrink the field to four. By the weekend, we will know whether
              Messi or Kane has pulled clear in the scoring charts — and whether Mexico&apos;s
              Azteca or France&apos;s efficiency defines the story of the next few days.
            </p>
            <p>
              <Link href="/worldcup2026/bracket">Full knockout bracket</Link> ·{" "}
              <Link href="/worldcup2026/bracket#top-scorers">Top scorers table</Link> ·{" "}
              <Link href="/live">Live scores</Link> ·{" "}
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

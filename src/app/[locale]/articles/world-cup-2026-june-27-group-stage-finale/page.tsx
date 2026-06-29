import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-june-27-group-stage-finale";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJune27GroupStageFinale() {
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
              Messi, Kane and Cabo Verde — The Stories That Closed the World Cup 2026 Group Stage
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>28 June 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>11 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              The FIFA World Cup 2026 group stage did not end with a whimper. It ended with Lionel Messi
              curling another free-kick into the net, Harry Kane becoming England&apos;s greatest World
              Cup goalscorer, Cabo Verde advancing without winning a match, Iran denied by VAR in
              stoppage time, and DR Congo erasing half a century of hurt in Atlanta. Saturday 27 June
              was the most consequential day of the opening phase — ten matches, four time zones, and
              enough narrative for a month of documentaries. Here are the stories that will define how we
              remember the day the forty-eight became thirty-two.
            </p>

            <h2>Messi: Seven Straight World Cups, Six Goals, One More Record</h2>
            <p>
              Lionel Messi did not need to play against Jordan. Argentina had already topped Group J; the
              defending champions had already demonstrated that this tournament belongs to them as much as
              any team on the planet. Scaloni rested him, rotated nine players, and still watched his
              side win 3–1 in Arlington. But Messi came on at the hour mark anyway — three days after his
              39th birthday, in the same stadium where he had scored twice against Algeria earlier in the
              week — and within twenty minutes he had scored again.
            </p>
            <p>
              The free-kick that beat Jordan&apos;s wall was not the most spectacular goal of his career.
              It did not need to be. What mattered was the context: his sixth goal of World Cup 2026, his
              19th at World Cup finals overall, and the extension of a scoring streak to seven
              consecutive World Cup appearances — a record no other human being has touched. Just Fontaine&apos;s
              thirteen goals in 1958 remains the single-tournament benchmark; Messi, with six through three
              group games, is now two clear of Erling Haaland, Kylian Mbappé, Ousmane Dembélé and Vinícius
              Júnior in the Golden Boot race.
            </p>
            <p>
              Giovani Lo Celso and Lautaro Martínez both scored their first World Cup goals in Messi&apos;s
              absence, a subtle signal that Argentina&apos;s depth may finally match their superstar&apos;s
              standards. But the tournament still bends around number ten. Cabo Verde await in the round
              of 32 — a fairytale fixture that will be watched by everyone who loves football and feared by
              everyone who has to mark him.
            </p>

            <h2>Kane: England&apos;s Reluctant King Finally Owns the Record</h2>
            <p>
              Gary Lineker scored ten World Cup goals across two tournaments, spread across twelve years
              and the memory of a nation that has waited sixty years for another trophy. Harry Kane passed
              him in a single afternoon in New Jersey, nodding home Jude Bellingham&apos;s cross to make it
              2–0 against Panama and register his 11th finals goal for England. The strike was workmanlike
              — a header from a set-piece routine, the kind of goal Kane has scored hundreds of times for
              club and country — but the arithmetic was historic.
            </p>
            <p>
              England&apos;s performance against Panama will not reassure everyone. Thomas Tuchel&apos;s side
              were laboured for an hour, profligate in front of goal, and reliant on a teenager&apos;s
              corner and a veteran&apos;s header to secure a result they could not afford to miss. Yet
              tournament football rewards teams that win when they are not at their best, and England did
              exactly that. Topping Group L means a round-of-32 meeting with DR Congo rather than a
              potential early collision with Spain or Portugal on the other side of the bracket — a
              significant prize for a team that still believes it can go deep.
            </p>
            <p>
              Kane, at 32, may have only one more World Cup in him. The record he now owns is the kind that
              outlives individual tournaments — a line in the history books that future England strikers
              will chase for decades. Whether he adds a more important line — world champion — depends on
              what happens from 4 July onwards.
            </p>

            <h2>Cabo Verde: Three Draws and a Date with Destiny</h2>
            <p>
              No result on 27 June better captured the romance of the expanded World Cup than Cabo Verde&apos;s
              0–0 draw with Saudi Arabia in Houston. The Blue Sharks entered the night knowing a point might
              be enough; they left knowing it was. Three draws, three points, second place in Group H
              behind a Spain side that conceded zero goals across the group stage. A nation whose population
              could fit inside MetLife Stadium with room to spare will face Argentina in the round of 32.
            </p>
            <p>
              Football romantics will celebrate. Tactical analysts will worry. Cabo Verde did not win a game,
              but they were never beaten — a defensive organisation and collective discipline that echoes
              Iceland&apos;s run in 2016 and Costa Rica&apos;s in 2014. Whether that structure survives
              ninety minutes against Messi, Lo Celso and Martínez is another question entirely. What is not
              in doubt is that the 2026 World Cup has already produced a story that will be told in Praia
              for generations.
            </p>

            <h2>Iran: When VAR Steals Certainty</h2>
            <p>
              Iran&apos;s World Cup ended in the cruelest way modern football allows. Level at 1–1 with
              Egypt in Seattle, they thought Khalilzadeh had scored a 2–1 winner in stoppage time — the
              goal that would have lifted them into the knockout conversation as one of the best third-placed
              teams. Celebrations were cut short. VAR found offside in the buildup. The goal was removed.
              The draw stood. Iran finished with three points from three draws and were eliminated when the
              permutations across all twelve groups were finalised after Algeria&apos;s late drama in Kansas
              City.
            </p>
            <p>
              Mehdi Taremi&apos;s missed penalty earlier in the match will haunt the squad. So will the
              knowledge that they were unbeaten — yet out. In the VAR era, football&apos;s margins are
              measured in pixels as well as goals. Iran leave North America wondering what might have been,
              and their supporters leave wondering whether the technology that promises fairness also
              promises heartbreak.
            </p>

            <h2>Panama and Uzbekistan: The Goalless and the Winless</h2>
            <p>
              At opposite ends of the footballing world, Panama and Uzbekistan shared the same fate on 27
              June: elimination with their World Cup stories incomplete. Panama lost 2–0 to England in New
              Jersey, finishing Group L with zero goals from three matches — the first nation since Honduras
              and Algeria in 2010 to suffer that indignity. They competed, frustrated England for an hour,
              and had a Jose Fajardo effort ruled out for offside late on, but depart without the goal their
              supporters travelled thousands of miles to witness.
            </p>
            <p>
              Uzbekistan&apos;s maiden World Cup ended in Atlanta with a 3–1 defeat to DR Congo after Eldor
              Shomurodov had briefly given them hope. Three defeats, three lessons, and the knowledge that
              debut campaigns are rarely kind. Central Asian football will grow from the experience; the
              players who wore white in Atlanta will carry the memory forever, win or lose.
            </p>

            <h2>DR Congo: Fifty-Two Years Between Trauma and Triumph</h2>
            <p>
              Yoane Wissa&apos;s brace against Uzbekistan was more than a personal achievement. It was
              reparation for history. DR Congo&apos;s only previous World Cup appearance ended in a 9–0
              humiliation against Yugoslavia in 1974 — a scoreline that became shorthand for African
              football&apos;s struggles on the global stage. In 2026, the Leopards held Portugal, beat
              Uzbekistan, and advanced as a best third-placed team to face England. Fiston Mayele&apos;s
              near-post flick and the wild celebrations that followed — substitutes sprinting forty yards
              to join the pile — were images of pure, unfiltered joy.
            </p>
            <p>
              African football has waited for another deep run since Morocco&apos;s semi-final in 2022. DR
              Congo are not favourites against England, but they arrive in the round of 32 with nothing to
              lose and a continent behind them.
            </p>

            <h2>Modrić and Croatia: Age Is a Number, Assists Are Forever</h2>
            <p>
              Luka Modrić will be 41 before this tournament ends. Against Ghana in Philadelphia, he did what
              he has done for twenty years: found space, delivered a dead ball, and let a teammate finish.
              Nikola Vlašić headed home Modrić&apos;s corner in the 83rd minute to send Croatia through as
              Group L runners-up — and Modrić became the oldest player to assist a goal at a World Cup. Petar
              Sučić&apos;s opening rocket from distance was the kind of goal that makes you rewind the
              replay; Vlašić&apos;s winner was the kind that sends a nation into the knockouts. Croatia will
              face Portugal next — a fixture that needs no advertising.
            </p>

            <h2>Algeria and Austria: The Game That Felt Like a Final</h2>
            <p>
              The 3–3 draw in Kansas City was the group stage&apos;s loudest exclamation mark. Six goals,
              two nations through, Mahrez scoring twice including a stoppage-time equaliser that denied
              Austria a winner deep in added time. It was chaotic, brilliant, and entirely fitting for a
              tournament that expanded to forty-eight teams and promised more drama in the groups than ever
              before. Austria, in the round of 32 for the first time since 1958, now face Spain. Algeria
              survive as a best third-placed team — the Desert Warriors&apos; habit of making nights
              unforgettable continues.
            </p>

            <h2>The Bracket Awaits</h2>
            <p>
              On Sunday 28 June, the dust settles. Thirty-two teams train, recover, and study the path ahead.
              Spain&apos;s defensive record — zero goals conceded in Group H — makes them the form team of
              the tournament at the back. Argentina&apos;s nine points from nine speak for themselves at the
              front. Belgium&apos;s 5–1 demolition of New Zealand reminded everyone that the Red Devils can
              still explode. England top Group L without convincing everyone. Portugal and Colombia drew but
              both advance with confidence.
            </p>
            <p>
              The round of 32 begins on 4 July. Until then, explore the{" "}
              <Link href="/worldcup2026/bracket">full knockout bracket</Link>, check{" "}
              <Link href="/worldcup2026/bracket#top-scorers">top scorers</Link> as the Golden Boot race
              intensifies, and revisit every final group table on the{" "}
              <Link href="/worldcup2026/standings">standings page</Link>. The group stage is archived.
              The knockout stage is where legends are made — and where Saturday&apos;s stories either grow
              or end.
            </p>
            <p>
              Read the full match-by-match breakdown in our{" "}
              <Link href="/articles/world-cup-2026-june-27-recap">
                27 June matchday recap
              </Link>
              , and follow every goal on <Link href="/live">GoalCurrent.live live scores</Link>.
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
            <Link href="/worldcup2026/bracket" className={styles.btnSecondary}>
              Knockout Bracket
            </Link>
          </div>
        </div>
      </main>
    </StaticArticleSeo>
  );
}

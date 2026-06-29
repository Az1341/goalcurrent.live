import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ArticleAuthorLine, { ArticleCopyrightNotice } from "@/components/articles/ArticleAuthorLine";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-june-27-recap";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJune27Recap() {
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
            <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
            <h1>
              Belgium Rout New Zealand, England Top Panama — World Cup 2026 Matchday Recap, 27 June
            </h1>
            <div className={styles.hereMeta}>
              <ArticleAuthorLine sepClassName={styles.sep} />
              <span className={styles.sep}>·</span>
              <span>28 June 2026</span>
              <span className={styles.sep}>·</span>
              <span className={styles.readTime}>12 min read</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              Saturday 27 June was the day the FIFA World Cup 2026 group stage finally exhaled. Ten
              matches across North America — from Vancouver and Seattle in the west to Philadelphia,
              Miami and Arlington deep into the Texas night — decided the last automatic qualifiers,
              the last best-third-place survivors, and the last flights home. Belgium produced the
              goals of the morning, England and Croatia settled Group L in the early evening, Colombia
              and Portugal played out a tense stalemate in Miami, DR Congo wrote history in Atlanta,
              and Lionel Messi added another chapter in Dallas as Argentina completed a perfect sweep
              of Group J. Algeria and Austria, meanwhile, served up a six-goal thriller in Kansas City
              that felt like a knockout tie even before the round of 32 begins.
            </p>

            <h2>Belgium 5–1 New Zealand — BC Place Vancouver, Vancouver</h2>
            <h3>Red Devils roar into first place with a statement win</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Belgium</span>
              <span className={styles.scoreNum}>5 – 1</span>
              <span className={styles.scoreTeam}>New Zealand</span>
            </div>
            <p>
              Belgium saved their best for last in Group G. After two draws that left the Red Devils
              sweating on goal difference, the Belgian side dismantled New Zealand 5–1 at
              BC Place to clinch top spot and a round-of-32 date with Senegal. Leandro Trossard struck
              twice, Kevin De Bruyne curled in a trademark low finish, Romelu Lukaku added his
              customary poacher&apos;s goal, and Alexis Saelemaekers rounded off a performance that
              finally resembled the golden generation Belgium have promised for a decade. New Zealand
              pulled one back through a consolation strike but never threatened to derail the
              arithmetic; the All Whites depart with a single point and memories of a tournament that
              proved a step too far at this level.
            </p>
            <p>
              The margin mattered as much as the victory. Egypt&apos;s draw with Iran in Seattle meant
              Belgium needed not only to win but to win well — and De Bruyne&apos;s 66th-minute strike,
              making it 3–0 at the time, was the goal that flipped the group on goal difference. When
              the final whistle blew in Vancouver, Belgium sat on five points with a superior goal
              difference to Egypt&apos;s five. For a squad that entered the tournament under pressure after
              a sluggish start, the response on the West Coast was emphatic.
            </p>
            <p>
              <Link href="/match/fixture-066">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/g">Group G standings</Link>
            </p>

            <h2>Egypt 1–1 IR Iran — Seattle Stadium, Seattle</h2>
            <h3>VAR denies Iran a stoppage-time winner as Pharaohs advance</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Egypt</span>
              <span className={styles.scoreNum}>1 – 1</span>
              <span className={styles.scoreTeam}>IR Iran</span>
            </div>
            <p>
              The most dramatic game of the Pacific window unfolded in Seattle, where Iran thought they
              had stolen a 2–1 winner deep into stoppage time only for VAR to intervene. Shoja
              Khalilzadeh appeared to have bundled home the decisive goal after Egyptian defenders
              failed to clear, and Iranian celebrations erupted — briefly. The replay showed an offside
              in the buildup, the goal was chalked off, and the match finished 1–1. Iran, who drew all
              three group games and finished with three points, were eliminated when the best-third-place
              table closed across all twelve groups. Egypt, already assured of the round of 32 before
              kick-off thanks to results elsewhere, settled for second place behind Belgium and will face
              Australia in Arlington on the first knockout weekend.
            </p>
            <p>
              The contest itself was ferocious. Mohamed Salah was withdrawn in the 57th minute looking
              frustrated, but Egypt&apos;s collective effort embodied the fight that has defined their
              campaign. Iran, seeking a first knockout appearance, had a golden chance to level when
              Mehdi Taremi won a penalty — and then missed it. Football&apos;s cruelty is rarely more
              visible than when a nation&apos;s fate hinges on a spot kick and a linesman&apos;s monitor.
            </p>
            <p>
              <Link href="/match/fixture-065">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/g">Group G standings</Link>
            </p>

            <h2>Spain 1–0 Uruguay — Guadalajara Stadium, Guadalajara</h2>
            <h3>Baena sends La Roja through as Uruguay&apos;s World Cup ends again</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Uruguay</span>
              <span className={styles.scoreNum}>0 – 1</span>
              <span className={styles.scoreTeam}>Spain</span>
            </div>
            <p>
              Spain were not at their fluent best in Guadalajara, but they did what champions-in-waiting
              must: found a way. Álex Baena struck in the 42nd minute, pouncing after Marcos Llorente
              won a loose ball on the right and fed him inside the box. The shot skipped off the turf and
              wrong-footed Fernando Muslera, who got hands to it but could not keep it out. For 85
              minutes Uruguay failed to register a shot on target; Nicolás de la Cruz finally tested
              Unai Simón late on, but Spain held firm to finish Group H with seven points and zero goals
              conceded across three matches — a defensive record that will unsettle anyone in the knockout
              bracket.
            </p>
            <p>
              For Uruguay, twice world champions, this was another group-stage failure. Marcelo
              Bielsa&apos;s side depart with two points from three draws and a defeat, eliminated before
              the serious business began. Manuel Ugarte was stretchered off in the first half, a worrying
              image for a squad that needed every ounce of midfield energy. Spain advance to face the
              runner-up from Group J — Austria, after the chaos in Kansas City — while Cabo Verde&apos;s
              remarkable story continues on the other side of the bracket.
            </p>
            <p>
              <Link href="/match/fixture-064">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/h">Group H standings</Link>
            </p>

            <h2>Cabo Verde 0–0 Saudi Arabia — Houston Stadium, Houston</h2>
            <h3>Blue Sharks draw their way into the Round of 32</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Cabo Verde</span>
              <span className={styles.scoreNum}>0 – 0</span>
              <span className={styles.scoreTeam}>Saudi Arabia</span>
            </div>
            <p>
              Cabo Verde did not win a single group game. They did not need to. Three draws — 0–0 with
              Spain on opening night, 2–2 with Uruguay, and a goalless stalemate with Saudi Arabia in
              Houston — yielded three points and second place in Group H behind La Roja. It is one of the
              great fairytale arcs of this expanded World Cup: a nation of roughly half a million people,
              appearing at the tournament for only the second time, advancing to the round of 32 without
              winning a match. Their reward is a meeting with Argentina and Lionel Messi — a fixture that
              will captivate neutrals and terrify Cabo Verde supporters in equal measure.
            </p>
            <p>
              Saudi Arabia, who drew with Uruguay and lost heavily to Spain, finish on two points and head
              home. The Green Falcons&apos; campaign promised more after their historic upset culture at
              previous World Cups but could not find the cutting edge when it mattered in Texas.
            </p>
            <p>
              <Link href="/match/fixture-063">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/h">Group H standings</Link>
            </p>

            <h2>Panama 0–2 England — New York/New Jersey Stadium, East Rutherford</h2>
            <h3>Bellingham and Kane send Three Lions through as Group L winners</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Panama</span>
              <span className={styles.scoreNum}>0 – 2</span>
              <span className={styles.scoreTeam}>England</span>
            </div>
            <p>
              England laboured for an hour in New Jersey, then found the ruthlessness their manager
              demanded. Jude Bellingham broke the deadlock from a corner in the 62nd minute, becoming
              the youngest England player since 1966 to score and assist at a World Cup when he then
              supplied the cross for Harry Kane&apos;s headed second four minutes later. Kane&apos;s goal
              was his 11th at World Cup finals — surpassing Gary Lineker as England&apos;s all-time
              leading scorer at the tournament — and it secured top spot in Group L with seven points.
            </p>
            <p>
              The performance will not live long in the highlights reels. Marcus Rashford and Bukayo Saka
              tested Orlando Mosquera early, but England&apos;s first half was wasteful and nervy. Thomas
              Tuchel needed the win to guarantee first place and avoid a bracket path stacked with Iberian
              heavyweights; his side delivered when it mattered, even if the 65,000-strong crowd in East
              Rutherford would have wanted more fluency. Panama, beaten for a third time without scoring a
              goal all tournament, become the first side since Honduras and Algeria in 2010 to finish a
              World Cup group with zero goals.
            </p>
            <p>
              <Link href="/match/fixture-067">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/l">Group L standings</Link>
            </p>

            <h2>Croatia 2–1 Ghana — Philadelphia Stadium, Philadelphia</h2>
            <h3>Modrić assists, Vlašić heads Croatia into the knockouts</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Croatia</span>
              <span className={styles.scoreNum}>2 – 1</span>
              <span className={styles.scoreTeam}>Ghana</span>
            </div>
            <p>
              Luka Modrić, 40 years old and still orchestrating, delivered the corner that decided Group
              L&apos;s runner-up spot. Nikola Vlašić rose above the Ghana defence in the 83rd minute to
              head home the winner in Philadelphia, completing a comeback narrative after Petar Sučić had
              opened the scoring with a thunderous strike from distance in the 31st. Derrick Luckassen
              equalised for Ghana in the 73rd minute — a goal initially flagged offside before VAR confirmed
              it — but the Black Stars could not find a second.
            </p>
            <p>
              Modrić&apos;s assist made him the oldest player to set up a goal at a World Cup, another
              footnote in a career that refuses to end. Croatia finish second behind England and will face
              Portugal in the round of 32 — a reunion of European heavyweights. Ghana, on four points,
              miss out on the best-third-place places when the arithmetic closed across the tournament,
              ending a campaign that promised much after their draw with England in Foxborough.
            </p>
            <p>
              <Link href="/match/fixture-068">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/l">Group L standings</Link>
            </p>

            <h2>Colombia 0–0 Portugal — Miami Stadium, Miami Gardens</h2>
            <h3>Los Cafeteros top Group K as Sánchez goal is ruled out</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Colombia</span>
              <span className={styles.scoreNum}>0 – 0</span>
              <span className={styles.scoreTeam}>Portugal</span>
            </div>
            <p>
              Colombia wanted to win the group in front of a passionate Miami crowd. Portugal wanted to
              avoid defeat and keep their path clear. Neither side could separate themselves across 90
              cautious minutes — but Colombia got what they needed. A late Davinson Sánchez goal was
              disallowed by the slimmest of offside margins, denying the hosts a dramatic winner. The
              draw leaves Colombia on seven points at the summit of Group K; Portugal follow on five,
              ahead of DR Congo on goal difference among the teams on four points.
            </p>
            <p>
              It was not the spectacle neutrals hoped for from two attack-minded nations, but tournament
              football at this stage is often about risk management. Portugal will meet Croatia in the
              round of 32; Colombia advance with a potentially softer route through the bracket if they
              can rediscover their scoring touch when it matters.
            </p>
            <p>
              <Link href="/match/fixture-069">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/k">Group K standings</Link>
            </p>

            <h2>DR Congo 3–1 Uzbekistan — Atlanta Stadium, Atlanta</h2>
            <h3>Wissa brace seals historic knockout berth for the Leopards</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>DR Congo</span>
              <span className={styles.scoreNum}>3 – 1</span>
              <span className={styles.scoreTeam}>Uzbekistan</span>
            </div>
            <p>
              For 52 years, DR Congo&apos;s defining World Cup memory was a 9–0 defeat to Yugoslavia in
              1974. On Saturday night in Atlanta, Yoane Wissa rewrote the story. Uzbekistan struck first
              through Eldor Shomurodov, and for a while the debutants dreamed of a first-ever points haul.
              But Wissa levelled from the penalty spot in the 68th minute after being brought down by
              Abdukodir Khusanov, Fiston Mayele flicked home a near-post finish to make it 2–1, and Wissa
              sealed it with a composed right-footed strike assisted by Meschack Elia.
            </p>
            <p>
              DR Congo advance as one of the eight best third-placed teams — a historic first for the
              Leopards — and will face England in the round of 32. Uzbekistan, winless in three matches,
              depart their maiden World Cup with pride but no points. The celebrations at full time, with
              substitutes sprinting onto the pitch to join the pile-on, told you everything about what the
              night meant to African football&apos;s often-overlooked giants.
            </p>
            <p>
              <Link href="/match/fixture-070">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/k">Group K standings</Link>
            </p>

            <h2>Jordan 1–3 Argentina — Dallas Stadium, Arlington</h2>
            <h3>Messi off the bench as champions complete a perfect group sweep</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Jordan</span>
              <span className={styles.scoreNum}>1 – 3</span>
              <span className={styles.scoreTeam}>Argentina</span>
            </div>
            <p>
              Argentina had already won Group J. Lionel Scaloni made nine changes and started Lionel Messi
              on the bench — but the greatest player in the game&apos;s history does not sit quietly for
              long. Giovani Lo Celso opened the scoring with a curling free-kick in the 19th minute,
              becoming the first Argentina player other than Messi to score at this World Cup. Lautaro
              Martínez doubled the lead from the penalty spot in the 31st minute after a VAR check for a
              foul on Marco Senesi. Mousa Al-Tamari pulled one back for Jordan in the 55th minute — a
              consolation for a side already eliminated but determined to score in every game of their
              debut tournament.
            </p>
            <p>
              Messi entered in the 60th minute and, inevitably, decided the contest. Fouled on the edge of
              the box in the 80th minute, he curled the free-kick around the wall and into the net for his
              sixth goal of the tournament and his 19th World Cup goal overall. He became the first player
              to score in seven consecutive World Cup appearances — a record that may never be matched.
              Argentina finish on nine points from nine; Jordan go home having scored in every match but
              with none of the points they needed.
            </p>
            <p>
              <Link href="/match/fixture-072">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/j">Group J standings</Link>
            </p>

            <h2>Algeria 3–3 Austria — Kansas City Stadium, Kansas City</h2>
            <h3>Six goals, two qualifiers, and a finish for the ages</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Algeria</span>
              <span className={styles.scoreNum}>3 – 3</span>
              <span className={styles.scoreTeam}>Austria</span>
            </div>
            <p>
              If the group stage needed a final-night capstone, Kansas City supplied it. Algeria and Austria
              traded blows in a 3–3 draw that felt like a cup final — Marko Arnautović opening for Austria,
              Rafik Belghali replying before half-time, Marcel Sabitzer restoring the lead, Riyad Mahrez
              levelling from the spot, Saša Kalajdžić seemingly winning it in the sixth minute of
              stoppage time, and Mahrez striking again in the third minute of added time to complete his
              brace and secure a point that sent both nations through. Austria finish second in Group J;
              Algeria advance as one of the best third-placed sides.
            </p>
            <p>
              The result also had collateral damage elsewhere: Iran&apos;s elimination was confirmed when
              the third-place permutations settled, a reminder that World Cup groups are interconnected
              puzzles where a goal in Missouri can end a dream in Seattle. For Algeria, the Desert Warriors
              continue a habit of dramatic World Cup nights; for Austria, a first knockout berth since
              1958 awaits, with Spain looming on the horizon.
            </p>
            <p>
              <Link href="/match/fixture-071">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/j">Group J standings</Link>
            </p>

            <h2>What it all means</h2>
            <p>
              The group stage is over. Forty-eight teams became thirty-two. Belgium and Egypt emerge from
              Group G; Spain and Cabo Verde from Group H; Colombia, Portugal and DR Congo from Group K;
              England and Croatia from Group L; Argentina, Austria and Algeria from Group J — alongside
              the twenty other automatic qualifiers and best-third-place survivors from the earlier
              matchdays. Panama, Uzbekistan, Iran, New Zealand, Saudi Arabia, Uruguay and Jordan are among
              those heading home.
            </p>
            <p>
              The round of 32 begins on 4 July. Until then, study the bracket, replay the goals, and
              catch your breath — the expanded format has delivered 72 group games and more stories than
              any previous opening phase. Follow every knockout tie on{" "}
              <Link href="/live">live scores</Link>, the{" "}
              <Link href="/worldcup2026/bracket">knockout bracket</Link>, and the{" "}
              <Link href="/worldcup2026">World Cup 2026 centre</Link> on GoalCurrent.live.
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

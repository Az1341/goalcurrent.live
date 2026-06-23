import type { Metadata } from "next";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/page-metadata";
import styles from "../article.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "World Cup 2026 June 22 Recap — Messi, Mbappé, Haaland",
  description:
    "Messi breaks the all-time World Cup scoring record with 18 goals. France, Norway and Argentina all win. Full June 22 match recap. By GoalCurrent.live.",
  path: "/articles/world-cup-2026-june-22-recap",
});

export default function ArticleJune22Recap() {
  return (
    <main className={styles.articlePage}>
      <div className={styles.stack}>

        <div className={styles.heroCard}>
          <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
          <h1>A Day of Giants — World Cup 2026 Matchday Recap, 22 June</h1>
          <div className={styles.hereMeta}>
            <span>By the <strong>GoalCurrent.live Editorial Team</strong></span>
            <span className={styles.sep}>·</span>
            <span>23 June 2026</span>
          </div>
        </div>

        <article className={styles.bodyCard}>
          <p>
            Some days at a World Cup are administrative. Teams go through the motions, results are
            predictable, the football doesn&apos;t fully ignite. June 22, 2026 was emphatically not one of
            those days. From the moment Lionel Messi stepped onto the pitch at AT&T Stadium in Arlington,
            Texas, to the final whistle of Algeria&apos;s dramatic fightback in California, this was a
            matchday that delivered history, drama, goals, a two-hour storm delay, and one of the greatest
            individual performances in World Cup tournament history. Three of world football&apos;s most
            celebrated strikers — Messi, Kylian Mbappé, and Erling Haaland — all scored on the same day.
            Again.
          </p>

          <h2>Argentina 2–0 Austria — AT&T Stadium, Arlington, Texas</h2>
          <h3>Messi Rewrites History — Again</h3>

          <div className={styles.scoreBadge}>
            <span className={styles.scoreTeam}>Argentina</span>
            <span className={styles.scoreNum}>2 – 0</span>
            <span className={styles.scoreTeam}>Austria</span>
          </div>

          <p>
            Lionel Messi, 38 years old and somehow getting better at the biggest stage, became the
            all-time leading scorer in World Cup history on Monday. His double against Austria at AT&T
            Stadium in Dallas gave the defending champions a 2–0 victory and confirmed their place in the
            Round of 32. With 18 career World Cup goals across 28 games, Messi now stands two clear of
            Germany&apos;s Miroslav Klose, who had held the record since 2014.
          </p>
          <p>
            The match had an early twist. From the first meaningful attack, Lautaro Martínez won a
            penalty — but Messi dragged his casual ninth-minute spot-kick wide of the left post, sending
            Austrian goalkeeper Alexander Schlager into ecstatic celebrations and sending a momentary
            tremor through a crowd that was overwhelmingly pro-Argentina. It barely mattered. On 38
            minutes, Thiago Almada cleverly let a pass run through his legs, leaving Messi clean through.
            His left-footed finish was trademark — composed, precise, and devastating. Record: equalled
            at 17.
          </p>
          <p>
            The second came deep in stoppage time. Julián Álvarez&apos;s effort was saved, the rebound
            fell to Messi, his first shot was blocked — and then he drove a low strike from six yards
            out into the net. Record: broken. Eighteen World Cup goals. He also became only the third
            player in World Cup history to score in six consecutive games, joining France&apos;s Just Fontaine
            in 1958 and Brazil&apos;s Jairzinho in 1970.
          </p>
          <p>
            Defensively, Argentina were equally impressive. Austria — who had beaten Jordan 3–1 in
            matchday one — managed just a single shot. Argentina have now gone eight World Cup games
            unbeaten since losing their 2022 group opener to Saudi Arabia, with six wins and two draws.
            The result secures Group J for Argentina, who will play their Round of 32 match in Miami.
          </p>

          <h2>France 3–0 Iraq — Lincoln Financial Field, Philadelphia</h2>
          <h3>Mbappé Braves the Storm</h3>

          <div className={styles.scoreBadge}>
            <span className={styles.scoreTeam}>France</span>
            <span className={styles.scoreNum}>3 – 0</span>
            <span className={styles.scoreTeam}>Iraq</span>
          </div>

          <p>
            France&apos;s evening against Iraq should have been straightforward. It was anything but — and
            not entirely because of Iraqi resistance. A severe thunderstorm rolled through Philadelphia,
            forcing a 2-hour and 10-minute halftime suspension as fans at Lincoln Financial Field were
            directed to shelter. The intensity of the storm was extraordinary even by US standards.
          </p>
          <p>
            Before the skies opened, Mbappé had already put France in control with a left-footed screamer
            from just outside the area in the 14th minute that overpowered Iraq&apos;s goalkeeper Ahmed Basil.
            Classic Mbappé — explosive, technically impeccable, almost casual in its authority.
          </p>
          <p>
            When play resumed after the marathon delay, France — now with 14 career World Cup goals for
            Mbappé — added a second through their talisman before Ousmane Dembélé scored his first goal
            of the tournament to complete a 3–0 win. France are through to the Round of 32, having won
            both their Group I games. They face Norway on June 26 in what will effectively be a
            battle for the group top spot — a mouthwatering prospect and potentially a preview of much
            more to come.
          </p>

          <h2>Norway 3–2 Senegal</h2>
          <h3>Haaland Makes it a Triple-Star Night</h3>

          <div className={styles.scoreBadge}>
            <span className={styles.scoreTeam}>Norway</span>
            <span className={styles.scoreNum}>3 – 2</span>
            <span className={styles.scoreTeam}>Senegal</span>
          </div>

          <p>
            If Messi and Mbappé dominated the earlier conversation on June 22, Erling Haaland made sure
            the evening belonged to all three of football&apos;s reigning superstar trio. The Norwegian
            striker bagged another brace as Norway held on to beat Senegal 3–2, moving into a tie for
            second in the Golden Boot race alongside Mbappé, who sits just three behind Messi&apos;s 18.
          </p>
          <p>
            It was a nervier affair than Norway might have liked. Senegal, desperate for points after
            their opening defeat to France, pushed hard and made it a genuine contest in the second half.
            But Norway&apos;s quality — and Haaland&apos;s clinical finishing — proved the difference. The result
            sets up a fascinating Group I finale: France vs Norway on June 26 will have genuine stakes
            for the group&apos;s top spot, while Senegal must beat Iraq to keep their tournament hopes alive.
          </p>

          <h2>Algeria 2–1 Jordan — Levi&apos;s Stadium, Santa Clara</h2>
          <h3>The Desert Warriors Fight Back</h3>

          <div className={styles.scoreBadge}>
            <span className={styles.scoreTeam}>Algeria</span>
            <span className={styles.scoreNum}>2 – 1</span>
            <span className={styles.scoreTeam}>Jordan</span>
          </div>

          <p>
            The final match of the evening served up the night&apos;s most dramatic conclusion. Jordan took
            a shock lead, forcing Algeria into a position of real pressure. But the Desert Warriors
            showed character. Amine Gouiri scored a decisive 82nd-minute goal off a corner kick —
            the ball bounced in front of goalkeeper Yazeed Abulaila off a header, and Gouiri reacted
            first, slipping it home. After a lengthy VAR review confirmed no offside, the goal stood.
          </p>
          <p>
            It marked Algeria&apos;s first World Cup victory since 2014 — a result that keeps their
            knockout-round ambitions alive heading into the final group game and simultaneously confirms
            Argentina as winners of Group J. Jordan, on the other hand, need a result in their last
            group outing to have any hope of progressing as one of the best third-place finishers.
          </p>

          <h2>Other June 22 Results — More Drama Across the Tournament</h2>
          <p>
            The day&apos;s drama wasn&apos;t confined to Groups I and J. Egypt earned their first World Cup win
            in the country&apos;s history, beating New Zealand 3–1 in Vancouver. Mohamed Salah, Mostafa Zico,
            and Trézéguet were Egypt&apos;s scorers in a historic result that sent the nation into raptures
            and put the Pharaohs on track to reach the knockout round for the first time ever.
          </p>
          <p>
            Cape Verde&apos;s extraordinary debut tournament continued with a 2–2 draw against Uruguay in
            Miami, backing up their shock opening stalemate with Spain. The tiny island nation is one of
            the stories of the 2026 World Cup — fearless, organised, and punching far above their weight.
          </p>

          <h2>What It All Means</h2>
          <p>
            June 22, 2026 will be remembered as the day this World Cup truly found its identity. Messi
            breaking the all-time scoring record. Mbappé shrugging off a thunderstorm to lead France to
            victory. Haaland adding to his tally with his characteristic blend of power and precision.
            Three of the greatest players of their generation performing on the grandest stage, all in
            the same 24 hours.
          </p>
          <p>
            The expanded 48-team format has attracted its critics. But days like June 22 provide the
            answer: more teams means more stories, more drama, more of the unexpected. Egypt winning
            their first World Cup match ever. Cape Verde holding Uruguay. Algeria fighting back in
            the 82nd minute. This World Cup has found its rhythm. And it&apos;s magnificent.
          </p>
        </article>

        <div className={styles.copyrightCard}>
          <p>
            <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong><br />
            Written by the GoalCurrent.live Editorial Team. Unauthorised reproduction or republication of
            this article in whole or in part is strictly prohibited without prior written permission.<br />
            For syndication enquiries visit{" "}
            <a href="https://goalcurrent.live/contact" target="_blank" rel="noopener noreferrer">
              goalcurrent.live/contact
            </a>
          </p>
        </div>

        <div className={styles.btnRow}>
          <Link href="/articles" className={styles.btnSecondary}>← All Articles</Link>
          <Link href="/worldcup2026" className={styles.btnSecondary}>World Cup Hub</Link>
        </div>
      </div>
    </main>
  );
}

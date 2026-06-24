import type { Metadata } from "next";
import Link from "next/link";
import { StaticArticleSeo, staticArticleMetadata } from "@/components/seo/StaticArticleSeo";
import styles from "../article.module.css";

const SLUG = "world-cup-2026-june-23-recap";

export const metadata: Metadata = staticArticleMetadata(SLUG);

export default function ArticleJune23Recap() {
  return (
    <StaticArticleSeo slug={SLUG}>
      <main className={styles.articlePage}>
        <div className={styles.stack}>
          <div className={styles.heroCard}>
            <div className={styles.categoryPill}>Match Recap · World Cup 2026</div>
            <h1>
              Norway Edge Senegal, Portugal Fire Five — World Cup 2026 Matchday Recap, 23 June
            </h1>
            <div className={styles.hereMeta}>
              <span>
                By the <strong>GoalCurrent.live Editorial Team</strong>
              </span>
              <span className={styles.sep}>·</span>
              <span>24 June 2026</span>
            </div>
          </div>

          <article className={styles.bodyCard}>
            <p>
              Matchday two across Groups I, J, K and L served up goals from the opening kick-off through
              the final whistle in Guadalajara. Norway edged Senegal 3–2 in a thriller at the
              Meadowlands, Algeria came from behind to beat Jordan 2–1 in California, and Portugal produced
              the scoreline of the night with a 5–0 dismantling of Uzbekistan in Houston. Colombia edged
              Congo DR 1–0, Croatia beat Panama in Toronto, and England were held 0–0 by Ghana at
              Foxborough.
            </p>

            <h2>Norway 3–2 Senegal — New York/New Jersey Stadium, East Rutherford</h2>
            <h3>Haaland&apos;s Norway hold off Senegal in a five-goal thriller</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Norway</span>
              <span className={styles.scoreNum}>3 – 2</span>
              <span className={styles.scoreTeam}>Senegal</span>
            </div>
            <p>
              Norway and Senegal traded blows in one of the most entertaining games of the matchday. The
              Scandinavians held on for a 3–2 win in New Jersey — a result that keeps Norway firmly in the
              Group I picture alongside France and keeps Senegal&apos;s knockout hopes alive but under
              pressure heading into the final group game.
            </p>
            <p>
              <Link href="/match/fixture-043">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/i">Group I standings</Link>
            </p>

            <h2>Jordan 1–2 Algeria — San Francisco Bay Area Stadium, Santa Clara</h2>
            <h3>Desert Warriors fight back to beat Jordan</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Jordan</span>
              <span className={styles.scoreNum}>1 – 2</span>
              <span className={styles.scoreTeam}>Algeria</span>
            </div>
            <p>
              Algeria recovered from going behind to beat Jordan 2–1 in Santa Clara. The Desert Warriors
              showed the character that has defined their recent World Cup campaigns, turning a deficit
              into three points in Group J. Jordan, beaten at home in the US, face a must-win feel on the
              final matchday if they are to stay in the tournament conversation.
            </p>
            <p>
              <Link href="/match/fixture-044">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/j">Group J standings</Link>
            </p>

            <h2>Portugal 5–0 Uzbekistan — Houston Stadium, Houston</h2>
            <h3>Selecao send a statement in Group K</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Portugal</span>
              <span className={styles.scoreNum}>5 – 0</span>
              <span className={styles.scoreTeam}>Uzbekistan</span>
            </div>
            <p>
              Portugal were utterly ruthless in Texas. A five-goal margin against Uzbekistan underlines the
              gap in quality in Group K and puts Portugal in pole position alongside Colombia after two
              Colombia after two matchdays. Uzbekistan, beaten heavily here, face a steep climb to reach
              the knockout round as one of the best third-placed teams.
            </p>
            <p>
              <Link href="/match/fixture-045">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/k">Group K standings</Link>
            </p>

            <h2>England 0–0 Ghana — Boston Stadium, Foxborough</h2>
            <h3>Three Lions stutter as Black Stars dig in</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>England</span>
              <span className={styles.scoreNum}>0 – 0</span>
              <span className={styles.scoreTeam}>Ghana</span>
            </div>
            <p>
              England expected to take control in Massachusetts but found Ghana organised, physical and
              unwilling to yield. A clean sheet for the Black Stars is a valuable point on the road in
              Group L; for England, the draw leaves the group wide open heading into the final round of
              fixtures. Croatia&apos;s win later in the evening means the Three Lions cannot afford another
              flat performance.
            </p>
            <p>
              <Link href="/match/fixture-046">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/l">Group L standings</Link>
            </p>

            <h2>Panama 0–1 Croatia — Toronto Stadium, Toronto</h2>
            <h3>Vatreni edge Panama in Canada</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Panama</span>
              <span className={styles.scoreNum}>0 – 1</span>
              <span className={styles.scoreTeam}>Croatia</span>
            </div>
            <p>
              Croatia did enough in Toronto to claim three points against Panama. A single-goal victory keeps
              the 2018 finalists in the hunt at the top of Group L and piles pressure on England after the
              stalemate with Ghana. Panama, beaten here, must regroup quickly if they are to stay alive in
              the race for the round of 32.
            </p>
            <p>
              <Link href="/match/fixture-047">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/l">Group L standings</Link>
            </p>

            <h2>Colombia 1–0 Congo DR — Guadalajara Stadium, Guadalajara</h2>
            <h3>Los Cafeteros grind out Group K win</h3>
            <div className={styles.scoreBadge}>
              <span className={styles.scoreTeam}>Colombia</span>
              <span className={styles.scoreNum}>1 – 0</span>
              <span className={styles.scoreTeam}>Congo DR</span>
            </div>
            <p>
              Colombia closed the matchday in Mexico with a narrow but precious 1–0 win over Congo DR. The
              result keeps Colombia in the conversation at the summit of Group K alongside Portugal after
              the Selecao&apos;s five-goal haul earlier in the day. Congo DR, beaten by the odd goal, remain
              in the mix but likely need a result on the final matchday to extend their tournament.
            </p>
            <p>
              <Link href="/match/fixture-048">Full match centre</Link> ·{" "}
              <Link href="/worldcup2026/groups/k">Group K standings</Link>
            </p>

            <h2>What it all means</h2>
            <p>
              Group I remains wide open after Norway&apos;s win over Senegal. France still loom as the
              group&apos;s benchmark, but Norway&apos;s victory ensures the Scandinavian side can dream of
              the round of 32 — while Senegal cannot afford to slip on the final matchday.
            </p>
            <p>
              In Group J, Algeria&apos;s comeback against Jordan keeps knockout hopes burning alongside
              Argentina, who remain the team to beat in the section. Jordan&apos;s defeat leaves them
              needing help and a result in their last group fixture.
            </p>
            <p>
              Group K now has a clear hierarchy: Portugal and Colombia sit on six points from two wins
              (Portugal with a formidable goal difference), while Uzbekistan and Congo DR trail after
              heavy and narrow defeats respectively. The final matchday in the group — including Colombia
              vs Portugal — should decide first place and the path into the round of 32.
            </p>
            <p>
              Group L is tighter. Croatia lead the way after their win in Toronto; England&apos;s draw with
              Ghana and Panama&apos;s loss mean nothing is settled. A slip on the last matchday could still
              send a favourite home early in a group that promised unpredictability from the draw.
            </p>
            <p>
              Follow every goal on <Link href="/live">live scores</Link>, the{" "}
              <Link href="/worldcup2026/fixtures">fixtures hub</Link>, and the{" "}
              <Link href="/worldcup2026">World Cup 2026 centre</Link> on GoalCurrent.live.
            </p>
          </article>

          <div className={styles.copyrightCard}>
            <p>
              <strong>© 2026 GoalCurrent.live — All Rights Reserved.</strong>
              <br />
              Written by the GoalCurrent.live Editorial Team. Unauthorised reproduction or republication of
              this article in whole or in part is strictly prohibited without prior written permission.
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
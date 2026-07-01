import Link from "next/link";
import styles from "@/app/[locale]/articles/article.module.css";

export default function MoroccoNetherlandsArticleBody() {
  return (
    <article className={styles.bodyCard}>
      <p>
        <Link href="/worldcup2026/teams/mar">Morocco</Link> secured their place in the{" "}
        <Link href="/worldcup2026/bracket">FIFA World Cup 2026 Round of 16</Link> after
        defeating the <Link href="/worldcup2026/teams/ned">Netherlands</Link> on penalties
        following an absorbing 1–1 draw that lasted 120 minutes in the{" "}
        <Link href="/worldcup2026/fixtures">Round of 32</Link>.
      </p>

      <p>
        The match produced everything expected from knockout football: tactical battles, late
        drama, extra time and a tense penalty shootout.
      </p>

      <p>
        The Netherlands opened the scoring during the second half and appeared to be in control
        for long periods. Morocco, however, refused to give in and continued to press until
        finding a dramatic late equaliser that forced the game into extra time.
      </p>

      <p>
        Neither side could find a winning goal during the additional thirty minutes despite
        several promising opportunities.
      </p>

      <p>The match was ultimately decided from the penalty spot.</p>

      <p>
        Morocco held their composure throughout the shootout and converted the decisive penalty
        to complete one of the tournament&apos;s biggest upsets, eliminating one of Europe&apos;s
        traditional football powers.
      </p>

      <p>
        Their victory once again demonstrated the resilience, organisation and confidence that
        have become trademarks of Moroccan football in recent international tournaments.
      </p>

      <p>
        For the Netherlands, the defeat will be difficult to accept after controlling large
        periods of the match and coming within minutes of qualification.
      </p>

      <p>
        Morocco now advance to the Round of 16 with growing confidence and will believe they can
        continue their impressive World Cup campaign.
      </p>

      <h2>Match Summary</h2>
      <div className={styles.scoreBadge}>
        <span className={styles.scoreTeam}>Netherlands</span>
        <span className={styles.scoreNum}>1 – 1</span>
        <span className={styles.scoreTeam}>Morocco</span>
      </div>
      <p>
        <strong>After extra time.</strong> Morocco won 3–2 on penalties.
      </p>
      <p>
        <strong>Competition:</strong> FIFA World Cup 2026
        <br />
        <strong>Stage:</strong> Round of 32
        <br />
        <strong>Result:</strong> Morocco progress to the Round of 16.
      </p>
      <p>
        <Link href="/match/fixture-076">Full match centre</Link> ·{" "}
        <Link href="/live">Live scores</Link> ·{" "}
        <Link href="/worldcup2026/bracket">Knockout bracket</Link>
      </p>

      <h2>Match Analysis</h2>
      <p>Knockout football often comes down to mentality as much as technical quality.</p>
      <p>
        Morocco remained disciplined after falling behind and were rewarded for their persistence
        with a late equaliser before showing outstanding composure during the penalty shootout.
      </p>
      <p>
        Their defensive organisation and belief proved decisive, while the Netherlands were
        unable to convert long spells of possession into a winning margin.
      </p>
      <p>
        As the tournament progresses, Morocco have once again shown they are capable of competing
        with the world&apos;s strongest national teams. Follow every remaining{" "}
        <Link href="/worldcup2026/fixtures">World Cup 2026 fixture</Link> on GoalCurrent.live.
      </p>

      <h2>Related reading</h2>
      <p>
        <Link href="/worldcup2026">World Cup 2026 hub</Link> ·{" "}
        <Link href="/news/world-cup">World Cup news</Link> ·{" "}
        <Link href="/articles/world-cup-2026-june-27-group-stage-finale">
          Group stage finale analysis
        </Link> ·{" "}
        <Link href="/articles">All articles</Link>
      </p>
    </article>
  );
}

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { articleHref } from "@/data/articles";
import styles from "../article.module.css";

const IMG = "/images/news/fifa-world-cup-2026-head-to-head-rule-early-elimination";

type FigureProps = {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  priority?: boolean;
};

function ArticleFigure({
  src,
  alt,
  caption,
  width,
  height,
  priority = false,
}: FigureProps) {
  return (
    <figure className={styles.figure}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={styles.figureImage}
        loading={priority ? undefined : "lazy"}
        priority={priority}
        unoptimized
        sizes="(max-width: 768px) 100vw, 896px"
      />
      <figcaption className={styles.figureCaption}>{caption}</figcaption>
    </figure>
  );
}

export default function FifaH2hArticleBody() {
  return (
    <article className={styles.bodyCard}>
      <p>
        The 2026 World Cup has already produced one of those moments where a
        technical rule becomes a football story. Not because FIFA has suddenly
        introduced a dramatic new law saying that a team is automatically
        eliminated after losing its first two group matches. It has not. That is
        the first point that has to be made clearly.
      </p>
      <p>
        The real change is more precise, and more important. FIFA&apos;s 2026 World
        Cup regulations now place head-to-head results before overall goal
        difference when teams in the same group finish level on points. In plain
        English, if two or more teams end the group stage with the same number of
        points, FIFA first looks at what happened in the matches between those
        teams, rather than immediately comparing their total goal difference
        across the whole group.
      </p>

      <div className={styles.keyTakeaways}>
        <h3>Key takeaways</h3>
        <ul>
          <li>
            FIFA has <strong>not</strong> created an automatic
            &quot;lose twice and you are out&quot; rule.
          </li>
          <li>
            <strong>Article 13</strong> changes the tiebreaker order when teams
            are level on points: head-to-head now comes before overall goal
            difference.
          </li>
          <li>
            Some teams can be <strong>mathematically eliminated early</strong> if
            direct results close every realistic route in the table.
          </li>
          <li>
            With <strong>eight third-placed teams</strong> advancing, survival
            paths still exist - but not always inside the same head-to-head duel.
          </li>
        </ul>
      </div>

      <h2>What FIFA Actually Changed</h2>
      <p>
        That sounds like a small administrative adjustment. It is not. It changes
        the way a group table behaves. It changes how quickly a team can be
        confirmed as group winner. It changes how soon another team can be
        declared out. And it changes the psychology of the final round of group
        matches.
      </p>
      <p>
        Track live tables and fixtures on our{" "}
        <Link href="/worldcup2026">World Cup 2026 hub</Link>,{" "}
        <Link href="/worldcup2026/groups">groups centre</Link>, and{" "}
        <Link href="/live">live scores</Link> as the tournament progresses.
      </p>

      <div className={styles.calloutBox}>
        <h3>What changed?</h3>
        <p>
          When teams finish level on points, FIFA now compares{" "}
          <strong>head-to-head results first</strong>, then goal difference
          among the tied teams - not the old habit of leaning on overall group
          goal difference as the first rescue route.
        </p>
      </div>

      <ArticleFigure
        src={`${IMG}/tiebreak-old-vs-new.svg`}
        alt="Side-by-side comparison of previous World Cup tiebreaker emphasis versus FIFA 2026 Article 13 head-to-head priority"
        caption="Original GoalCurrent.live diagram: how the ranking emphasis shifts when teams are level on points."
        width={960}
        height={520}
      />

      <h2>Why Headlines Oversimplify the Story</h2>
      <p>
        The misunderstanding comes from the way the story is often reduced into a
        headline. &quot;Team out after losing first two games because of FIFA rule
        change&quot; is partly true in effect, but not completely accurate in law.
        The rule does not say: lose twice and you are gone. Some teams may still
        survive two defeats if the group mathematics and the third-place ranking
        allow it. Others may be eliminated before their final match because the
        head-to-head outcomes have already closed every realistic legal route
        through the table.
      </p>

      <blockquote className={styles.pullQuote}>
        <p>
          The rule does not punish two defeats automatically. It punishes two
          defeats in a specific table situation.
        </p>
      </blockquote>

      <h3>Two losses, two different outcomes</h3>
      <p>
        That is the key distinction. Under older World Cup group-stage logic,
        supporters were used to goal difference keeping teams alive. A side could
        lose twice, win heavily in the final match, and hope another result
        created a three-way tie. Goal difference could then act almost like a
        second chance. That gave weaker starters a reason to believe that one big
        performance could still rescue their tournament.
      </p>

      <ArticleFigure
        src={`${IMG}/group-table-example.svg`}
        alt="Illustrative World Cup group table showing how a team can be blocked on head-to-head after two matches"
        caption="Hypothetical table for explanation only - not live tournament data."
        width={960}
        height={420}
      />

      <h2>How the Tiebreaker Order Works Now</h2>
      <p>
        In 2026, that rescue route is narrower. If a team loses to direct rivals,
        then later finishes level with them on points, those earlier direct
        defeats matter before overall goal difference. From a regulatory point of
        view, the logic is clean: the table should first reward the team that
        performed better against the team it is tied with. From a football point
        of view, the effect is more controversial: it can reduce the last-day
        drama in some groups because the decisive result has already happened.
      </p>

      <ArticleFigure
        src={`${IMG}/tiebreak-flowchart.svg`}
        alt="Flowchart of FIFA tiebreaker steps when World Cup group teams finish level on points"
        caption="Simplified editorial flowchart based on FIFA World Cup 2026 Regulations, Article 13."
        width={960}
        height={640}
      />

      <ArticleFigure
        src={`${IMG}/referee-illustration.svg`}
        alt="Original illustration of a football referee representing match officials applying published FIFA regulations"
        caption="Original illustration - regulations are published in advance and apply equally to every team."
        width={640}
        height={360}
      />

      <h2>Head-to-Head vs Goal Difference - The Football Debate</h2>
      <p>
        The rule is published in advance. It applies equally to all teams. It is
        not retrospective. It does not give FIFA discretion to pick one team over
        another after the event. In that sense, it is a legitimate competition
        rule. Every federation, coach and player entered the tournament under the
        same ranking system.
      </p>
      <p>
        But legal clarity is not the same as sporting satisfaction. Football&apos;s
        emotional appeal often comes from the illusion that everything remains
        possible until the final whistle. Goal difference helped preserve that
        feeling. Head-to-head strips some of it away. It says: your direct meeting
        mattered most. If you lost it, you cannot later erase it by beating
        someone else heavily.
      </p>

      <blockquote className={styles.pullQuote}>
        <p>
          Head-to-head says your direct meeting mattered most. If you lost it, you
          cannot later erase it by beating someone else heavily.
        </p>
      </blockquote>

      <p>
        There is a strong football argument in favour of that. Head-to-head
        rewards direct sporting superiority. If Team A and Team B finish level on
        points, and Team A beat Team B, many people would say Team A has earned
        the right to be ranked above them. That is simple, intuitive and
        difficult to challenge.
      </p>
      <p>
        There is also an argument against it. Group football is not only about
        one match. It is about performance across three games. A team that loses
        narrowly to a rival but then produces better overall results against the
        rest of the group may feel that goal difference is a better measure of
        consistency. Goal difference also encourages attacking football until the
        end. If head-to-head has already settled the relevant tie, the final
        match can lose part of its competitive edge.
      </p>

      <ArticleFigure
        src={`${IMG}/match-ball-illustration.svg`}
        alt="Original illustration of a football on a green pitch"
        caption="Original illustration - group-stage mathematics begin with results on the pitch, not headlines."
        width={640}
        height={360}
      />

      <h2>Why the 48-Team Format Complicates Everything</h2>
      <p>
        The 2026 format complicates the issue further because eight of the twelve
        third-placed teams qualify for the Round of 32. That means finishing
        third is not automatically fatal. In theory, the expanded tournament
        should keep more teams alive for longer. In practice, the head-to-head
        rule can work in the opposite direction inside individual groups. A team
        may still be only three points behind a rival, but if the direct result
        makes it impossible to overtake that rival, its group position may
        already be sealed.
      </p>

      <ArticleFigure
        src={`${IMG}/third-place-pathway.svg`}
        alt="Diagram comparing in-group head-to-head effects with third-place qualification pathways at World Cup 2026"
        caption="Original diagram - third-place qualification keeps some routes open even when a direct head-to-head duel is closed."
        width={960}
        height={360}
      />

      <p>
        This is why some teams can be out after two games while others with the
        same number of defeats may still have a path. It depends on the structure
        of the group, the points spread, the direct results, and the third-place
        ranking table. The rule is not &quot;two losses equals elimination&quot;.
        The accurate interpretation is: two losses can now lead to earlier
        mathematical elimination if the head-to-head results prevent the team
        from winning the necessary tiebreakers.
      </p>
      <p>
        For a wider look at how the enlarged tournament works, see our{" "}
        <Link href={articleHref("world-cup-2026-complete-guide")}>
          World Cup 2026 complete fan guide
        </Link>{" "}
        and{" "}
        <Link href={articleHref("world-cup-2026-group-stage-guide")}>
          group stage explainer
        </Link>
        .
      </p>

      <h2>What This Means for Coaches, Fans and Journalists</h2>
      <p>
        For journalists and websites covering the tournament, this matters. A
        simplified headline may attract attention, but the explanation underneath
        must be exact. Calling it an automatic two-defeat elimination rule is
        wrong. FIFA has changed the ranking criteria for teams level on points -
        not added a blunt new knockout mechanism to the group stage.
      </p>
      <p>
        For coaches, matchday one and matchday two carry even more legal weight
        in the table than before. A defeat against a direct rival is no longer
        just three points lost and a dent in goal difference. It can become a
        permanent disadvantage that cannot be repaired later unless the points
        table breaks favourably.
      </p>
      <p>
        For supporters, the rule will feel brutal when it works against their
        team. A fan may look at the table and say: &quot;We can still finish on the
        same points, so why are we out?&quot; Once points are level, FIFA asks who
        performed better in the direct meetings. If the answer is already clear,
        goal difference may never get a chance to rescue the team.
      </p>

      <h2>The Verdict: Legally Sound, Footballistically Debatable</h2>
      <p>
        The rule is precise. It is knowable. It rewards direct results. But it
        also risks flattening part of the World Cup&apos;s traditional last-day chaos.
        One of the great pleasures of the group stage has always been the strange
        mathematics of simultaneous matches: one goal in one stadium changing
        everything in another. Head-to-head does not remove that drama
        completely, especially with third-place qualification still in play, but
        it does reduce it in certain scenarios.
      </p>

      <blockquote className={styles.pullQuote}>
        <p>
          Article 13 may look like a dry regulation. On the pitch, it decides who
          still has hope, who is already safe, and who is playing a final group
          match that no longer means what it once did.
        </p>
      </blockquote>

      <p>
        The fairest conclusion is this: FIFA has not created a rule that
        automatically eliminates teams after two defeats. What FIFA has done is
        adopt a tiebreaking order that makes early elimination more likely in
        some groups, because direct results now come before overall goal
        difference. That is a technical change with very real football
        consequences.
      </p>

      <div className={styles.comparisonBox}>
        <h3>Quick comparison</h3>
        <p>
          <strong>What headlines often say:</strong> FIFA now eliminates teams
          automatically after two defeats.
        </p>
        <p>
          <strong>What the regulations say:</strong> when teams are level on
          points, head-to-head results are ranked before overall goal difference -
          which can produce earlier mathematical elimination in some groups.
        </p>
      </div>

      <div className={styles.officialSources}>
        <h3>Official sources</h3>
        <ul>
          <li>
            <a
              href="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              FIFA World Cup 2026 Regulations (Article 13)
            </a>
          </li>
          <li>
            <a
              href="https://www.reuters.com/sports/soccer/headtohead-rule-brings-early-winners-losers-while-third-place-lifeline-keeps-2026-06-24/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Reuters - practical impact of the head-to-head rule (24 June 2026)
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.relatedArticles}>
        <h3>Related articles</h3>
        <ul>
          <li>
            <Link href={articleHref("world-cup-2026-complete-guide")}>
              FIFA World Cup 2026 - The Complete Fan Guide
            </Link>
          </li>
          <li>
            <Link href={articleHref("world-cup-2026-group-stage-guide")}>
              World Cup 2026 Group Stage - All 12 Groups Explained
            </Link>
          </li>
          <li>
            <Link href={articleHref("world-cup-2026-june-23-recap")}>
              World Cup 2026 Matchday Recap - 23 June
            </Link>
          </li>
          <li>
            <Link href={articleHref("alireza-beiranvand-iran-world-cup-hero")}>
              Who Is Alireza Beiranvand? Iran&apos;s World Cup Hero
            </Link>
          </li>
          <li>
            <Link href={articleHref("champions-league-new-rules")}>
              The New Champions League - Format Explainer
            </Link>
          </li>
        </ul>
      </div>

      <div className={styles.btnRow}>
        <Link href="/articles" className={styles.btnSecondary}>
          All Articles
        </Link>
        <Link href="/worldcup2026" className={styles.btnSecondary}>
          World Cup Hub
        </Link>
        <Link href="/live" className={styles.btnSecondary}>
          Live Scores
        </Link>
      </div>
    </article>
  );
}

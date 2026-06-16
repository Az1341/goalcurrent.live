import Link from "next/link";
import { WC26_TOURNAMENT } from "@/data/wc26";
import {
  getFeaturedMatch,
  PLACEHOLDER_MATCHES,
  type MatchStatus,
  type PlaceholderMatch,
} from "@/data/placeholder-matches";
import {
  getGamesLeftToPlay,
  getGamesPlayed,
} from "@/lib/wc26-tournament-stats";
import styles from "./page.module.css";

function formatScore(match: PlaceholderMatch) {
  const { homeGoals, awayGoals } = match;
  if (homeGoals == null || awayGoals == null) return null;
  return `${homeGoals}–${awayGoals}`;
}

function statusPillClass(status: MatchStatus) {
  if (status === "live") return styles.statusLive;
  if (status === "ft") return styles.statusFinished;
  return styles.statusUpcoming;
}

const NEWS = [
  {
    href: "/live",
    emoji: "🔴",
    source: "GoalCurrent",
    headline: "World Cup 2026 Is Underway — Follow Live Scores & Results",
    time: "Coming soon",
  },
  {
    href: "/news",
    emoji: "📰",
    source: "GoalCurrent",
    headline: "Latest World Cup 2026 news and match updates",
    time: "Coming soon",
  },
  {
    href: "/worldcup2026",
    emoji: "🔢",
    source: "World Cup 2026",
    headline: "Group Stage: Standings, Results & Fixtures",
    time: "Coming soon",
  },
];

export default function Home() {
  const featured = getFeaturedMatch();
  const gamesPlayed = getGamesPlayed();
  const gamesLeft = getGamesLeftToPlay();

  const heroStats: { value: number; label: string; highlight?: boolean }[] = [
    { value: WC26_TOURNAMENT.teamCount, label: "Teams" },
    { value: WC26_TOURNAMENT.fixtureCount, label: "Matches" },
    { value: WC26_TOURNAMENT.venueCount, label: "Venues" },
    { value: WC26_TOURNAMENT.hosts.length, label: "Hosts" },
    { value: gamesPlayed, label: "Games Played" },
    { value: gamesLeft, label: "Games Left To Play", highlight: true },
  ];

  return (
    <div className={styles.homepage}>
      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>
          FIFA World Cup <span>2026</span>
        </h2>
        <p className={styles.heroSub}>
          USA · Mexico · Canada · 11 June – 19 July 2026
        </p>

        <div className={styles.statsRow}>
          {heroStats.map(({ value, label, highlight }) => (
            <div
              key={label}
              className={`${styles.statChip} ${highlight ? styles.statChipHighlight : ""}`}
            >
              <div className={styles.statNum}>{value}</div>
              <div className={styles.statLbl}>{label}</div>
            </div>
          ))}
        </div>

        <div className={styles.heroNav}>
          <Link
            href="/worldcup2026"
            className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}
          >
            WC2026 Hub →
          </Link>
          <Link href="/live" className={styles.heroBtn}>
            Live Scores
          </Link>
          <Link href="/news" className={styles.heroBtn}>
            News
          </Link>
        </div>
      </section>

      <main className={styles.content}>
        <h1 className={styles.srOnly}>
          Football Live Scores, Fixtures and World Cup 2026
        </h1>

        <p className={styles.demoNote}>
          Sample data only — live scores will connect here in a later phase.
        </p>

        <article className={styles.featured}>
          <div className={styles.featuredHead}>
            <span>
              {featured.status === "live" ? (
                <>
                  <span className={styles.liveTag} aria-hidden="true" />
                  LIVE NOW
                </>
              ) : (
                "FEATURED"
              )}
            </span>
            <span>{featured.round}</span>
          </div>
          <div className={styles.featuredBody}>
            <div className={styles.matchup}>
              <div className={styles.team}>
                <div className={styles.teamName}>{featured.home}</div>
              </div>
              <div className={styles.score}>
                {formatScore(featured) ?? (
                  <span className={styles.scoreVs}>vs</span>
                )}
                {featured.status === "live" && featured.minute != null && (
                  <small className={styles.minLive}>{featured.minute}&apos;</small>
                )}
              </div>
              <div className={styles.team}>
                <div className={styles.teamName}>{featured.away}</div>
              </div>
            </div>
            <p className={styles.kickoff}>
              {featured.kickoff} · {featured.venue}
            </p>
            <div className={styles.featuredActions}>
              <Link
                href="/worldcup2026"
                className={`${styles.actionBtn} ${styles.actionPrimary}`}
              >
                World Cup Hub →
              </Link>
              <Link
                href="/live"
                className={`${styles.actionBtn} ${styles.actionSecondary}`}
              >
                Live Scores
              </Link>
            </div>
          </div>
        </article>

        <h2 className={styles.sectionLabel}>
          <span className={styles.liveDot} aria-hidden="true" />
          Live Match Centre
        </h2>

        <div className={styles.matchCard}>
          <div className={styles.matchCardHead}>
            <span>TODAY&apos;S MATCHES — WORLD CUP 2026</span>
            <span className={styles.updated}>Sample data</span>
          </div>

          {PLACEHOLDER_MATCHES.map((match) => {
            const score = formatScore(match);

            return (
              <div key={match.id} className={styles.matchRow}>
                <span
                  className={`${styles.statusPill} ${statusPillClass(match.status)}`}
                >
                  {match.statusLabel}
                </span>
                <span className={styles.colHome}>{match.home}</span>
                <span className={styles.colScore}>
                  {score ?? "–"}
                  {match.status === "live" && match.minute != null && (
                    <small className={styles.minLive}>{match.minute}&apos;</small>
                  )}
                  {match.status === "ft" && (
                    <small className={styles.minFt}>FT</small>
                  )}
                </span>
                <span className={styles.colAway}>{match.away}</span>
              </div>
            );
          })}

          <Link href="/worldcup2026" className={styles.matchLink}>
            World Cup 2026 hub →
          </Link>
        </div>

        <h2 className={styles.sectionLabel}>World Cup 2026 — Latest News</h2>

        <div className={styles.newsGrid}>
          {NEWS.map((item) => (
            <Link key={item.headline} href={item.href} className={styles.newsItem}>
              <div className={styles.newsPlaceholder}>{item.emoji}</div>
              <div className={styles.newsBody}>
                <div className={styles.newsSource}>{item.source}</div>
                <div className={styles.newsHeadline}>{item.headline}</div>
                <div className={styles.newsTime}>{item.time}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

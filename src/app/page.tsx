import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import {
  getFeaturedMatch,
  PLACEHOLDER_MATCHES,
  type MatchStatus,
  type PlaceholderMatch,
} from "@/data/placeholder-matches";
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

  return (
    <SiteShell activeNav="home">
      <section className={styles.hero}>
        <h2 className={styles.heroTitle}>
          FIFA World Cup <span>2026</span>
        </h2>
        <p className={styles.heroSub}>
          USA · Mexico · Canada · 11 June – 19 July 2026
        </p>
        <div className={styles.statsRow}>
          {[
            ["48", "Teams"],
            ["104", "Matches"],
            ["16", "Venues"],
            ["3", "Hosts"],
          ].map(([num, lbl]) => (
            <div key={lbl} className={styles.statChip}>
              <div className={styles.statNum}>{num}</div>
              <div className={styles.statLbl}>{lbl}</div>
            </div>
          ))}
        </div>
        <div className={styles.heroNav}>
          <Link
            href="/worldcup2026"
            className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}
          >
            🌍 WC2026 Hub →
          </Link>
          <Link href="/live" className={styles.heroBtn}>
            🔴 Live Scores
          </Link>
          <Link href="/news" className={styles.heroBtn}>
            📰 News
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
              {featured.status === "live" ? "🔴 LIVE NOW" : "📅 FEATURED"}
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
              ⏰ {featured.kickoff} · 🏟 {featured.venue}
            </p>
            <div className={styles.featuredActions}>
              <Link
                href="/worldcup2026"
                className={`${styles.actionBtn} ${styles.actionPrimary}`}
              >
                🌍 World Cup Hub →
              </Link>
              <Link
                href="/live"
                className={`${styles.actionBtn} ${styles.actionSecondary}`}
              >
                🔴 Live Scores
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

        <h2 className={styles.sectionLabel} style={{ marginTop: 22 }}>
          📰 World Cup 2026 — Latest News
        </h2>

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
    </SiteShell>
  );
}

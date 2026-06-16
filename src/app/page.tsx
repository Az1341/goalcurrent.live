"use client";

import Image from "next/image";
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
import { resolveTeamId } from "@/lib/teamIdentity";
import { getTeamFlagSrc } from "@/lib/teamFlag";
import type { TeamId } from "@/types/team";
import TeamFlag from "@/components/TeamFlag";
import styles from "./page.module.css";

const R = {
  burgundy: "#5c0a1a",
  crimson: "#9b1b30",
  darkRed: "#7a1020",
  gold: "#fbbf24",
  white: "#ffffff",
  card: "#ffffff",
  text: "#1a0a0e",
  muted: "#5c4f55",
  border: "#e8dce0",
  footerBg: "#f6f0f2",
  footerBorder: "#ddd0d5",
  footerText: "#4a3540",
};

/** Readable sports-media typography — ~1–2px above typical defaults */
const BODY_SIZE = "20px";
const TEAM_NAME_SIZE = "1.5rem";
const MATCH_ROW_TEAM_SIZE = "1.375rem";
const ROW_FLAG_W = 30;
const ROW_FLAG_H = 22;

const FOOTBALL_NEWS = [
  {
    category: "World Cup 2026 News",
    headline: "Tournament news, groups and daily round-ups",
    href: "/news",
    accent: "#5c0a1a",
  },
  {
    category: "Premier League News",
    headline: "Latest from England’s top flight — results and stories",
    href: "/live",
    accent: "#3d195b",
  },
  {
    category: "Champions League News",
    headline: "European nights — fixtures, form and talking points",
    href: "/live",
    accent: "#0a2a7a",
  },
  {
    category: "Transfer News",
    headline: "Rumours, deals and squad updates across football",
    href: "/news",
    accent: "#9b1b30",
  },
  {
    category: "International Football",
    headline: "National teams, qualifiers and global fixtures",
    href: "/live",
    accent: "#7a1020",
  },
  {
    category: "GoalCurrent Editorial",
    headline: "Football Is Inspiring Canada's Next Generation",
    href: "/news/football-inspiring-canadas-next-generation",
    accent: "#fbbf24",
    flagTeam: "Canada",
  },
] as const;

const COMPETITIONS = [
  { href: "/worldcup2026", label: "World Cup 2026", note: "Lead competition · ongoing" },
  { href: "/live", label: "Live Scores", note: "All matches" },
  { href: "/favourites", label: "Favourites", note: "Your teams" },
];

/** Editorial FIFA preview cards — upcoming fixtures, not duplicated from live/featured rows */
const FIFA_MATCH_PREVIEWS = [
  {
    id: "fifa-prev-usa",
    home: "USA",
    away: "Paraguay",
    kickoff: "Fri 12 Jun, 21:00",
    venue: "Los Angeles",
    round: "Group D",
    teaser:
      "The hosts open the tournament with home support and a deep attacking roster under pressure to deliver.",
    href: "/worldcup2026/fixtures",
  },
  {
    id: "fifa-prev-qatar",
    home: "Qatar",
    away: "Switzerland",
    kickoff: "Thu 11 Jun, 18:00",
    venue: "Santa Clara",
    round: "Group B",
    teaser:
      "Switzerland’s structure meets Qatar’s compact defending in an early group opener.",
    href: "/worldcup2026/fixtures",
  },
  {
    id: "fifa-prev-brazil",
    home: "Brazil",
    away: "Morocco",
    kickoff: "Sat 13 Jun, 18:00",
    venue: "East Rutherford",
    round: "Group C",
    teaser:
      "Brazil’s flair against Morocco’s discipline — a headline clash before the group phase heats up.",
    href: "/worldcup2026/fixtures",
  },
] as const;

const FEATURED_FLAG = 56;
const FEATURED_NAME_SIZE = "1.75rem";

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

function FeaturedMatchBlock({ match }: { match: PlaceholderMatch }) {
  const score = formatScore(match);
  const isLive = match.status === "live";

  return (
    <article
      style={{
        background: R.card,
        border: `1px solid ${R.border}`,
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 20,
        boxShadow: "0 4px 18px rgba(92,10,26,0.08)",
        borderTop: `3px solid ${R.crimson}`,
      }}
    >
      <div
        style={{
          background: R.burgundy,
          color: R.white,
          padding: "12px 18px",
          fontSize: "1rem",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          {isLive ? (
            <>
              <span className={styles.liveTag} aria-hidden="true" />
              LIVE NOW
            </>
          ) : (
            "FEATURED MATCH"
          )}
        </span>
        <span style={{ opacity: 0.85 }}>{match.round}</span>
      </div>

      <div style={{ padding: "28px 20px 22px" }}>
        <div className={styles.featuredRow}>
          <div className={`${styles.featuredSide} ${styles.featuredSideHome}`}>
            <TeamFlag teamName={match.home} size={FEATURED_FLAG} />
            <span
              style={{
                fontSize: FEATURED_NAME_SIZE,
                fontWeight: 800,
                lineHeight: 1.2,
                color: R.text,
                textAlign: "right",
              }}
            >
              {match.home}
            </span>
          </div>

          <div className={styles.featuredScorebox}>
            <div
              style={{
                fontSize: "3rem",
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color: R.text,
              }}
            >
              {score ?? (
                <span style={{ fontSize: "1.25rem", color: R.muted, fontWeight: 600 }}>vs</span>
              )}
            </div>
            {isLive && match.minute != null && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: "1.0625rem",
                  fontWeight: 800,
                  color: R.crimson,
                  lineHeight: 1,
                }}
              >
                {match.minute}&apos;
              </div>
            )}
            {match.status === "ft" && (
              <div
                style={{
                  marginTop: 10,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#15803d",
                }}
              >
                FT
              </div>
            )}
          </div>

          <div className={`${styles.featuredSide} ${styles.featuredSideAway}`}>
            <span
              style={{
                fontSize: FEATURED_NAME_SIZE,
                fontWeight: 800,
                lineHeight: 1.2,
                color: R.text,
                textAlign: "left",
              }}
            >
              {match.away}
            </span>
            <TeamFlag teamName={match.away} size={FEATURED_FLAG} />
          </div>
        </div>

        <p
          style={{
            textAlign: "center",
            fontSize: "1.0625rem",
            color: R.muted,
            marginBottom: 18,
            marginTop: 16,
          }}
        >
          {match.kickoff} · {match.venue}
        </p>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/live"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 600,
              background: R.crimson,
              color: R.white,
            }}
          >
            Live Centre →
          </Link>
          <Link
            href="/worldcup2026/fixtures"
            style={{
              padding: "10px 16px",
              borderRadius: 8,
              fontSize: "1rem",
              fontWeight: 600,
              background: R.white,
              color: R.text,
              border: `1px solid ${R.border}`,
            }}
          >
            Fixtures
          </Link>
        </div>
      </div>
    </article>
  );
}

function Wc26LeadBlock({
  totalMatches,
  gamesPlayed,
  gamesLeft,
}: {
  totalMatches: number;
  gamesPlayed: number;
  gamesLeft: number;
}) {
  return (
    <section aria-labelledby="wc26-lead-heading" style={{ marginBottom: 28 }}>
      <h2 id="wc26-lead-heading" className={styles.sectionTitle}>
        World Cup 2026 — Lead Competition
      </h2>
      <div
        className={styles.wcPanel}
        style={{
          background: R.card,
          border: `1px solid ${R.border}`,
          borderRadius: 12,
          padding: "22px 24px",
          borderLeft: `4px solid ${R.crimson}`,
          boxShadow: "0 4px 18px rgba(92,10,26,0.06)",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 700,
              color: R.crimson,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Current main event on GoalCurrent.online
          </p>
          <p style={{ fontSize: "1.3125rem", fontWeight: 800, color: R.burgundy, marginBottom: 8 }}>
            FIFA World Cup 2026
          </p>
          <p style={{ fontSize: "1.125rem", color: R.muted, lineHeight: 1.55, marginBottom: 16 }}>
            {WC26_TOURNAMENT.hosts.join(" · ")} · 11 Jun – 19 Jul 2026
          </p>
          <Link
            href="/worldcup2026"
            style={{
              display: "inline-block",
              padding: "11px 18px",
              background: R.gold,
              color: R.burgundy,
              borderRadius: 8,
              fontWeight: 700,
              fontSize: "1.0625rem",
            }}
          >
            Tournament hub →
          </Link>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "flex-end" }}>
          {[
            { value: totalMatches, label: "Total matches" },
            { value: gamesPlayed, label: "Games played" },
            { value: gamesLeft, label: "Games left to play", highlight: true },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: stat.highlight ? "#fff5f6" : "#faf6f7",
                border: stat.highlight
                  ? "1px solid rgba(155,27,48,0.3)"
                  : `1px solid ${R.border}`,
                borderRadius: 10,
                padding: "16px 20px",
                textAlign: "center",
                minWidth: 110,
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: stat.highlight ? R.crimson : R.burgundy,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: R.muted,
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FootballNewsCard({
  item,
}: {
  item: (typeof FOOTBALL_NEWS)[number];
}) {
  return (
    <Link
      href={item.href}
      className={styles.newsItem}
      style={{ borderColor: R.border }}
    >
      <div
        className={styles.newsPlaceholder}
        style={{
          background: item.accent,
          color: R.white,
          borderBottom: `2px solid ${R.crimson}`,
          fontSize: "0.8125rem",
          fontWeight: 700,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          padding: "12px 14px",
          height: "auto",
          minHeight: 72,
          flexDirection: "row",
          gap: 10,
        }}
      >
        {"flagTeam" in item && item.flagTeam ? (
          <TeamFlag teamName={item.flagTeam} size={36} />
        ) : null}
        <span>{item.category}</span>
      </div>
      <div className={styles.newsBody}>
        <div className={styles.newsSource} style={{ color: R.crimson, fontSize: "0.875rem" }}>
          {item.category}
        </div>
        <div className={styles.newsHeadline} style={{ fontSize: "1.125rem" }}>
          {item.headline}
        </div>
        <div className={styles.newsTime} style={{ fontSize: "0.9375rem" }}>
          GoalCurrent.online
        </div>
      </div>
    </Link>
  );
}

function FifaPreviewCard({
  preview,
}: {
  preview: (typeof FIFA_MATCH_PREVIEWS)[number];
}) {
  return (
    <article className={styles.previewCard}>
      <div
        style={{
          background: `linear-gradient(135deg, ${R.burgundy} 0%, ${R.darkRed} 100%)`,
          color: R.white,
          padding: "12px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Official FIFA Match Preview
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            background: "rgba(255,255,255,0.15)",
            padding: "4px 10px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          {preview.round}
        </span>
      </div>

      <div style={{ padding: "18px 16px 16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 120px", justifyContent: "flex-end" }}>
            <TeamFlag teamName={preview.home} size={40} />
            <span style={{ fontSize: "1.1875rem", fontWeight: 800 }}>{preview.home}</span>
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: R.muted, flexShrink: 0 }}>vs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 120px", justifyContent: "flex-start" }}>
            <span style={{ fontSize: "1.1875rem", fontWeight: 800 }}>{preview.away}</span>
            <TeamFlag teamName={preview.away} size={40} />
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            marginBottom: 14,
            padding: "12px",
            background: "#faf6f7",
            borderRadius: 8,
            border: `1px solid ${R.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: R.muted, textTransform: "uppercase", marginBottom: 4 }}>
              Kick-off
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{preview.kickoff}</div>
          </div>
          <div>
            <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: R.muted, textTransform: "uppercase", marginBottom: 4 }}>
              Venue
            </div>
            <div style={{ fontSize: "0.9375rem", fontWeight: 600 }}>{preview.venue}</div>
          </div>
        </div>

        <p style={{ fontSize: "1.0625rem", lineHeight: 1.55, color: R.text, marginBottom: 16 }}>
          {preview.teaser}
        </p>

        <Link
          href={preview.href}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "12px 16px",
            background: R.crimson,
            color: R.white,
            borderRadius: 8,
            fontWeight: 700,
            fontSize: "1rem",
          }}
        >
          Read match preview →
        </Link>
      </div>
    </article>
  );
}

export default function Home() {
  const featured = getFeaturedMatch();
  const liveFootballMatches = PLACEHOLDER_MATCHES.filter((m) => m.id !== featured.id);
  const gamesPlayed = getGamesPlayed();
  const gamesLeft = getGamesLeftToPlay();
  const totalMatches = WC26_TOURNAMENT.fixtureCount;

  return (
    <div className={styles.homeRoot}>
      <div className={styles.homePortal}>
        <div className={styles.homePortalInner}>
          <h1
            style={{
              fontSize: "1.625rem",
              fontWeight: 800,
              color: R.burgundy,
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              marginBottom: 10,
            }}
          >
            Football live scores, news &amp; match centre
          </h1>
          <p style={{ fontSize: "1.0625rem", color: R.muted, lineHeight: 1.55, maxWidth: 820 }}>
            GoalCurrent.online is a football news portal — live results, official previews
            and original features.{" "}
            <span
              style={{
                display: "inline-block",
                background: "#fff5f6",
                color: R.crimson,
                fontWeight: 700,
                fontSize: "0.875rem",
                padding: "3px 10px",
                borderRadius: 6,
                border: `1px solid rgba(155,27,48,0.25)`,
                marginTop: 4,
              }}
            >
              World Cup 2026 · lead competition
            </span>
          </p>
        </div>
      </div>

      <main className={styles.homeMain}>
        <div className={styles.sectionBand}>
          <div className={styles.bandLabel}>Match centre</div>

          <section aria-labelledby="featured-match-heading" style={{ marginBottom: 28 }}>
            <h2 id="featured-match-heading" className={styles.sectionTitle}>Featured Match</h2>
            <FeaturedMatchBlock match={featured} />
          </section>

          <section aria-labelledby="live-football-heading">
            <h2 id="live-football-heading" className={styles.sectionTitle}>Live Football</h2>
            <p style={{ fontSize: "1.125rem", color: R.muted, marginBottom: 16 }}>
              Today&apos;s live scores and recent results across world football.
            </p>

            <div className={styles.matchCard} style={{ borderColor: R.border }}>
              <div
                className={styles.matchCardHead}
                style={{
                  background: "#fdf2f4",
                  borderColor: R.border,
                  fontSize: "1.0625rem",
                }}
              >
                <span>Live &amp; recent results</span>
                <span className={styles.updated} style={{ fontSize: "0.875rem" }}>
                  Local demo
                </span>
              </div>

              {liveFootballMatches.map((match) => {
                const score = formatScore(match);
                const homeId = resolveTeamId(match.home);
                const awayId = resolveTeamId(match.away);

                return (
                  <div
                    key={match.id}
                    className={styles.matchRow}
                    style={{ borderColor: R.border, minHeight: 60 }}
                  >
                    <span
                      className={`${styles.statusPill} ${statusPillClass(match.status)}`}
                      style={{ fontSize: "0.875rem" }}
                    >
                      {match.statusLabel}
                    </span>
                    <span
                      className={styles.colHome}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 10,
                        fontSize: MATCH_ROW_TEAM_SIZE,
                        fontWeight: 700,
                      }}
                    >
                      {homeId && getTeamFlagSrc(homeId as TeamId) && (
                        <img
                          src={getTeamFlagSrc(homeId as TeamId)!}
                          alt=""
                          width={ROW_FLAG_W}
                          height={ROW_FLAG_H}
                          style={{ borderRadius: 2 }}
                        />
                      )}
                      {match.home}
                    </span>
                    <span className={styles.colScore} style={{ fontSize: "1.625rem" }}>
                      {score ?? "–"}
                      {match.status === "live" && match.minute != null && (
                        <small className={styles.minLive} style={{ fontSize: "0.75rem" }}>
                          {match.minute}&apos;
                        </small>
                      )}
                    </span>
                    <span
                      className={styles.colAway}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: MATCH_ROW_TEAM_SIZE,
                        fontWeight: 700,
                      }}
                    >
                      {awayId && getTeamFlagSrc(awayId as TeamId) && (
                        <img
                          src={getTeamFlagSrc(awayId as TeamId)!}
                          alt=""
                          width={ROW_FLAG_W}
                          height={ROW_FLAG_H}
                          style={{ borderRadius: 2 }}
                        />
                      )}
                      {match.away}
                    </span>
                  </div>
                );
              })}

              <Link
                href="/live"
                className={styles.matchLink}
                style={{ color: R.crimson, fontSize: "1.0625rem" }}
              >
                Open live scores →
              </Link>
            </div>
          </section>
        </div>

        <Wc26LeadBlock
          totalMatches={totalMatches}
          gamesPlayed={gamesPlayed}
          gamesLeft={gamesLeft}
        />

        <div className={styles.sectionBand}>
          <div className={styles.bandLabel}>News desk</div>

          <section aria-labelledby="news-heading" style={{ marginBottom: 28 }}>
            <h2 id="news-heading" className={styles.sectionTitle}>Latest Football News</h2>
            <p style={{ fontSize: "1.125rem", color: R.muted, marginBottom: 16 }}>
              Football-first coverage — World Cup, domestic leagues, transfers and GoalCurrent editorial.
            </p>
            <div className={styles.newsGrid}>
              {FOOTBALL_NEWS.map((item) => (
                <FootballNewsCard key={item.category} item={item} />
              ))}
            </div>
          </section>

          <section aria-labelledby="fifa-previews-heading" style={{ marginBottom: 28 }}>
            <h2 id="fifa-previews-heading" className={styles.sectionTitle}>
              Official Match Previews
            </h2>
            <p style={{ fontSize: "1.125rem", color: R.muted, marginBottom: 16 }}>
              Official match previews for upcoming World Cup 2026 fixtures — team news,
              form and what to watch before kick-off.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: 14,
              }}
            >
              {FIFA_MATCH_PREVIEWS.map((preview) => (
                <FifaPreviewCard key={preview.id} preview={preview} />
              ))}
            </div>
          </section>

          <section aria-labelledby="feature-article-heading" style={{ marginBottom: 0 }}>
            <h2 id="feature-article-heading" className={styles.sectionTitle}>Featured Article</h2>
            <Link
              href="/news/football-inspiring-canadas-next-generation"
              style={{
                display: "block",
                background: R.card,
                border: `1px solid ${R.border}`,
                borderRadius: 10,
                padding: 22,
                borderLeft: `4px solid ${R.gold}`,
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: R.crimson,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                GoalCurrent Editorial · Toronto
              </span>
              <p style={{ fontSize: "1.375rem", fontWeight: 700, marginTop: 10, lineHeight: 1.35 }}>
                Football Is Inspiring Canada&apos;s Next Generation
              </p>
              <p style={{ fontSize: "1.125rem", color: R.muted, marginTop: 10, lineHeight: 1.55 }}>
                Original photography from Toronto — Radin Hajipour and young players
                discovering the game during the World Cup 2026 era on home soil.
              </p>
              <span
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: R.crimson,
                  marginTop: 12,
                  display: "inline-block",
                }}
              >
                Read the full feature →
              </span>
            </Link>
          </section>
        </div>

        <section aria-labelledby="competitions-heading" style={{ marginBottom: 32 }}>
          <h2 id="competitions-heading" className={styles.sectionTitle}>Competitions</h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 12,
            }}
          >
            {COMPETITIONS.map((c) => (
              <Link
                key={c.href}
                href={c.href}
                style={{
                  background: R.card,
                  border: `1px solid ${R.border}`,
                  borderTop: `3px solid ${R.crimson}`,
                  borderRadius: 10,
                  padding: 18,
                  boxShadow: "0 2px 10px rgba(92,10,26,0.05)",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "1.125rem", marginBottom: 6 }}>
                  {c.label}
                </div>
                <div style={{ fontSize: "1rem", color: R.muted }}>{c.note}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

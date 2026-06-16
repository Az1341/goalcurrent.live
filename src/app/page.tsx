"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState, type CSSProperties } from "react";
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
import { getTeamFlagSrc, getTeamFlagAlt } from "@/lib/teamFlag";
import type { TeamId } from "@/types/team";
import layoutStyles from "@/components/layout/layout.module.css";
import styles from "./page.module.css";

const COOKIE_KEY = "gc_home_cookie_consent_v1";
const SUBSCRIBE_KEY = "gc_home_subscribe_popup_v1";

const HOME_MAX = "98vw";
const FEATURED_FLAG = 56;
const FEATURED_NAME_SIZE = "1.75rem";

const MAIN_NAV = [
  { id: "home", label: "Home", href: "/" },
  { id: "live", label: "Live Scores", href: "/live" },
  { id: "news", label: "News", href: "/news" },
  { id: "favourites", label: "Favourites", href: "/favourites" },
  { id: "wc26", label: "World Cup 2026", href: "/worldcup2026" },
] as const;

const MORE_LINKS = [
  { label: "Overview", href: "/worldcup2026" },
  { label: "Groups", href: "/worldcup2026/groups" },
  { label: "Fixtures", href: "/worldcup2026/fixtures" },
  { label: "Standings", href: "/worldcup2026/standings" },
  { label: "Teams", href: "/worldcup2026/teams" },
  { label: "Venues", href: "/worldcup2026/venues" },
  { label: "Bracket", href: "/worldcup2026/bracket" },
] as const;

const COMPETITION_STRIP = [
  { label: "World Cup 2026", href: "/worldcup2026" },
  { label: "Premier League", href: "/live" },
  { label: "Champions League", href: "/live" },
  { label: "Europa League", href: "/live" },
  { label: "International Football", href: "/live" },
] as const;

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "Terms" },
  { href: "/about", label: "Privacy" },
  { href: "/about", label: "Cookies" },
  { href: "/about", label: "Affiliate Disclosure" },
];

const FOOTER_SOCIAL = [
  { label: "Facebook", href: "https://facebook.com/goalcurrent", text: "Facebook" },
  { label: "Instagram", href: "https://www.instagram.com/goalcurrentlive", text: "Instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@goalcurrent", text: "TikTok" },
  { label: "X / Twitter", href: "https://twitter.com/goalcurrentlive", text: "X" },
] as const;

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

function buildHomeChromeCss() {
  return `
body.gc-home-experiment .${layoutStyles.header} { display: none !important; }
body.gc-home-experiment .${layoutStyles.footer} { display: none !important; }
body.gc-home-experiment .${layoutStyles.overlay} { display: none !important; }
body.gc-home-experiment .${layoutStyles.mobileDrawer} { display: none !important; }
#gc-home-root { overflow-x: hidden; max-width: 100%; }
.gc-home-bar { max-width: 98vw; margin: 0 auto; width: 100%; padding: 0 1vw; }
.gc-home-comp-strip-wrap { background: #ece4e7; border-bottom: 1px solid #ddd0d5; }
.gc-home-comp-strip {
  display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
  -webkit-overflow-scrolling: touch; padding: 10px 1vw;
  max-width: 98vw; margin: 0 auto;
}
.gc-home-comp-strip::-webkit-scrollbar { display: none; }
.gc-home-comp-pill {
  flex-shrink: 0; display: inline-block; padding: 8px 16px; border-radius: 999px;
  font-size: 0.9375rem; font-weight: 700; color: #4a3540; background: #ffffff;
  border: 1px solid #ddd0d5; white-space: nowrap;
}
.gc-home-comp-pill-active { background: #9b1b30; border-color: #9b1b30; color: #ffffff; }
.gc-home-live-ribbon {
  display: flex; align-items: center; gap: 12px; overflow-x: auto; scrollbar-width: none;
  padding: 7px 1vw; max-width: 98vw; margin: 0 auto; background: #1a0a0e; color: #f8f4f5;
  font-size: 0.875rem; font-weight: 600; border-bottom: 2px solid #9b1b30;
}
.gc-home-live-ribbon-label {
  flex-shrink: 0; display: flex; align-items: center; gap: 6px; color: #fbbf24;
  font-size: 0.75rem; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase;
}
.gc-home-live-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #e30613;
  animation: gcHomePulse 1.4s infinite;
}
.gc-home-live-item { flex-shrink: 0; white-space: nowrap; opacity: 0.95; }
.gc-home-nav-desktop { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.gc-home-menu-btn {
  display: none; flex-direction: column; align-items: center; justify-content: center;
  gap: 5px; width: 44px; height: 44px; border: 1px solid rgba(255,255,255,0.22);
  border-radius: 8px; background: rgba(255,255,255,0.1); cursor: pointer; flex-shrink: 0;
}
.gc-home-menu-btn span { display: block; width: 18px; height: 2px; background: #fff; border-radius: 2px; }
.gc-home-mobile-drawer {
  position: fixed; top: 0; left: 0; width: min(320px, 90vw); height: 100vh;
  background: linear-gradient(180deg, #7a1020, #5c0a1a); z-index: 500;
  transform: translateX(-100%); transition: transform 0.28s ease; overflow-y: auto;
  color: #fff; box-shadow: 4px 0 24px rgba(0,0,0,0.25);
}
.gc-home-mobile-drawer.open { transform: translateX(0); }
.gc-home-overlay { display: none; position: fixed; inset: 0; background: rgba(26,8,12,0.55); z-index: 400; }
.gc-home-overlay.open { display: block; }
@keyframes gcHomePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
@media (max-width: 768px) {
  .gc-home-nav-desktop { display: none !important; }
  .gc-home-menu-btn { display: flex !important; }
}
@media (min-width: 769px) {
  .gc-home-mobile-drawer, .gc-home-overlay { display: none !important; }
}
`;
}

const homeChromeCss = buildHomeChromeCss();

function formatScore(match: PlaceholderMatch) {
  const { homeGoals, awayGoals } = match;
  if (homeGoals == null || awayGoals == null) return null;
  return `${homeGoals}–${awayGoals}`;
}

function buildLiveRibbonItems(matches: PlaceholderMatch[]) {
  return matches.map((match) => {
    const score = formatScore(match);
    const teams = score
      ? `${match.home} ${score} ${match.away}`
      : `${match.home} vs ${match.away}`;
    const status =
      match.status === "live"
        ? ""
        : match.status === "ft"
          ? " FT"
          : ` · ${match.statusLabel}`;
    return { id: match.id, text: `${teams}${status}`, isLive: match.status === "live" };
  });
}

function statusPillClass(status: MatchStatus) {
  if (status === "live") return styles.statusLive;
  if (status === "ft") return styles.statusFinished;
  return styles.statusUpcoming;
}

function TeamFlagImg({ teamName, size = 28 }: { teamName: string; size?: number }) {
  const teamId = resolveTeamId(teamName);
  const src = teamId ? getTeamFlagSrc(teamId) : undefined;
  const alt = teamId ? `${getTeamFlagAlt(teamId)} flag` : `${teamName} flag`;
  const height = Math.round(size * 0.75);

  if (!src) {
    return (
      <span
        style={{
          width: size,
          height: height,
          background: R.border,
          borderRadius: 2,
          display: "inline-block",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={height}
      style={{
        width: size,
        height: height,
        objectFit: "cover",
        borderRadius: 2,
        border: `1px solid ${R.border}`,
        display: "block",
      }}
      loading="lazy"
      decoding="async"
    />
  );
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
            <TeamFlagImg teamName={match.home} size={FEATURED_FLAG} />
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
            <TeamFlagImg teamName={match.away} size={FEATURED_FLAG} />
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
          <TeamFlagImg teamName={item.flagTeam} size={36} />
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
            <TeamFlagImg teamName={preview.home} size={40} />
            <span style={{ fontSize: "1.1875rem", fontWeight: 800 }}>{preview.home}</span>
          </div>
          <span style={{ fontSize: "1rem", fontWeight: 700, color: R.muted, flexShrink: 0 }}>vs</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: "1 1 120px", justifyContent: "flex-start" }}>
            <span style={{ fontSize: "1.1875rem", fontWeight: 800 }}>{preview.away}</span>
            <TeamFlagImg teamName={preview.away} size={40} />
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

  const liveRibbonItems = buildLiveRibbonItems(PLACEHOLDER_MATCHES);
  const hasLiveMatch = liveRibbonItems.some((item) => item.isLive);

  const [activeNav, setActiveNav] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);

  function closeMobile() {
    setMobileOpen(false);
  }

  function handleNavClick(id: string) {
    setActiveNav(id);
    setMoreOpen(false);
    closeMobile();
  }

  useLayoutEffect(() => {
    document.body.classList.add("gc-home-experiment");
    return () => document.body.classList.remove("gc-home-experiment");
  }, []);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_KEY)) setCookieOpen(true);
    } catch {
      /* private mode */
    }
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBSCRIBE_KEY)) return;
      const t = window.setTimeout(() => setSubscribeOpen(true), 1200);
      return () => window.clearTimeout(t);
    } catch {
      /* private mode */
    }
  }, []);

  function acceptCookies() {
    try {
      localStorage.setItem(COOKIE_KEY, "1");
    } catch {
      /* ignore */
    }
    setCookieOpen(false);
  }

  function dismissSubscribe() {
    try {
      localStorage.setItem(SUBSCRIBE_KEY, "1");
    } catch {
      /* ignore */
    }
    setSubscribeOpen(false);
  }

  const contentWrap: CSSProperties = {
    maxWidth: HOME_MAX,
    width: "100%",
    margin: "0 auto",
    padding: "0 1vw",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeChromeCss }} />

      <div id="gc-home-root" className={styles.homeRoot}>
        <header
          role="banner"
          style={{
            background: `linear-gradient(180deg, ${R.darkRed} 0%, ${R.burgundy} 100%)`,
            color: R.white,
            borderBottom: `3px solid ${R.crimson}`,
            position: "sticky",
            top: 0,
            zIndex: 300,
            boxShadow: "0 4px 20px rgba(92,10,26,0.22)",
          }}
        >
          <div
            className="gc-home-bar"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              padding: "14px 16px 10px",
            }}
          >
            <Link href="/" onClick={closeMobile} style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <div style={{ borderRadius: 10, border: `2px solid ${R.gold}`, padding: 2, lineHeight: 0, flexShrink: 0 }}>
                <Image src="/logo.svg" alt="" width={54} height={54} priority />
              </div>
              <div>
                <div style={{ fontSize: "1.875rem", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                  Goal<span style={{ color: R.gold }}>Current</span>.online
                </div>
                <div style={{ fontSize: "0.9375rem", opacity: 0.88, marginTop: 5, fontWeight: 500 }}>
                  Independent football media · live scores &amp; news
                </div>
              </div>
            </Link>
            <button
              type="button"
              className="gc-home-menu-btn"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              <span /><span /><span />
            </button>
          </div>

          <nav aria-label="Main" className="gc-home-bar gc-home-nav-desktop" style={{ paddingBottom: 10 }}>
            {MAIN_NAV.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => handleNavClick(item.id)}
                  style={{
                    padding: "10px 16px",
                    borderRadius: 6,
                    fontSize: "1rem",
                    fontWeight: 600,
                    background: isActive ? R.crimson : "rgba(255,255,255,0.1)",
                    border: isActive ? `1px solid ${R.gold}` : "1px solid rgba(255,255,255,0.14)",
                    color: R.white,
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
            <div style={{ position: "relative" }}>
              <button
                type="button"
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
                style={{
                  padding: "10px 16px",
                  borderRadius: 6,
                  fontSize: "1rem",
                  fontWeight: 600,
                  background: moreOpen ? R.crimson : "rgba(255,255,255,0.1)",
                  border: moreOpen ? `1px solid ${R.gold}` : "1px solid rgba(255,255,255,0.14)",
                  color: R.white,
                  cursor: "pointer",
                }}
              >
                More ▾
              </button>
              {moreOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    marginTop: 6,
                    minWidth: 180,
                    background: R.white,
                    border: `1px solid ${R.border}`,
                    borderRadius: 8,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    zIndex: 50,
                    overflow: "hidden",
                  }}
                >
                  {MORE_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => { setMoreOpen(false); closeMobile(); }}
                      style={{
                        display: "block",
                        padding: "11px 14px",
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: R.text,
                        borderBottom: `1px solid ${R.border}`,
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </header>

        <div className="gc-home-comp-strip-wrap">
          <nav aria-label="Competitions" className="gc-home-comp-strip">
            {COMPETITION_STRIP.map((comp) => (
              <Link
                key={comp.label}
                href={comp.href}
                className={`gc-home-comp-pill ${comp.label === "World Cup 2026" ? "gc-home-comp-pill-active" : ""}`}
              >
                {comp.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="gc-home-live-ribbon" role="region" aria-label="Live scores ticker">
          <span className="gc-home-live-ribbon-label">
            {hasLiveMatch && <span className="gc-home-live-dot" aria-hidden="true" />}
            {hasLiveMatch ? "LIVE NOW" : "RESULTS"}
          </span>
          {liveRibbonItems.map((item, index) => (
            <span key={item.id} className="gc-home-live-item">
              {index > 0 ? " • " : ""}
              {item.text}
            </span>
          ))}
        </div>

        <div
          className={`gc-home-overlay ${mobileOpen ? "open" : ""}`}
          onClick={closeMobile}
          aria-hidden={!mobileOpen}
        />
        <nav
          className={`gc-home-mobile-drawer ${mobileOpen ? "open" : ""}`}
          aria-label="Mobile navigation"
          aria-hidden={!mobileOpen}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            <span style={{ fontWeight: 700, fontSize: "1.0625rem" }}>Menu</span>
            <button type="button" onClick={closeMobile} aria-label="Close menu" style={{ background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: "1.125rem", cursor: "pointer" }}>✕</button>
          </div>
          <div style={{ padding: "12px 10px" }}>
            <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5, padding: "8px 10px 4px" }}>Main</div>
            {MAIN_NAV.map((item) => (
              <Link key={item.id} href={item.href} onClick={() => handleNavClick(item.id)} style={{ display: "block", padding: "12px 14px", borderRadius: 8, fontSize: "1.0625rem", fontWeight: 600, background: activeNav === item.id ? R.crimson : "transparent", marginBottom: 4 }}>
                {item.label}
              </Link>
            ))}
            <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5, padding: "16px 10px 4px" }}>Competitions</div>
            {COMPETITION_STRIP.map((comp) => (
              <Link key={comp.label} href={comp.href} onClick={closeMobile} style={{ display: "block", padding: "11px 14px", borderRadius: 8, fontSize: "1rem", fontWeight: 500, opacity: 0.92 }}>
                {comp.label}
              </Link>
            ))}
            <div style={{ fontSize: "0.625rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.5, padding: "16px 10px 4px" }}>More — World Cup 2026</div>
            {MORE_LINKS.map((link) => (
              <Link key={link.label} href={link.href} onClick={() => { handleNavClick("wc26"); closeMobile(); }} style={{ display: "block", padding: "11px 14px", borderRadius: 8, fontSize: "1rem", fontWeight: 500, opacity: 0.92 }}>
                {link.label}
              </Link>
            ))}
          </div>
        </nav>

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

        <footer
          style={{
            background: R.footerBg,
            color: R.footerText,
            borderTop: `2px solid ${R.footerBorder}`,
            padding: "28px 1vw",
          }}
        >
          <div style={contentWrap}>
            <nav style={{ display: "flex", flexWrap: "wrap", gap: 14, marginBottom: 16, fontSize: "1rem", fontWeight: 600 }} aria-label="Footer">
              {FOOTER_LINKS.map((link) => (
                <Link key={link.label} href={link.href} style={{ color: R.crimson }}>{link.label}</Link>
              ))}
            </nav>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 18 }} aria-label="Social media">
              {FOOTER_SOCIAL.map((social) => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${R.footerBorder}`, background: R.white, color: R.crimson, fontSize: "0.9375rem", fontWeight: 600 }}>
                  {social.text}
                </a>
              ))}
            </div>
            <div role="complementary" aria-label="Affiliate promotion" style={{ background: "#ede4e8", border: `1px solid ${R.footerBorder}`, borderRadius: 10, padding: "14px 16px", marginBottom: 18, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 12, fontSize: "0.9375rem", color: R.footerText }}>
              <span>🔒 Stream securely abroad — NordVPN affiliate placeholder</span>
              <span style={{ fontSize: "0.625rem", fontWeight: 700, border: `1px solid ${R.footerBorder}`, padding: "3px 7px", borderRadius: 4, color: R.muted }}>AD</span>
              <a href="#" onClick={(e) => e.preventDefault()} style={{ background: R.gold, color: R.burgundy, padding: "7px 14px", borderRadius: 6, fontWeight: 700, fontSize: "0.875rem" }}>Get NordVPN →</a>
            </div>
            <p style={{ fontSize: "0.9375rem", lineHeight: 1.65, color: R.muted }}>
              © 2026 Ashna4All · Ahmad Zafarani · GoalCurrent.online independent fan site · Not affiliated with FIFA, UEFA or the Premier League.
            </p>
          </div>
        </footer>

      {cookieOpen && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          style={{
            position: "fixed",
            bottom: 16,
            left: 16,
            right: 16,
            maxWidth: 520,
            margin: "0 auto",
            background: R.card,
            border: `1px solid ${R.border}`,
            borderRadius: 10,
            padding: 18,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            zIndex: 9000,
          }}
        >
          <p style={{ fontSize: "1rem", marginBottom: 14, lineHeight: 1.5 }}>
            We use cookies to personalise content and analyse traffic.{" "}
            <Link href="/about" style={{ color: R.crimson, fontWeight: 600 }}>
              Cookie Policy
            </Link>
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="button"
              onClick={() => setCookieOpen(false)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: `1px solid ${R.border}`,
                background: R.white,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Decline
            </button>
            <button
              type="button"
              onClick={acceptCookies}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                border: "none",
                background: R.crimson,
                color: R.white,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Accept ✓
            </button>
          </div>
        </div>
      )}

      {subscribeOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,8,12,0.55)",
            zIndex: 8999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
          role="dialog"
          aria-label="Subscribe"
        >
          <div
            style={{
              background: R.white,
              borderRadius: 12,
              padding: 26,
              maxWidth: 440,
              width: "100%",
              borderTop: `4px solid ${R.gold}`,
            }}
          >
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: 10 }}>
              ⚽ Stay ahead of the game
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: R.muted,
                marginBottom: 18,
                lineHeight: 1.55,
              }}
            >
              Get World Cup 2026 goals, results and news straight to your inbox.
              Homepage placeholder — no tracking yet.
            </p>
            <input
              type="email"
              placeholder="Your email"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: `1px solid ${R.border}`,
                borderRadius: 8,
                marginBottom: 14,
                fontSize: "1rem",
              }}
              readOnly
              aria-label="Email placeholder"
            />
            <button
              type="button"
              onClick={dismissSubscribe}
              style={{
                width: "100%",
                padding: "12px",
                background: R.crimson,
                color: R.white,
                border: "none",
                borderRadius: 8,
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              Subscribe (placeholder)
            </button>
            <button
              type="button"
              onClick={dismissSubscribe}
              style={{
                width: "100%",
                marginTop: 10,
                padding: "10px",
                background: "transparent",
                border: "none",
                color: R.muted,
                fontSize: "0.9375rem",
              }}
            >
              No thanks
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

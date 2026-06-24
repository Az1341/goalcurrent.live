"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { PlClub } from "@/data/pl-clubs";
import { PlTeamLogo } from "@/components/pl/PlShared";
import PlFixtureCard from "@/components/pl/PlFixtureCard";
import type { PlFixtureRow, PlFixturesApiResponse, PlStandingRow, PlStandingsApiResponse } from "@/lib/pl/types";
import { PL_LEAGUE_NAME } from "@/lib/pl/constants";
import {
  computePlFormFromFixtures,
  getLatestPlResult,
  getNextPlFixture,
  getPlH2H,
  parseStandingForm,
} from "@/lib/team-profile/fixture-utils";
import ProfileFormStrip from "./ProfileFormStrip";
import ProfileGossipSection from "./ProfileGossipSection";
import ProfileHistorySection from "./ProfileHistorySection";
import ProfileH2HSection, { type H2HMatch } from "./ProfileH2HSection";
import ProfileInjurySection from "./ProfileInjurySection";
import ProfileNewsSection from "./ProfileNewsSection";
import ProfileSection from "./ProfileSection";
import ProfileVideoSection from "./ProfileVideoSection";
import ProfileFallback from "./ProfileFallback";
import styles from "./team-profile.module.css";

function formatKickoff(kickoffUtc: string): string {
  const date = new Date(kickoffUtc);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function ordinal(rank: number): string {
  const suffix = ["th", "st", "nd", "rd"];
  const mod = rank % 100;
  return `${rank}${suffix[(mod - 20) % 10] ?? suffix[mod] ?? suffix[0]}`;
}

export default function PlClubProfileClient({ club }: { club: PlClub }) {
  const [fixtures, setFixtures] = useState<PlFixtureRow[]>([]);
  const [standing, setStanding] = useState<PlStandingRow | null>(null);
  const [teamLogo, setTeamLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const aliases = useMemo(() => [club.shortName], [club.shortName]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const [fixturesRes, standingsRes, teamsRes] = await Promise.all([
          fetch("/api/pl/fixtures", { cache: "no-store" }),
          fetch("/api/pl/standings", { cache: "no-store" }),
          fetch("/api/pl/teams", { cache: "no-store" }),
        ]);
        if (cancelled) return;
        if (fixturesRes.ok) {
          const body = (await fixturesRes.json()) as PlFixturesApiResponse;
          setFixtures(body.fixtures ?? []);
        }
        if (standingsRes.ok) {
          const body = (await standingsRes.json()) as PlStandingsApiResponse;
          const row = body.standings?.find((entry) =>
            entry.teamName.toLowerCase() === club.name.toLowerCase() ||
            entry.teamName.toLowerCase().includes(club.shortName.toLowerCase()),
          );
          setStanding(row ?? null);
        }
        if (teamsRes.ok) {
          const body = (await teamsRes.json()) as { teams?: { name: string; logo: string | null }[] };
          const team = body.teams?.find((entry) =>
            entry.name.toLowerCase() === club.name.toLowerCase() ||
            entry.name.toLowerCase().includes(club.shortName.toLowerCase()),
          );
          setTeamLogo(team?.logo ?? null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [club.name, club.shortName]);

  const latest = useMemo(() => getLatestPlResult(fixtures, club.name, aliases), [fixtures, club.name, aliases]);
  const next = useMemo(() => getNextPlFixture(fixtures, club.name, aliases), [fixtures, club.name, aliases]);
  const form = useMemo(() => {
    const fromStanding = parseStandingForm(standing?.form);
    return fromStanding.length ? fromStanding : computePlFormFromFixtures(fixtures, club.name, aliases);
  }, [standing?.form, fixtures, club.name, aliases]);

  const teamFixtures = useMemo(() => {
    return fixtures
      .filter((fixture) =>
        fixture.homeTeamName.toLowerCase().includes(club.name.toLowerCase()) ||
        fixture.awayTeamName.toLowerCase().includes(club.name.toLowerCase()) ||
        fixture.homeTeamName.toLowerCase().includes(club.shortName.toLowerCase()) ||
        fixture.awayTeamName.toLowerCase().includes(club.shortName.toLowerCase()),
      )
      .sort((a, b) => new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime());
  }, [fixtures, club.name, club.shortName]);

  const upcoming = teamFixtures.filter((f) => f.status === "UPCOMING" || f.status === "LIVE");
  const results = teamFixtures.filter((f) => f.status === "FT").sort((a, b) => new Date(b.kickoffUtc).getTime() - new Date(a.kickoffUtc).getTime());

  const nextOpponent = useMemo(() => {
    if (!next) return null;
    const isHome = next.homeTeamName.toLowerCase().includes(club.name.toLowerCase()) || next.homeTeamName.toLowerCase().includes(club.shortName.toLowerCase());
    return isHome ? next.awayTeamName : next.homeTeamName;
  }, [next, club.name, club.shortName]);

  const h2hMatches: H2HMatch[] = useMemo(() => {
    if (!nextOpponent) return [];
    return getPlH2H(fixtures, club.name, nextOpponent, aliases).slice(0, 5).map((fixture) => ({
      id: String(fixture.fixtureId),
      label: `${fixture.homeTeamName} vs ${fixture.awayTeamName}`,
      score: `${fixture.homeScore ?? 0}-${fixture.awayScore ?? 0}`,
      date: formatKickoff(fixture.kickoffUtc),
    }));
  }, [fixtures, club.name, aliases, nextOpponent]);

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <Link href="/premier-league">Premier League</Link> / <Link href="/premier-league/clubs">Clubs</Link> / <strong>{club.name}</strong>
      </nav>
      <header className={styles.hero}>
        <PlTeamLogo name={club.name} logo={teamLogo} size={56} rounded />
        <div className={styles.heroText}>
          <h1 className={styles.heroTitle}>{club.emoji} {club.name}</h1>
          <p className={styles.heroMeta}>{PL_LEAGUE_NAME} - {club.stadium} - Manager: {club.manager}</p>
          <p className={styles.heroSummary}>{club.description}</p>
        </div>
      </header>
      <div className={styles.statsRow}>
        <div className={styles.statCard}><div className={styles.statValue}>{standing ? ordinal(standing.rank) : ordinal(club.position)}</div><div className={styles.statLabel}>League position</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{standing?.points ?? "-"}</div><div className={styles.statLabel}>Points</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{club.plTitles}</div><div className={styles.statLabel}>PL titles</div></div>
        <div className={styles.statCard}><div className={styles.statValue}>{club.capacity}</div><div className={styles.statLabel}>Capacity</div></div>
      </div>
      <ProfileSection id="profile-form" title="Current form">{form.length ? <ProfileFormStrip form={form} /> : <ProfileFallback message="Form will appear once matches are played." />}</ProfileSection>
      <ProfileSection id="profile-latest" title="Latest result">
        {loading ? <p className={styles.loading}>Loading...</p> : latest ? (
          <div className={styles.matchHighlight}>
            <span className={styles.matchTeams}>{latest.homeTeamName} vs {latest.awayTeamName}</span>
            <span className={styles.matchScore}>{latest.homeScore ?? 0} - {latest.awayScore ?? 0}</span>
            <span className={styles.matchMeta}>{formatKickoff(latest.kickoffUtc)} - {latest.venue ?? "TBC"}</span>
            <Link href={`/match/${latest.fixtureId}`}>View match</Link>
          </div>
        ) : <ProfileFallback message="No results available yet." />}
      </ProfileSection>
      <ProfileSection id="profile-next" title="Next match">{loading ? <p className={styles.loading}>Loading...</p> : next ? <PlFixtureCard fixture={next} /> : <ProfileFallback message="No upcoming fixtures scheduled yet." />}</ProfileSection>
      <ProfileSection id="profile-fixtures" title="Fixtures and results">
        {loading ? <p className={styles.loading}>Loading...</p> : teamFixtures.length ? (
          <>
            {upcoming.length ? (<><p className={styles.sectionBody}>Upcoming</p><ul className={styles.fixtureList}>{upcoming.slice(0, 5).map((fixture) => (<li key={fixture.fixtureId} className={styles.fixtureRow}><span>{fixture.homeTeamName} vs {fixture.awayTeamName}</span><Link href={`/match/${fixture.fixtureId}`}>{formatKickoff(fixture.kickoffUtc)}</Link></li>))}</ul></>) : null}
            {results.length ? (<><p className={styles.sectionBody}>Results</p><ul className={styles.fixtureList}>{results.slice(0, 5).map((fixture) => (<li key={fixture.fixtureId} className={styles.fixtureRow}><span>{fixture.homeTeamName} {fixture.homeScore ?? 0}-{fixture.awayScore ?? 0} {fixture.awayTeamName}</span><Link href={`/match/${fixture.fixtureId}`}>Details</Link></li>))}</ul></>) : null}
          </>
        ) : <ProfileFallback message="Fixtures and results will appear when available." />}
      </ProfileSection>
      <ProfileNewsSection keywords={[club.name, club.shortName, "Premier League"]} />
      <ProfileHistorySection summary={club.description} achievements={[`${club.plTitles} Premier League title${club.plTitles === 1 ? "" : "s"}`, `Founded ${club.founded}`, `Home: ${club.stadium} (${club.capacity})`]} />
      <ProfileGossipSection variant="pl" entityName={club.name} />
      <ProfileInjurySection variant="pl" entityName={club.name} />
      <ProfileVideoSection />
      <ProfileH2HSection opponentName={nextOpponent} matches={h2hMatches} />
      <nav className={styles.navRow}>
        <Link href="/premier-league/clubs" className={styles.navLink}>All clubs</Link>
        <Link href="/premier-league/table" className={`${styles.navLink} ${styles.navLinkPrimary}`}>PL table</Link>
        <Link href="/premier-league/fixtures" className={styles.navLink}>Fixtures</Link>
      </nav>
    </main>
  );
}
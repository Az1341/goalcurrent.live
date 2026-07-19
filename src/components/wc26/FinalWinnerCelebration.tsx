"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TeamFlag from "@/components/TeamFlag";
import { getTeamById } from "@/data/wc26";
import { LIVE_API_PATHS, useLiveApi } from "@/lib/client/live-data";
import { LIVE_POLL_MATCH_MS } from "@/lib/client/fetcher";
import {
  resolveFinalWinner,
  WC26_FINAL_FIXTURE_ID,
  WC26_FINAL_MATCH_NUMBER,
  type FinalWinnerResult,
} from "@/lib/wc26/final-winner";
import type { TeamId } from "@/types/team";
import type { Wc26ApiMatch, Wc26ScoresApiResponse } from "@/types/fixture-overlay";
import styles from "./FinalWinnerCelebration.module.css";

const STORAGE_PREFIX = "gc:final-winner:dismissed:";
const TROPHY = "\u{1F3C6}";

const CONFETTI = [
  ["9%", "14%", "gold", "18deg"],
  ["16%", "31%", "white", "-24deg"],
  ["22%", "73%", "blue", "65deg"],
  ["31%", "10%", "blue", "-12deg"],
  ["37%", "84%", "gold", "42deg"],
  ["46%", "17%", "white", "76deg"],
  ["58%", "88%", "blue", "-34deg"],
  ["66%", "12%", "gold", "61deg"],
  ["72%", "78%", "white", "-65deg"],
  ["79%", "20%", "blue", "22deg"],
  ["86%", "69%", "gold", "-48deg"],
  ["92%", "36%", "white", "83deg"],
] as const;

type CelebrationView = FinalWinnerResult & {
  readonly winnerName: string;
  readonly opponentName: string;
};

function buildPreview(side: "home" | "away"): Wc26ApiMatch {
  return {
    fixtureId: WC26_FINAL_FIXTURE_ID,
    matchNumber: WC26_FINAL_MATCH_NUMBER,
    status: "finished",
    statusShort: "FT",
    elapsed: 120,
    homeScore: side === "home" ? 3 : 2,
    awayScore: side === "away" ? 3 : 2,
    kickoffUtc: "2026-07-19T19:00:00.000Z",
    homeTeamId: "esp",
    awayTeamId: "arg",
    apiFixtureId: 53452537,
  };
}

function readPreviewMatch(): Wc26ApiMatch | null {
  if (process.env.NODE_ENV !== "development" || typeof window === "undefined") {
    return null;
  }
  const side = new URLSearchParams(window.location.search).get("winnerPreview");
  return side === "home" || side === "away" ? buildPreview(side) : null;
}

function pickFinalMatch(
  ...sources: Array<Wc26ScoresApiResponse | undefined>
): Wc26ApiMatch | null {
  for (const source of sources) {
    const matches = Array.isArray(source?.matches) ? source.matches : [];
    const found = matches.find(
      (match) =>
        match.fixtureId === WC26_FINAL_FIXTURE_ID ||
        match.matchNumber === WC26_FINAL_MATCH_NUMBER,
    );
    if (found) return found;
  }
  return null;
}

function toCelebrationView(result: FinalWinnerResult | null): CelebrationView | null {
  if (!result) return null;
  const winner = getTeamById(result.winnerTeamId);
  const opponent = getTeamById(result.opponentTeamId);
  if (!winner || !opponent) return null;
  return { ...result, winnerName: winner.name, opponentName: opponent.name };
}

function storageKey(resultKey: string): string {
  return `${STORAGE_PREFIX}${resultKey}`;
}

export default function FinalWinnerCelebration() {
  const { data: liveData } = useLiveApi<Wc26ScoresApiResponse>(LIVE_API_PATHS.wc26LiveScores, {
    fresh: true,
    refreshInterval: LIVE_POLL_MATCH_MS,
  });
  const { data: resultsData } = useLiveApi<Wc26ScoresApiResponse>(LIVE_API_PATHS.wc26Results, {
    fresh: true,
    refreshInterval: LIVE_POLL_MATCH_MS,
  });
  const [previewMatch, setPreviewMatch] = useState<Wc26ApiMatch | null>(null);
  const [dismissed, setDismissed] = useState<boolean | null>(null);

  useEffect(() => {
    setPreviewMatch(readPreviewMatch());
  }, []);

  const finalMatch = previewMatch ?? pickFinalMatch(liveData, resultsData);
  const result = useMemo(
    () => toCelebrationView(resolveFinalWinner(finalMatch)),
    [finalMatch],
  );

  useEffect(() => {
    if (!result) {
      setDismissed(null);
      return;
    }
    try {
      setDismissed(localStorage.getItem(storageKey(result.resultKey)) === "1");
    } catch {
      setDismissed(false);
    }
  }, [result]);

  useEffect(() => {
    if (!result || dismissed !== false) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        try { localStorage.setItem(storageKey(result.resultKey), "1"); } catch { /* ignore */ }
        setDismissed(true);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismissed, result]);

  if (!result || dismissed == null) return null;

  const dismiss = () => {
    try { localStorage.setItem(storageKey(result.resultKey), "1"); } catch { /* ignore */ }
    setDismissed(true);
  };

  const matchHref = `/match/${WC26_FINAL_FIXTURE_ID}`;
  const highlightsHref = `${matchHref}#match-highlights-heading`;

  if (dismissed) {
    return (
      <Link
        href={matchHref}
        className={styles.banner}
        aria-label={`${result.winnerName} won the World Cup final. View the full match breakdown.`}
      >
        <span className={styles.bannerTrophy} aria-hidden="true">{TROPHY}</span>
        <span>
          <strong>{result.winnerName}</strong> won today&apos;s final — tap for full breakdown
        </span>
        <span className={styles.bannerChevron} aria-hidden="true">›</span>
      </Link>
    );
  }

  return (
    <div className={styles.overlay} onMouseDown={dismiss}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.confetti} aria-hidden="true">
        {CONFETTI.map(([top, left, tone, rotate], index) => (
          <i
            key={`${top}-${left}`}
            className={`${styles.confettiPiece} ${styles[tone]}`}
            style={{
              top,
              left,
              transform: `rotate(${rotate})`,
              animationDelay: `${index * -0.11}s`,
            }}
          />
        ))}
      </div>

      <section
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="final-winner-title"
        aria-describedby="final-winner-score"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={dismiss} aria-label="Dismiss winner announcement">
          ×
        </button>
        <div className={styles.trophy} aria-hidden="true">{TROPHY}</div>
        <div className={styles.winnerBlock}>
          <p className={styles.eyebrow}>{TROPHY} Match winner confirmed!</p>
          <div className={styles.winnerRow}>
            <h2 id="final-winner-title">{result.winnerName}</h2>
            <span className={styles.flag}>
              <TeamFlag teamId={result.winnerTeamId as TeamId} size={36} />
            </span>
          </div>
        </div>
        <div className={styles.scoreBlock} id="final-winner-score">
          <p className={styles.score}>
            {result.homeScore} <span>—</span> {result.awayScore}
          </p>
          {result.decidedOnPenalties ? (
            <p className={styles.penalties}>
              Penalties {result.penaltiesHome}–{result.penaltiesAway}
            </p>
          ) : null}
          <p className={styles.opponent}>vs {result.opponentName}</p>
        </div>
        <div className={styles.actions}>
          <Link href={matchHref} className={styles.primaryAction} onClick={dismiss}>
            View Match Summary
          </Link>
          <Link href={highlightsHref} className={styles.secondaryAction} onClick={dismiss}>
            Watch Key Highlights
          </Link>
        </div>
        <button type="button" className={styles.dismissText} onClick={dismiss}>
          Tap anywhere to dismiss
        </button>
      </section>
    </div>
  );
}

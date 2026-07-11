"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./match-kickoff-countdown.module.css";

type MatchKickoffCountdownProps = {
  kickoffUtc: string;
};

function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(remainingMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** Compact kick-off countdown for fixture cards. */
export default function MatchKickoffCountdown({
  kickoffUtc,
}: MatchKickoffCountdownProps) {
  const kickoffMs = useMemo(
    () => new Date(kickoffUtc).getTime(),
    [kickoffUtc],
  );

  const [remainingMs, setRemainingMs] = useState(() =>
    Math.max(0, kickoffMs - Date.now()),
  );

  useEffect(() => {
    const tick = () => {
      setRemainingMs(Math.max(0, kickoffMs - Date.now()));
    };

    tick();
    const id = window.setInterval(tick, 1_000);
    return () => window.clearInterval(id);
  }, [kickoffMs]);

  if (remainingMs <= 0) {
    return null;
  }

  return (
    <span className={styles.countdown} aria-live="polite">
      Starts in {formatRemaining(remainingMs)}
    </span>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";
import type { ScoreBatHighlight } from "@/lib/scorebat/types";
import matchStyles from "@/components/match/match.module.css";
import styles from "./ScoreBatEmbed.module.css";

const LOAD_TIMEOUT_MS = 10_000;

type MatchHighlightsSectionProps = {
  highlight: ScoreBatHighlight;
};

/**
 * Match highlights from ScoreBat — section stays hidden until the iframe loads.
 * Removed entirely on timeout or error (no blocked placeholder).
 */
export function MatchHighlightsSection({ highlight }: MatchHighlightsSectionProps) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const readyRef = useRef(false);

  useEffect(() => {
    readyRef.current = false;
    setReady(false);
    setFailed(false);

    const timeoutId = window.setTimeout(() => {
      if (!readyRef.current) {
        setFailed(true);
      }
    }, LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [highlight.embedUrl]);

  if (failed) {
    return null;
  }

  const handleLoad = () => {
    readyRef.current = true;
    setReady(true);
  };

  const handleError = () => {
    setFailed(true);
  };

  return (
    <section
      className={ready ? matchStyles.section : undefined}
      aria-labelledby={ready ? "match-highlights-heading" : undefined}
      aria-hidden={ready ? undefined : true}
      style={
        ready
          ? undefined
          : {
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }
      }
    >
      {ready ? (
        <h2 id="match-highlights-heading" className={matchStyles.sectionTitle}>
          Match highlights
        </h2>
      ) : null}
      <div className={`${styles.scorebatWrap} ${ready ? styles.scorebatWrapReady : ""}`.trim()}>
        <iframe
          src={highlight.embedUrl}
          title={highlight.title}
          className={styles.iframe}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </section>
  );
}
"use client";

import {
  useEffect,
  useState,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import styles from "./BracketView.module.css";

const SCROLL_STEP = 320;

type BracketFitViewportProps = {
  naturalWidth: number;
  naturalHeight: number;
  children: ReactNode;
};

export default function BracketFitViewport({
  naturalWidth,
  naturalHeight,
  children,
}: BracketFitViewportProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateAffordance = useCallback(() => {
    const el = scrollRef.current;
    if (!el) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < maxScroll - 4);
  }, []);

  const scrollBy = useCallback((delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  }, []);

  useEffect(() => {
    updateAffordance();
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    const onScroll = () => updateAffordance();
    el.addEventListener("scroll", onScroll, { passive: true });

    const observer = new ResizeObserver(updateAffordance);
    observer.observe(el);

    window.addEventListener("resize", updateAffordance);
    return () => {
      el.removeEventListener("scroll", onScroll);
      observer.disconnect();
      window.removeEventListener("resize", updateAffordance);
    };
  }, [naturalWidth, naturalHeight, updateAffordance]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
      updateAffordance();
    }
  }, [naturalWidth, naturalHeight, updateAffordance]);

  return (
    <div className={styles.fitStage}>
      <p className={styles.scrollHint}>
        Scroll horizontally to see the full bracket
      </p>
      <div
        className={[
          styles.scrollRail,
          canScrollLeft ? styles.scrollRailShowLeft : "",
          canScrollRight ? styles.scrollRailShowRight : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {canScrollLeft ? (
          <button
            type="button"
            className={`${styles.scrollAffordance} ${styles.scrollAffordanceLeft}`}
            onClick={() => scrollBy(-SCROLL_STEP)}
            aria-label="Scroll bracket left"
          >
            ‹
          </button>
        ) : null}
        {canScrollRight ? (
          <button
            type="button"
            className={`${styles.scrollAffordance} ${styles.scrollAffordanceRight}`}
            onClick={() => scrollBy(SCROLL_STEP)}
            aria-label="Scroll bracket right"
          >
            ›
          </button>
        ) : null}
        <div
          ref={scrollRef}
          className={styles.scrollWrap}
          tabIndex={0}
          role="region"
          aria-label="Knockout bracket"
        >
          <div
            className={styles.bracketShell}
            style={{ width: naturalWidth, minHeight: naturalHeight }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

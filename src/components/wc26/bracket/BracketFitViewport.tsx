"use client";

import { useEffect, useState, useRef, useCallback, type ReactNode } from "react";
import styles from "./BracketView.module.css";

const FIT_SCALE_MIN = 0.72;

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
  const stageRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<"fit" | "scroll">("fit");
  const [scale, setScale] = useState(1);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const available = stage.clientWidth;
    if (available <= 0) {
      return;
    }
    const nextScale = Math.min(1, available / naturalWidth);
    if (nextScale < FIT_SCALE_MIN) {
      setLayout("scroll");
      setScale(1);
      return;
    }
    setLayout("fit");
    setScale(nextScale);
  }, [naturalWidth]);

  useEffect(() => {
    measure();
    const stage = stageRef.current;
    if (!stage) {
      return;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  useEffect(() => {
    if (layout === "scroll" && scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [layout, naturalWidth]);

  if (layout === "scroll") {
    return (
      <div ref={stageRef} className={styles.fitStage}>
        <p className={styles.scrollHint} aria-hidden="true">
          Scroll horizontally to see the full bracket
        </p>
        <div ref={scrollRef} className={styles.scrollWrap}>
          <div className={styles.bracketShell} style={{ width: naturalWidth }}>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={stageRef} className={styles.fitStage}>
      <div className={styles.fitInner} style={{ height: naturalHeight * scale }}>
        <div
          className={styles.fitScaled}
          style={{ width: naturalWidth, transform: `scale(${scale})` }}
        >
          <div className={styles.bracketShell} style={{ width: naturalWidth }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
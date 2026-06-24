"use client";

import { useEffect, useRef, useState } from "react";

type ScoreBatEmbedProps = {
  /** Raw embed HTML from ScoreBat (iframe snippet). */
  embedHtml: string;
  title?: string;
  minHeight?: number;
};

/**
 * Lazy-loads ScoreBat video embeds when near the viewport to protect LCP/CLS.
 */
export function ScoreBatEmbed({
  embedHtml,
  title = "Match highlights",
  minHeight = 280,
}: ScoreBatEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !embedHtml.trim()) {
      return undefined;
    }

    if (typeof IntersectionObserver === "undefined") {
      setShouldRender(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) {
          return;
        }
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin: "160px 0px" },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [embedHtml]);

  if (!embedHtml.trim()) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      style={{
        minHeight,
        aspectRatio: "16 / 9",
        width: "100%",
        background: "#0f172a",
        borderRadius: 8,
        overflow: "hidden",
      }}
      aria-label={title}
    >
      {shouldRender ? (
        <div
          style={{ width: "100%", height: "100%" }}
          dangerouslySetInnerHTML={{ __html: embedHtml }}
        />
      ) : null}
    </div>
  );
}

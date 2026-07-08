"use client";

import { useMemo } from "react";
import useSWR from "swr";
import { Link } from "@/i18n/navigation";
import { fetcher } from "@/lib/client/fetcher";
import type { VideosApiResponse, YouTubeVideo } from "@/types/video";
import styles from "../home-v5.module.css";

function dedupeVideos(videos: readonly YouTubeVideo[]): YouTubeVideo[] {
  const seen = new Set<string>();
  const unique: YouTubeVideo[] = [];
  for (const video of videos) {
    const key = video.videoId || video.url;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(video);
    if (unique.length >= 8) break;
  }
  return unique;
}

export default function HomeTrendingClips() {
  const { data, isLoading } = useSWR<VideosApiResponse>(
    "/api/videos?limit=8",
    fetcher,
  );

  const videos = useMemo(
    () => dedupeVideos(data?.videos ?? []),
    [data?.videos],
  );

  if (isLoading && !videos.length) {
    return (
      <section className={styles.section} aria-labelledby="home-clips-heading">
        <h2 id="home-clips-heading" className={styles.sectionTitle}>
          Trending Clips
        </h2>
        <div className={`${styles.skeleton} animate-skeleton-shimmer`} />
      </section>
    );
  }

  if (!videos.length) {
    return null;
  }

  return (
    <section className={styles.section} aria-labelledby="home-clips-heading">
      <div className={styles.sectionHeader}>
        <h2 id="home-clips-heading" className={styles.sectionTitle}>
          Trending Clips
        </h2>
        <Link href="/videos" className={styles.sectionLink}>
          View all →
        </Link>
      </div>
      <div className={styles.clipsScroll}>
        {videos.map((video) => (
          <a
            key={video.videoId}
            href={video.url}
            className={styles.clipCard}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.clipThumb}>
              <img src={video.thumbnail} alt="" loading="lazy" />
              <span className={styles.clipPlay} aria-hidden="true">
                ▶
              </span>
            </div>
            <p className={styles.clipTitle}>{video.title}</p>
            <p className={styles.clipViews}>{video.channelTitle}</p>
          </a>
        ))}
      </div>
    </section>
  );
}

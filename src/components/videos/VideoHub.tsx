import Link from "next/link";
import type { YouTubeVideo } from "@/types/video";
import VideoCard from "@/components/videos/VideoCard";
import styles from "./videos.module.css";

type VideoHubProps = {
  latestVideos: YouTubeVideo[];
};

export default function VideoHub({ latestVideos }: VideoHubProps) {
  return (
    <main className={styles.content}>
      <h1 className={styles.pageTitle}>
        Video <span>&amp; Audio</span>
      </h1>
      <p className={styles.pageIntro}>
        Premier League and World Cup 2026 highlights from YouTube — updated
        hourly.
      </p>

      <div className={styles.hubCards}>
        <Link href="/videos/premier-league" className={styles.hubCard}>
          <div className={styles.hubCardEmoji} aria-hidden="true">
            📺
          </div>
          <div className={styles.hubCardTitle}>PL Videos</div>
          <div className={styles.hubCardSub}>
            Premier League 2026/27 highlights and clips
          </div>
        </Link>
        <Link href="/videos/world-cup" className={styles.hubCard}>
          <div className={styles.hubCardEmoji} aria-hidden="true">
            📺
          </div>
          <div className={styles.hubCardTitle}>WC Videos</div>
          <div className={styles.hubCardSub}>
            FIFA World Cup 2026 previews and highlights
          </div>
        </Link>
      </div>

      <div className={styles.sectionLabel}>Latest Videos</div>
      {latestVideos.length === 0 ? (
        <p className={styles.emptyState}>No videos available right now.</p>
      ) : (
        <div className={styles.grid}>
          {latestVideos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}

      <p className={styles.hubBack}>
        <Link href="/">← Back to Home</Link>
      </p>
    </main>
  );
}

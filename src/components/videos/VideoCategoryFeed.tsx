import Link from "next/link";
import type { YouTubeVideo } from "@/types/video";
import VideoCard from "@/components/videos/VideoCard";
import styles from "./videos.module.css";

type VideoCategoryFeedProps = {
  heading: string;
  headingAccent: string;
  intro: string;
  videos: YouTubeVideo[];
  emptyMessage: string;
  backHref?: string;
  backLabel?: string;
};

export default function VideoCategoryFeed({
  heading,
  headingAccent,
  intro,
  videos,
  emptyMessage,
  backHref = "/videos",
  backLabel = "← Video Hub",
}: VideoCategoryFeedProps) {
  return (
    <main className={styles.content}>
      <h1 className={styles.pageTitle}>
        {heading} <span>{headingAccent}</span>
      </h1>
      <p className={styles.pageIntro}>{intro}</p>

      {videos.length === 0 ? (
        <p className={styles.emptyState}>{emptyMessage}</p>
      ) : (
        <div className={styles.grid}>
          {videos.map((video) => (
            <VideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}

      <p className={styles.hubBack}>
        <Link href={backHref}>{backLabel}</Link>
      </p>
    </main>
  );
}

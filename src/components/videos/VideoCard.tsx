import type { YouTubeVideo } from "@/types/video";
import styles from "./videos.module.css";

function formatPublishedDate(iso: string): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

type VideoCardProps = {
  video: YouTubeVideo;
};

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <a
      href={video.url}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.thumbWrap}>
        <img
          src={video.thumbnail}
          alt=""
          className={styles.thumb}
          loading="lazy"
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{video.title}</div>
        <div className={styles.cardMeta}>
          {video.channelTitle}
          {formatPublishedDate(video.publishedAt)
            ? ` · ${formatPublishedDate(video.publishedAt)}`
            : ""}
        </div>
      </div>
    </a>
  );
}

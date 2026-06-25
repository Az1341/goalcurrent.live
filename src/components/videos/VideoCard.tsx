import CardMedia from "@/components/ui/CardMedia";
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
        <CardMedia
          src={video.thumbnail}
          alt=""
          width={320}
          height={180}
          sizes="(max-width: 640px) 100vw, 320px"
          className={styles.thumb}
          placeholder="▶"
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

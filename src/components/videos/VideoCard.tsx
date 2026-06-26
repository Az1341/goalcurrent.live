import CardMedia from "@/components/ui/CardMedia";
import type { VideoItem } from "@/content/types";
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
  video: YouTubeVideo | VideoItem;
};

function resolveHref(video: YouTubeVideo | VideoItem): string {
  if ("url" in video && video.url) {
    return video.url;
  }
  return `https://www.youtube.com/watch?v=${(video as YouTubeVideo).videoId}`;
}

function resolveThumbnail(video: YouTubeVideo | VideoItem): string {
  if ("thumbnail" in video && video.thumbnail) {
    return video.thumbnail;
  }
  return "/images/football-hero-bg.jpg";
}

function resolveTitle(video: YouTubeVideo | VideoItem): string {
  return video.title;
}

function resolveMeta(video: YouTubeVideo | VideoItem): string {
  const source =
    "channelTitle" in video ? video.channelTitle : video.source;
  const publishedAt = video.publishedAt;
  const dateLabel = formatPublishedDate(publishedAt);
  return dateLabel ? `${source} · ${dateLabel}` : source;
}

export default function VideoCard({ video }: VideoCardProps) {
  const href = resolveHref(video);
  const isInternal = href.startsWith("/");

  const content = (
    <>
      <div className={styles.thumbWrap}>
        <CardMedia
          src={resolveThumbnail(video)}
          alt=""
          width={320}
          height={180}
          sizes="(max-width: 640px) 100vw, 320px"
          className={styles.thumb}
          placeholder="▶"
        />
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardTitle}>{resolveTitle(video)}</div>
        <div className={styles.cardMeta}>{resolveMeta(video)}</div>
      </div>
    </>
  );

  if (isInternal) {
    return (
      <a href={href} className={styles.card}>
        {content}
      </a>
    );
  }

  return (
    <a
      href={href}
      className={styles.card}
      target="_blank"
      rel="noopener noreferrer"
    >
      {content}
    </a>
  );
}

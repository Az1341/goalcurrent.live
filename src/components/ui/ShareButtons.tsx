"use client";

import styles from "./ShareButtons.module.css";

type ShareButtonsProps = {
  url: string;
  title: string;
  className?: string;
};

export function ShareButtons({ url, title, className = "" }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className={`${styles.wrap} ${className}`.trim()} aria-label="Share">
      <span className={styles.label}>Share</span>
      <a
        className={styles.button}
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on X
      </a>
      <a
        className={styles.button}
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Share on Facebook
      </a>
    </div>
  );
}
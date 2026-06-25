import {
  GOOGLE_PLAY_APP_URL,
  GOOGLE_PLAY_BADGE_SRC,
} from "@/lib/site-keys";
import styles from "./master-chrome.module.css";

export default function GooglePlayBadge() {
  return (
    <a
      className={styles.googlePlayLink}
      href={GOOGLE_PLAY_APP_URL}
      rel="noopener noreferrer"
      aria-label="Get GoalCurrent on Google Play"
    >
      <img
        className={styles.googlePlayBadge}
        src={GOOGLE_PLAY_BADGE_SRC}
        alt="Get it on Google Play"
        width={180}
        height={54}
        loading="lazy"
        decoding="async"
      />
    </a>
  );
}
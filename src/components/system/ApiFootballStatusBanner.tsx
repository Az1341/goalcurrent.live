import type { ApiFootballErrorCode } from "@/lib/api-football/errors";
import styles from "./ApiFootballStatusBanner.module.css";

type ApiFootballStatusBannerProps = {
  errorCode?: ApiFootballErrorCode;
  message?: string;
  fetchedAt?: string;
};

export default function ApiFootballStatusBanner({
  errorCode,
  message,
  fetchedAt,
}: ApiFootballStatusBannerProps) {
  if (!errorCode) {
    return null;
  }

  const text =
    message ??
    (errorCode === "rate_limit"
      ? "Live scores are temporarily unavailable due to provider limits."
      : errorCode === "network_error"
        ? "We are having trouble reaching the live data provider. Please try again shortly."
        : "Live data is temporarily unavailable.");

  return (
    <div className={styles.banner} role="status" aria-live="polite">
      <p className={styles.text}>{text}</p>
      {fetchedAt ? (
        <p className={styles.meta}>Last updated: {new Date(fetchedAt).toLocaleString()}</p>
      ) : null}
    </div>
  );
}
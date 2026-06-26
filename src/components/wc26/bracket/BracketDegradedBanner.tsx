import styles from "./bracket.module.css";

type BracketDegradedBannerProps = {
  message: string;
};

export default function BracketDegradedBanner({
  message,
}: BracketDegradedBannerProps) {
  return (
    <p className={styles.degradedBanner} role="status">
      {message}
    </p>
  );
}

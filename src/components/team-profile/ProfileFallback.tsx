import styles from "./team-profile.module.css";

export default function ProfileFallback({ message }: { message: string }) {
  return <p className={styles.fallback}>{message}</p>;
}
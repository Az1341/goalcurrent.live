import ProfileSection from "./ProfileSection";
import styles from "./team-profile.module.css";

export default function ProfileHistorySection({ summary, achievements, extra }: { summary: string; achievements: string[]; extra?: string }) {
  return (
    <ProfileSection id="profile-history" title="History and achievements">
      <p className={styles.sectionBody}>{summary}</p>
      {achievements.length ? (
        <ul className={styles.historyList}>
          {achievements.map((item) => (<li key={item}>{item}</li>))}
        </ul>
      ) : null}
      {extra ? <p className={styles.sectionBody}>{extra}</p> : null}
    </ProfileSection>
  );
}
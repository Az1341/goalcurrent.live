import ProfileFallback from "./ProfileFallback";
import ProfileSection from "./ProfileSection";
import styles from "./team-profile.module.css";

export type H2HMatch = { id: string; label: string; score: string; date: string };

export default function ProfileH2HSection({ opponentName, matches }: { opponentName: string | null; matches: H2HMatch[] }) {
  return (
    <ProfileSection id="profile-h2h" title="Head-to-head">
      {!opponentName ? (
        <ProfileFallback message="Head-to-head data will appear when the next opponent is confirmed." />
      ) : matches.length ? (
        <>
          <p className={styles.sectionBody}>Recent meetings vs <strong>{opponentName}</strong></p>
          {matches.map((match) => (
            <div key={match.id} className={styles.h2hRow}>
              <span>{match.label}</span>
              <span><strong>{match.score}</strong> - {match.date}</span>
            </div>
          ))}
        </>
      ) : (
        <ProfileFallback message={`No head-to-head data available yet vs ${opponentName}.`} />
      )}
    </ProfileSection>
  );
}
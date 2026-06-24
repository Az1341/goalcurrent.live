import Link from "next/link";
import ProfileFallback from "./ProfileFallback";
import ProfileSection from "./ProfileSection";
import styles from "./team-profile.module.css";

export default function ProfileGossipSection({ variant, entityName }: { variant: "pl" | "wc26"; entityName: string }) {
  const title = variant === "pl" ? "Transfer rumours and gossip" : "Squad rumours and gossip";
  return (
    <ProfileSection id="profile-gossip" title={title}>
      <p className={styles.gossipNote}>Rumours and gossip only - not confirmed transfers or squad selections.</p>
      <ProfileFallback message={`No ${variant === "pl" ? "transfer" : "squad"} rumours available for ${entityName} yet.`} />
      <div className={styles.navRow}>
        <Link href={variant === "pl" ? "/premier-league/transfers" : "/news"} className={styles.navLink}>
          {variant === "pl" ? "Premier League transfers hub" : "Latest news"}
        </Link>
      </div>
    </ProfileSection>
  );
}
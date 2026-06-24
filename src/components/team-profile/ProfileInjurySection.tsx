import ProfileFallback from "./ProfileFallback";
import ProfileSection from "./ProfileSection";

export default function ProfileInjurySection({ variant, entityName }: { variant: "pl" | "wc26"; entityName: string }) {
  const title = variant === "pl" ? "Injuries and suspensions" : "Squad availability";
  const message = variant === "pl"
    ? `No injury or suspension updates available for ${entityName} yet.`
    : `No squad availability updates available for ${entityName} yet.`;
  return (
    <ProfileSection id="profile-injuries" title={title}>
      <ProfileFallback message={message} />
    </ProfileSection>
  );
}
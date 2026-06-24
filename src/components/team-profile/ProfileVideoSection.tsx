import ProfileFallback from "./ProfileFallback";
import ProfileSection from "./ProfileSection";

export default function ProfileVideoSection() {
  return (
    <ProfileSection id="profile-video" title="Videos and highlights">
      <ProfileFallback message="Videos will appear here when available." />
    </ProfileSection>
  );
}
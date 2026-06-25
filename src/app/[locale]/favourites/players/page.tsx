import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Favourite Players",
  path: "/favourites/players",
});

export default function FavouritePlayersPage() {
  return (
    <ComingSoonPage
      title="Favourite Players"
      path="/favourites/players"
      emoji="👤"
      description="Save and follow your favourite players on GoalCurrent.live — coming soon."
      links={[
        { href: "/favourites", label: "All Favourites" },
        { href: "/premier-league/players", label: "PL Players" },
        { href: "/worldcup2026/players", label: "WC26 Players" },
      ]}
      backHref="/favourites"
      backLabel="← Favourites"
    />
  );
}

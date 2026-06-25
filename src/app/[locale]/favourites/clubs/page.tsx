import type { Metadata } from "next";
import {
  buildComingSoonMetadata,
  ComingSoonPage,
} from "@/lib/coming-soon-page";

export const metadata: Metadata = buildComingSoonMetadata({
  title: "Favourite Clubs",
  path: "/favourites/clubs",
});

export default function FavouriteClubsPage() {
  return (
    <ComingSoonPage
      title="Favourite Clubs"
      path="/favourites/clubs"
      emoji="🏟️"
      description="Save and follow your favourite clubs on GoalCurrent.live — coming soon."
      links={[
        { href: "/favourites", label: "All Favourites" },
        { href: "/premier-league/clubs", label: "PL Clubs" },
        { href: "/worldcup2026/teams", label: "WC26 Teams" },
      ]}
      backHref="/favourites"
      backLabel="← Favourites"
    />
  );
}

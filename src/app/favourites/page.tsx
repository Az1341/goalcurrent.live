import type { Metadata } from "next";
import FavouritesPageContent from "@/components/favourites/FavouritesPageContent";
import { buildPageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Favourites",
  description:
    "Your saved teams, matches, national sides and competitions on GoalCurrent.online.",
  path: "/favourites",
});

export default function FavouritesPage() {
  return <FavouritesPageContent />;
}

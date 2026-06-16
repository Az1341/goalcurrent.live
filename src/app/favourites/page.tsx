import type { Metadata } from "next";
import FavouritesPageContent from "@/components/favourites/FavouritesPageContent";

export const metadata: Metadata = {
  title: "Favourites",
  description:
    "Your saved teams, matches, national sides and competitions on GoalCurrent.online.",
};

export default function FavouritesPage() {
  return <FavouritesPageContent />;
}

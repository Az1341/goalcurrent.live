import type { Metadata } from "next";
import FavouritesPageContent from "@/components/favourites/FavouritesPageContent";
import { buildPageMetadata } from "@/lib/page-metadata";
import { SITE_NAME } from "@/lib/site-url";

export const metadata: Metadata = buildPageMetadata({
  title: "Favourites",
  description:
    `Your saved teams, matches, national sides and competitions on ${SITE_NAME}.`,
  path: "/favourites",
});

export default function FavouritesPage() {
  return <FavouritesPageContent />;
}

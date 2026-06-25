import type { MetadataRoute } from "next";
import { generateGoalCurrentSitemap } from "@/lib/seo/sitemap-entries";

export default function sitemap(): MetadataRoute.Sitemap {
  return generateGoalCurrentSitemap();
}

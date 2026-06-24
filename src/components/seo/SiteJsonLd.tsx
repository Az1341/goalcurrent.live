import JsonLd from "@/components/seo/JsonLd";
import { siteGraphSchema } from "@/lib/seo/schema";

/** Sitewide Organization + WebSite schema (root layout only). */
export default function SiteJsonLd() {
  return <JsonLd data={siteGraphSchema()} />;
}

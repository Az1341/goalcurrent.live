import JsonLd from "@/components/seo/JsonLd";
import { siteGraphSchema } from "@/lib/seo/schema";

type SiteJsonLdProps = {
  locale?: string;
};

/** Sitewide Organization + WebSite schema (locale layout). */
export default function SiteJsonLd({ locale = "en" }: SiteJsonLdProps) {
  return <JsonLd data={siteGraphSchema(locale)} />;
}

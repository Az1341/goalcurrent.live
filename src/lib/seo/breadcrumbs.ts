import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/i18n/urls";

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function breadcrumbItems(
  items: readonly BreadcrumbItem[],
): BreadcrumbItem[] {
  return [{ name: "Home", path: "/" }, ...items];
}

export function breadcrumbSchema(
  items: readonly BreadcrumbItem[],
  locale: string = routing.defaultLocale,
) {
  const trail = breadcrumbItems(items);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(item.path, locale),
    })),
  };
}

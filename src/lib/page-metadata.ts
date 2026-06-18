import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  /** Bypass root layout title template (homepage only). */
  absoluteTitle?: boolean;
};

/** Shared metadata helper — title template applied by root layout. */
export function buildPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
  };
}

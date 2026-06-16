import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site-url";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
};

/** Shared metadata helper — title template applied by root layout. */
export function buildPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
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

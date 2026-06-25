import { redirect } from "next/navigation";

type PageProps = { params: Promise<{ slug: string }> };

/** Legacy path — 301 handled in next.config; server redirect as fallback. */
export default async function LegacyNewsArticlePage({ params }: PageProps) {
  const { slug } = await params;
  redirect(`/articles/${slug}`);
}

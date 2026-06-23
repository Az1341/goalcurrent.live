import { redirect } from "next/navigation";

/** Legacy hub — canonical listing is /articles */
export default function LegacyNewsArticlesIndexPage() {
  redirect("/articles");
}

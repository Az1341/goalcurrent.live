import Link from "next/link";
import { getLocale } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbs";
import {
  combineSchemaGraph,
  newsArticleSchema,
  type ArticleSchemaInput,
} from "@/lib/seo/schema";
import styles from "./seo.module.css";

type ArticleSeoProps = {
  article: Omit<ArticleSchemaInput, "locale">;
  breadcrumbs: readonly BreadcrumbItem[];
  showVisualBreadcrumb?: boolean;
};

export default async function ArticleSeo({
  article,
  breadcrumbs,
  showVisualBreadcrumb = true,
}: ArticleSeoProps) {
  const locale = await getLocale();
  const schema = combineSchemaGraph([
    newsArticleSchema({ ...article, locale }),
    breadcrumbSchema(breadcrumbs, locale),
  ]);

  return (
    <>
      <JsonLd data={schema} />
      {showVisualBreadcrumb ? (
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {breadcrumbs.map((item) => (
            <span key={item.path}>
              <span aria-hidden="true"> › </span>
              <Link href={item.path}>{item.name}</Link>
            </span>
          ))}
        </nav>
      ) : null}
    </>
  );
}

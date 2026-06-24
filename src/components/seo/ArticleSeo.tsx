import Link from "next/link";
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
  article: ArticleSchemaInput;
  breadcrumbs: readonly BreadcrumbItem[];
  showVisualBreadcrumb?: boolean;
};

export default function ArticleSeo({
  article,
  breadcrumbs,
  showVisualBreadcrumb = true,
}: ArticleSeoProps) {
  const schema = combineSchemaGraph([
    newsArticleSchema(article),
    breadcrumbSchema(breadcrumbs),
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

import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbs";
import {
  combineSchemaGraph,
  sportsEventSchema,
  type SportsEventSchemaInput,
} from "@/lib/seo/schema";
import styles from "./seo.module.css";

type MatchSeoProps = {
  event: SportsEventSchemaInput;
  breadcrumbs: readonly BreadcrumbItem[];
};

export default function MatchSeo({ event, breadcrumbs }: MatchSeoProps) {
  const schema = combineSchemaGraph([
    sportsEventSchema(event),
    breadcrumbSchema(breadcrumbs),
  ]);

  return (
    <>
      <JsonLd data={schema} />
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        {breadcrumbs.map((item) => (
          <span key={item.path}>
            <span aria-hidden="true"> › </span>
            <Link href={item.path}>{item.name}</Link>
          </span>
        ))}
      </nav>
    </>
  );
}

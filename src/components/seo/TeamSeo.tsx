import Link from "next/link";
import { getLocale } from "next-intl/server";
import JsonLd from "@/components/seo/JsonLd";
import type { BreadcrumbItem } from "@/lib/seo/breadcrumbs";
import { breadcrumbSchema } from "@/lib/seo/breadcrumbs";
import {
  combineSchemaGraph,
  sportsTeamSchema,
  type SportsTeamSchemaInput,
} from "@/lib/seo/schema";
import styles from "./seo.module.css";

type TeamSeoProps = {
  team: SportsTeamSchemaInput;
  breadcrumbs: readonly BreadcrumbItem[];
};

export default async function TeamSeo({ team, breadcrumbs }: TeamSeoProps) {
  const locale = await getLocale();
  const schema = combineSchemaGraph([
    sportsTeamSchema(team),
    breadcrumbSchema(breadcrumbs, locale),
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

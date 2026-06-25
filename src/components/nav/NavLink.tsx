"use client";

import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";
import { shouldPrefetchRoute } from "@/lib/prefetch-routes";

type NavLinkProps = ComponentProps<typeof Link>;

function hrefToPath(href: NavLinkProps["href"]): string {
  if (typeof href === "string") {
    return href.split("?")[0] ?? href;
  }

  if (typeof href === "object" && href !== null && "pathname" in href) {
    return href.pathname ?? "";
  }

  return "";
}

/** Internal nav link with explicit prefetch for primary routes. */
export default function NavLink({ href, prefetch, ...rest }: NavLinkProps) {
  const path = hrefToPath(href);
  const resolvedPrefetch =
    prefetch ?? (shouldPrefetchRoute(path) ? true : undefined);

  return <Link href={href} prefetch={resolvedPrefetch} {...rest} />;
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isNavActive } from "@/lib/nav";

type NavLinkProps = {
  href: string;
  exact?: boolean;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
};

export default function NavLink({
  href,
  exact,
  className = "",
  activeClassName = "",
  children,
  onNavigate,
}: NavLinkProps) {
  const pathname = usePathname();
  const active = isNavActive(pathname, href, exact);

  return (
    <Link
      href={href}
      className={[className, active ? activeClassName : ""].filter(Boolean).join(" ")}
      onClick={onNavigate}
    >
      {children}
    </Link>
  );
}

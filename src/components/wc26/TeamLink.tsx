import Link from "next/link";
import { teamHref } from "@/lib/wc26-teams";
import styles from "./wc26.module.css";

type TeamLinkProps = {
  teamId: string;
  children: React.ReactNode;
  className?: string;
};

export default function TeamLink({
  teamId,
  children,
  className,
}: TeamLinkProps) {
  return (
    <Link href={teamHref(teamId)} className={className ?? styles.entityLink}>
      {children}
    </Link>
  );
}

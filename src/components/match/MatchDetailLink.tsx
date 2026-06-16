import Link from "next/link";
import { matchHref } from "@/lib/wc26-match";
import matchStyles from "@/components/match/match.module.css";

type MatchDetailLinkProps = {
  fixtureId: string;
  label?: string;
  className?: string;
};

export default function MatchDetailLink({
  fixtureId,
  label = "Match details →",
  className,
}: MatchDetailLinkProps) {
  return (
    <Link
      href={matchHref(fixtureId)}
      className={`${matchStyles.detailLink} ${className ?? ""}`}
    >
      {label}
    </Link>
  );
}

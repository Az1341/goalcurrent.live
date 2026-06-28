import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import type { TeamId } from "@/types/team";
import styles from "./fixture-match-row.module.css";

export type FixtureMatchRowProps = {
  homeTeamId: TeamId;
  awayTeamId: TeamId;
  homeName: string;
  awayName: string;
  centrePrimary: string;
  centreSecondary?: string;
  flagSize?: number;
  isLive?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export default function FixtureMatchRow({
  homeTeamId,
  awayTeamId,
  homeName,
  awayName,
  centrePrimary,
  centreSecondary,
  flagSize = 22,
  isLive = false,
  href,
  className,
  onClick,
}: FixtureMatchRowProps) {
  const content = (
    <div className={`${styles.fixtureRow} ${className ?? ""}`}>
      <div className={styles.homeCol}>
        <span className={styles.flag}>
          <TeamFlag teamId={homeTeamId} teamName={homeName} size={flagSize} />
        </span>
        <span className={styles.homeName}>{homeName}</span>
      </div>

      <div className={styles.centreCol}>
        <span
          className={`${styles.centrePrimary} ${isLive ? styles.centrePrimaryLive : ""}`}
        >
          {centrePrimary}
        </span>
        {centreSecondary ? (
          <span className={styles.centreSecondary}>{centreSecondary}</span>
        ) : null}
      </div>

      <div className={styles.awayCol}>
        <span className={styles.awayName}>{awayName}</span>
        <span className={styles.flag}>
          <TeamFlag teamId={awayTeamId} teamName={awayName} size={flagSize} />
        </span>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={styles.rowLink} onClick={onClick}>
        {content}
      </Link>
    );
  }

  return content;
}
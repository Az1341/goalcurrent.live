"use client";

import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import { FavouriteTeamButton } from "@/components/FavouriteButton";
import FixturesList from "@/components/wc26/FixturesList";
import GroupStandingsSection from "@/components/wc26/GroupStandingsSection";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import { getTeamById, groupLabel } from "@/data/wc26";
import { useEffectiveFixtures } from "@/lib/use-effective-fixtures";
import { groupHref, WC26_HUB_HREF } from "@/lib/wc26-groups";
import styles from "./wc26.module.css";

type TeamPageContentProps = {
  teamId: string;
};

export default function TeamPageContent({ teamId }: TeamPageContentProps) {
  const team = getTeamById(teamId);
  const allFixtures = useEffectiveFixtures();
  const fixtures = allFixtures.filter(
    (fixture) =>
      fixture.homeTeamId === teamId || fixture.awayTeamId === teamId,
  );

  if (!team) {
    return (
      <main className={styles.wc26Content}>
        <p className={styles.standingsEmpty}>Team not found.</p>
        <p className={styles.hubBack}>
          <Link href="/worldcup2026/teams">← Back to teams</Link>
        </p>
      </main>
    );
  }

  const groupTitle = groupLabel(team.groupId);

  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb
        items={[
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: "Teams", href: "/worldcup2026/teams" },
          { label: team.name },
        ]}
      />

      <div className={styles.teamPageHeader}>
        <TeamFlag teamId={team.id} size={56} />
        <div className={styles.teamPageHeading}>
          <h1 className={styles.pageTitle}>
            FIFA World Cup 2026 — <span>{team.name}</span>
          </h1>
          <p className={styles.pageIntro}>
            {team.name} · {team.code} ·{" "}
            <Link
              href={groupHref(team.groupId)}
              className={styles.entityLink}
              aria-label={`View ${groupTitle}`}
            >
              {groupTitle}
            </Link>
          </p>
          <p className={styles.teamViewGroup}>
            <Link href={groupHref(team.groupId)} className={styles.teamViewGroupLink}>
              View {groupTitle}
            </Link>
          </p>
        </div>
        <FavouriteTeamButton teamId={team.id} teamName={team.name} />
      </div>

      <GroupStandingsSection
        groupId={team.groupId}
        sectionHeading={`${groupTitle} standings`}
      />

      <section aria-labelledby="team-fixtures-heading">
        <h2 id="team-fixtures-heading" className={styles.sectionTitle}>
          Fixtures
        </h2>
        <FixturesList fixtures={fixtures} />
      </section>

      <p className={styles.hubBack}>
        <Link href={groupHref(team.groupId)}>View {groupTitle}</Link>
        {" · "}
        <Link href="/worldcup2026/teams">All teams</Link>
      </p>
    </main>
  );
}

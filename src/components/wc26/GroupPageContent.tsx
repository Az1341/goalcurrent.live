import Link from "next/link";
import TeamFlag from "@/components/TeamFlag";
import TeamLink from "@/components/wc26/TeamLink";
import {
  getFixturesByGroup,
  getGroupById,
  getTeamsByGroup,
  groupLabel,
  type Wc26GroupId,
} from "@/data/wc26";
import { GROUPS_HUB_HREF, WC26_HUB_HREF } from "@/lib/wc26-groups";
import FixturesList from "./FixturesList";
import GroupStandingsSection from "./GroupStandingsSection";
import Wc26Breadcrumb from "./Wc26Breadcrumb";
import styles from "./wc26.module.css";

type GroupPageContentProps = {
  groupId: Wc26GroupId;
};

export default function GroupPageContent({ groupId }: GroupPageContentProps) {
  const title = groupLabel(groupId);
  const group = getGroupById(groupId);
  const teams = getTeamsByGroup(groupId);
  const fixtures = getFixturesByGroup(groupId);

  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb
        items={[
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: "Groups", href: GROUPS_HUB_HREF },
          { label: title },
        ]}
      />

      <h1 className={styles.pageTitle}>
        FIFA World Cup 2026 — <span>{title}</span>
      </h1>
      <p className={styles.pageIntro}>
        {group
          ? `${title} with ${group.teamIds.length} teams. Standings are calculated from completed group-stage results. Fixtures show scheduled entries with live overlay status when available.`
          : `${title} overview for the 2026 FIFA World Cup.`}
      </p>

      <section aria-labelledby="teams-heading">
        <h2 id="teams-heading" className={styles.sectionTitle}>
          Teams
        </h2>
        <ul className={styles.teamList}>
          {teams.map((team) => (
            <li key={team.id} className={styles.teamListItem}>
              <TeamLink teamId={team.id} className={styles.teamListMain}>
                <TeamFlag teamId={team.id} size={24} />
                <span className={styles.teamListName}>{team.name}</span>
              </TeamLink>
              <span className={styles.teamListCode}>{team.code}</span>
            </li>
          ))}
        </ul>
      </section>

      <GroupStandingsSection groupId={groupId} />

      <section aria-labelledby="fixtures-heading">
        <h2 id="fixtures-heading" className={styles.sectionTitle}>
          Fixtures
        </h2>
        <FixturesList fixtures={fixtures} />
      </section>

      <p className={styles.hubBack}>
        <Link href={GROUPS_HUB_HREF}>← Back to Groups hub</Link>
      </p>
    </main>
  );
}

import Link from "next/link";
import {
  WC26_GROUP_COUNT,
  WC26_TEAM_COUNT,
  WC26_TOURNAMENT,
} from "@/data/wc26";
import { WC26_HUB_HREF } from "@/lib/wc26-groups";
import GroupsGrid from "@/components/wc26/GroupsGrid";
import GroupsHubStandings from "@/components/wc26/GroupsHubStandings";
import Wc26GamesProgress from "@/components/wc26/Wc26GamesProgress";
import Wc26Breadcrumb from "@/components/wc26/Wc26Breadcrumb";
import styles from "@/components/wc26/wc26.module.css";

export default function GroupsHubContent() {
  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb
        items={[
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: "Groups" },
        ]}
      />

      <h1 className={styles.pageTitle}>
        FIFA World Cup 2026 — <span>Groups</span>
      </h1>
      <p className={styles.pageIntro}>
        {WC26_GROUP_COUNT} groups · {WC26_TEAM_COUNT} teams in the expanded
        tournament. Select a group for detail or review live standings below.
      </p>

      <Wc26GamesProgress />

      <GroupsGrid />

      <GroupsHubStandings />

      <p className={styles.hubBack}>
        <Link href={WC26_HUB_HREF}>← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}

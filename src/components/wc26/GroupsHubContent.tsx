import { WC26_HUB_HREF } from "@/lib/wc26-groups";
import GroupsGrid from "@/components/wc26/GroupsGrid";
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
        All twelve groups for the expanded 48-team tournament. Select a group to
        view its dedicated page — standings and fixtures coming in a later phase.
      </p>

      <GroupsGrid />
    </main>
  );
}

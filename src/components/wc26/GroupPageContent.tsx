import {
  GROUPS_HUB_HREF,
  WC26_HUB_HREF,
  groupLabel,
  type Wc26GroupId,
} from "@/lib/wc26-groups";
import FixturesPlaceholder from "./FixturesPlaceholder";
import StandingsPlaceholder from "./StandingsPlaceholder";
import Wc26Breadcrumb from "./Wc26Breadcrumb";
import styles from "./wc26.module.css";

type GroupPageContentProps = {
  groupId: Wc26GroupId;
};

export default function GroupPageContent({ groupId }: GroupPageContentProps) {
  const title = groupLabel(groupId);

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
        {title} overview for the 2026 FIFA World Cup. Team lists, standings, and
        fixtures will be added in a later phase — this page is structure only.
      </p>

      <StandingsPlaceholder />
      <FixturesPlaceholder />
    </main>
  );
}

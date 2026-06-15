import { WC26_GROUPS } from "@/lib/wc26-groups";
import GroupCard from "./GroupCard";
import styles from "./wc26.module.css";

export default function GroupsGrid() {
  return (
    <div className={styles.groupsGrid}>
      {WC26_GROUPS.map((groupId) => (
        <GroupCard key={groupId} groupId={groupId} />
      ))}
    </div>
  );
}

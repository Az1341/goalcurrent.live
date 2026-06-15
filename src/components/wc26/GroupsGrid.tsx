import { WC26_GROUPS } from "@/data/wc26";
import GroupCard from "./GroupCard";
import styles from "./wc26.module.css";

export default function GroupsGrid() {
  return (
    <div className={styles.groupsGrid}>
      {WC26_GROUPS.map((group) => (
        <GroupCard key={group.id} groupId={group.id} />
      ))}
    </div>
  );
}

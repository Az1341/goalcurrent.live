import Link from "next/link";
import { groupHref, groupLabel, type Wc26GroupId } from "@/lib/wc26-groups";
import styles from "./wc26.module.css";

type GroupCardProps = {
  groupId: Wc26GroupId;
};

export default function GroupCard({ groupId }: GroupCardProps) {
  return (
    <Link href={groupHref(groupId)} className={styles.groupCard}>
      <div className={styles.groupCardLetter}>{groupLabel(groupId)}</div>
      <div className={styles.groupCardSub}>View group page →</div>
    </Link>
  );
}

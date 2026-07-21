import Link from "next/link";
import { WC26_HUB_HREF } from "@/lib/wc26-sections";
import {
  WC26_ARCHIVE_DATA_AS_OF,
  WC26_ARCHIVE_LABEL,
} from "@/lib/wc26/archive";
import Wc26Breadcrumb from "./Wc26Breadcrumb";
import styles from "./wc26.module.css";

type Wc26SectionPageProps = {
  breadcrumb: string;
  titleHighlight: string;
  intro: string;
  children: React.ReactNode;
};

export default function Wc26SectionPage({
  breadcrumb,
  titleHighlight,
  intro,
  children,
}: Wc26SectionPageProps) {
  return (
    <main className={styles.wc26Content}>
      <Wc26Breadcrumb
        items={[
          { label: WC26_ARCHIVE_LABEL, href: WC26_HUB_HREF },
          { label: breadcrumb },
        ]}
      />

      <p className={styles.archiveBadge}>{WC26_ARCHIVE_LABEL}</p>
      <h1 className={styles.pageTitle}>
        FIFA World Cup 2026 Archive — <span>{titleHighlight}</span>
      </h1>
      <p className={styles.pageIntro}>{intro}</p>
      <p className={styles.archiveTimestamp}>
        Archived data as of {WC26_ARCHIVE_DATA_AS_OF} (curated repository results).
      </p>

      {children}

      <p className={styles.hubBack}>
        <Link href={WC26_HUB_HREF}>← Back to World Cup 2026 Archive</Link>
      </p>
    </main>
  );
}
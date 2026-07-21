import Link from "next/link";
import { WC26_HUB_HREF } from "@/lib/wc26-sections";
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
          { label: "World Cup 2026", href: WC26_HUB_HREF },
          { label: breadcrumb },
        ]}
      />

      <h1 className={styles.pageTitle}>
        FIFA World Cup 2026 — <span>{titleHighlight}</span>
      </h1>
      <p className={styles.pageIntro}>{intro}</p>

      {children}

      <p className={styles.hubBack}>
        <Link href={WC26_HUB_HREF}>← Back to World Cup 2026 hub</Link>
      </p>
    </main>
  );
}

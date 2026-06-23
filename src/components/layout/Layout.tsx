import CookieConsent from "./CookieConsent";
import BottomTabBar from "./BottomTabBar";
import MasterFooter from "./MasterFooter";
import MasterHeader from "./MasterHeader";
import Wc26ResultsSync from "@/components/wc26/Wc26ResultsSync";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <MasterHeader />

      <div className={`${styles.main} ${styles.mainWithTabBar}`}>
        {children}
        <MasterFooter />
      </div>

      <BottomTabBar />
      <CookieConsent />
      <Wc26ResultsSync />
    </div>
  );
}

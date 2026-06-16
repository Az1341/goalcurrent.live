import CookieConsent from "./CookieConsent";
import MasterFooter from "./MasterFooter";
import MasterHeader from "./MasterHeader";
import SubscribePopup from "./SubscribePopup";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <MasterHeader />
      <div className={styles.main}>
        {children}
        <MasterFooter />
      </div>
      <CookieConsent />
      <SubscribePopup />
    </div>
  );
}

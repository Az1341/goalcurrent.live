import CookieConsent from "./CookieConsent";
import MasterFooter from "./MasterFooter";
import MasterHeader from "./MasterHeader";
import SubscribePopup from "./SubscribePopup";
import Wc26ResultsSync from "@/components/wc26/Wc26ResultsSync";
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

      <Wc26ResultsSync />
    </div>

  );

}



import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        {children}
        <Footer />
      </div>
    </div>
  );
}

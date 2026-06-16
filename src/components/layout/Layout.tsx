import Footer from "./Footer";
import Header from "./Header";
import styles from "./layout.module.css";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.main}>
        {children}
        <Footer />
      </div>
    </div>
  );
}

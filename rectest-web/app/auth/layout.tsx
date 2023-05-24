import { ReactNode } from "react";
import Header from "../(home)/Header";
import styles from "./layout.module.css";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <Header />
      </div>
      <div className={styles.content}>{children}</div>
    </main>
  );
}

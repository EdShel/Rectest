import Link from "next/link";
import React from "react";
import homeIcon from "./assets/home.svg";
import testIcon from "./assets/test.svg";
import codeIcon from "./assets/code.svg";
import styles from "./layout.module.css";
import Header from "../(home)/Header";
import Image from "next/image";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.container}>
      <nav>
        <Header />
      </nav>
      <aside>
        <SidebarItem href="/" text="Home" iconSrc={homeIcon} />
        <SidebarItem href="/dashboard" text="My Projects" iconSrc={testIcon} />
        <SidebarItem href="/docs" text="Developer Docs" iconSrc={codeIcon} />
      </aside>
      <main>{children}</main>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  text: string;
  iconSrc: string;
}

const SidebarItem = ({ href, text, iconSrc }: SidebarItemProps) => (
  <Link href={href} className={styles.link}>
    <Image src={iconSrc} alt={text} className={styles.icon} />
    <span>{text}</span>
  </Link>
);

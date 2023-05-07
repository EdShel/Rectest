import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import rectestLogoImage from "@/public/rectest-logo.png";
import Header from "./Header";

export default function Home() {
  return (
    <main className={styles.main}>
      {/* @ts-expect-error Async Server Component */}
      <Header />
      <section>
        <div className={clsx("container", styles.banner)}>
          <div className={styles.leftContent}>
            <h1 className={styles.title}>Your Record and Replay solution</h1>
            <p className={styles.text}>
              Integrate <strong>Rectest</strong> into your team's development flow! Tired of constant regression
              testing? Record your test just by playing the game once and make sure the game stays playable FOREVER!
            </p>
            <Link href="/auth/sign-up" className={styles.tryNow}>
              Try now →
            </Link>
          </div>
          <div className={styles.rightContent}>
            <div className={clsx(styles.cloud, styles.cloud1)}>Simple and fast tests recording</div>
            <div className={clsx(styles.cloud, styles.cloud2)}>Watch video of test sessions</div>
            <div className={clsx(styles.cloud, styles.cloud3)}>Run tests any time</div>
            <div className={clsx(styles.seed, styles.seed1)} />
            <div className={clsx(styles.seed, styles.seed2)} />
            <div className={clsx(styles.seed, styles.seed3)} />
          </div>
        </div>
      </section>
    </main>
  );
}

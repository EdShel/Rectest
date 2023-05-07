"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  const session = useSession({ required: false });

  return (
    <main className={styles.main}>
      <Link href="/project/1">Go to project page</Link>
      <pre>{JSON.stringify(session, 0, 2)}</pre>

      <button
        onClick={() => {
          signIn();
        }}
      >
        Sign in
      </button>
    </main>
  );
}

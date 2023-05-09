"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      className={styles.signOutButton}
      onClick={async () => {
        await signOut();
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}

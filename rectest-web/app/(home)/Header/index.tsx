// 'use client'

import React from "react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import rectestLogoPng from "@/public/rectest-logo.png";
import styles from "./Header.module.css";
import Link from "next/link";
import AuthOptions from "@/app/api/auth/[...nextauth]/AuthOptions";
import SignOutButton from "./SignOutButton";
import clsx from "clsx";

export default async function Header() {
  const session = await getServerSession(AuthOptions);
  // const session = useSession();

  const isAuth = !!session?.user;

  return (
    <div className={styles.container}>
      <div className={clsx("container", styles.content)}>
        <Link href="/">
          <Image src={rectestLogoPng} alt="Rectest" className={styles.logo} />
        </Link>
        <div className={styles.buttons}>
          {isAuth && (
            <>
              <p>Hello, {session?.user?.name}</p>
              <Link href="/dashboard" className={clsx(styles.linkButton, styles.primary)}>
                Dashboard
              </Link>
              <SignOutButton />
            </>
          )}
          {!isAuth && (
            <>
              <Link href="/auth/sign-in" className={styles.linkButton}>
                Sign in
              </Link>
              <Link href="/auth/sign-up" className={clsx(styles.linkButton, styles.signUp)}>
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

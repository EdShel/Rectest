// 'use client'

import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import React from "react";

export default async function Header() {
  const session = await getServerSession();
// const session = useSession();

  return <div>Hello, {session?.user?.email}</div>;
}

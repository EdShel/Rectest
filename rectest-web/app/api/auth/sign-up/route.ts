import db from "@/utils/db";
import isEmailValid from "@/utils/isEmailValid";
import sha256 from "@/utils/sha256";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const signUpData = await request.json();

  const { email, userName, password } = signUpData;

  if (typeof email !== "string" || !isEmailValid(email)) {
    return NextResponse.json({ error: "Email is invalid" }, { status: 400 });
  }

  const existingUser = await db.user.findFirst({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
  }

  await db.user.create({
    data: {
      email,
      name: userName,
      password: { create: { password_hash: sha256(password) } },
    },
  });

  return NextResponse.json({});
}

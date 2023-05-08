import sha256 from "@/utils/sha256";
import ProjectRepository from "@/utils/repositories/ProjectRepository";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import AuthOptions from "../auth/[...nextauth]/AuthOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ errorCode: "FORBIDDEN" }, { status: 403 });
  }
  // @ts-ignore
  const userId: string = session.user.id;
  const data = await req.json();
  await ProjectRepository.create(
    {
      name: data.name,
      apiKey: sha256(String(Math.random())),
    },
    userId
  );

  return NextResponse.json({ success: true }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(AuthOptions);
  if (!session?.user) {
    return NextResponse.json({ errorCode: "FORBIDDEN" }, { status: 403 });
  }
  // @ts-ignore
  const userId: string = session.user.id;
  const projects = await ProjectRepository.list(userId);
  return NextResponse.json({ projects });
}

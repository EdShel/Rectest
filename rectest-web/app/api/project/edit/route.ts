import ProjectRepository from "@/utils/repositories/ProjectRepository";
import { NextRequest, NextResponse } from "next/server";

interface UpdateRequestBody {
  id: string;
  name: string;
}

export async function POST(request: NextRequest) {
  const { id, name } = (await request.json()) as UpdateRequestBody;

  await ProjectRepository.updateName(id, name);

  return NextResponse.json({});
}

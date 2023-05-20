import ProjectRepository from "@/utils/repositories/ProjectRepository";
import TestRunRepository, { TestRunCreateEntity } from "@/utils/repositories/TestRunRepository";
import { NextRequest, NextResponse } from "next/server";

interface PathParams {
  apiKey: string;
}

export async function POST(request: NextRequest, { params }: { params: PathParams }) {
  const gameProject = await ProjectRepository.findByApiKey(params.apiKey);
  if (!gameProject) {
    return NextResponse.json({}, { status: 404 });
  }
  const json: TestRunCreateEntity = await request.json();
  await TestRunRepository.createTestRun(gameProject.id, json);
  return NextResponse.json({}, { status: 200 });
}

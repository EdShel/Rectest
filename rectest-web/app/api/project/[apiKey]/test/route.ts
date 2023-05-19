import TestRunRepository, { TestRunCreateEntity } from "@/utils/repositories/TestRunRepository";
import { NextRequest, NextResponse } from "next/server";

interface PathParams {
  apiKey: string;
}

export async function POST(request: NextRequest, { params }: { params: PathParams }) {
  const json: TestRunCreateEntity = await request.json();
  console.log("json", json);
  console.log("params", params);
  return NextResponse.json({}, { status: 200 });
}

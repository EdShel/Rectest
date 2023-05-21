import "server-only";
import db from "@/utils/db";

export interface TestRunCreateEntity {
  total: number;
  success: number;
  failed: number;
  testsResults: TestResultCreateEntity[];
}

export interface TestResultCreateEntity {
  testFile: string;
  isSuccess: boolean;
  errorMessage?: string;
  recordingFileBase64: string;
}

const TestRunRepository = {
  async createTestRun(gameProjectId: string, testRun: TestRunCreateEntity) {
    await db.testRun.create({
      data: {
        ...testRun,
        gameProjectId,
        testsResults: {
          createMany: {
            data: testRun.testsResults,
          },
        },
      },
    });
  },
  async listTestRuns(gameProjectId: string) {
    return await db.testRun.findMany({
      where: { gameProjectId },
      orderBy: { insertDate: "desc" },
    });
  },
  async findTestRun(testRunId: string) {
    return await db.testRun.findUnique({
      where: { id: testRunId },
      include: { testsResults: true },
    });
  },
};
export default TestRunRepository;

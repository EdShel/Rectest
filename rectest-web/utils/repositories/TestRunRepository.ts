import "server-only";
import db from "@/utils/db";

export interface TestRunCreateEntity {
  total: number;
  success: number;
  failed: number;
  tests: TestResultCreateEntity[];
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
            data: testRun.tests,
          },
        },
      },
    });
  },
};
export default TestRunRepository;

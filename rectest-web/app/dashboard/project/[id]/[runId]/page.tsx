import TestRunRepository from "@/utils/repositories/TestRunRepository";
import { notFound } from "next/navigation";
import TestResult from "./components/TestResult";

interface PathParams {
  runId: string;
}

export default async function TestRun({ params }: { params: PathParams }) {
  const testRun = await TestRunRepository.findTestRun(params.runId);

  if (!testRun) {
    notFound();
  }

  return (
    <div>
      <h1>Test result</h1>
      <p>Total {testRun.total}</p>
      <p>Success {testRun.success}</p>
      <p>Failed {testRun.failed}</p>

      <div>
        {testRun.testsResults.map((t) => (
          <TestResult isSuccess={t.isSuccess} videoBase64={t.recordingFileBase64} />
        ))}
      </div>
    </div>
  );
}

import TestRunRepository from "@/utils/repositories/TestRunRepository";
import { notFound } from "next/navigation";
import TestResult from "./components/TestResult";
import styles from "./page.module.css";

interface PathParams {
  runId: string;
}

export default async function TestRun({ params }: { params: PathParams }) {
  const testRun = await TestRunRepository.findTestRun(params.runId);

  if (!testRun) {
    notFound();
  }

  return (
    <div className="container">
      <h1>Test result</h1>
      <p className={styles.total}>
        TOTAL <span className={styles.value}>{testRun.total}</span>
      </p>
      <p className={styles.success}>
        SUCCESS <span className={styles.value}>{testRun.success}</span>
      </p>
      <p className={styles.failed}>
        FAILED <span className={styles.value}>{testRun.failed}</span>
      </p>

      <div>
        {testRun.testsResults.map((t) => (
          <TestResult
            isSuccess={t.isSuccess}
            videoBase64={t.recordingFileBase64}
            performance={t.performanceJson && JSON.parse(t.performanceJson)}
            testFile={t.testFile}
            errorMessage={t.errorMessage}
          />
        ))}
      </div>
    </div>
  );
}

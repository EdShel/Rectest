import ProjectRepository from "@/utils/repositories/ProjectRepository";
import TestRunRepository from "@/utils/repositories/TestRunRepository";
import Image from "next/image";
import { notFound } from "next/navigation";
import failedIcon from "@/public/failed-icon.svg";
import successIcon from "@/public/success-icon.svg";
import Link from "next/link";
import ProjectName from "./components/ProjectName";
import styles from "./page.module.css";
import clsx from "clsx";

interface PathParams {
  id: string;
}

export default async function Project({ params }: { params: PathParams }) {
  const testsPromise = TestRunRepository.listTestRuns(params.id);
  const projectPromise = ProjectRepository.findById(params.id);

  const [tests, project] = await Promise.all([testsPromise, projectPromise]);

  if (!project) {
    notFound();
  }

  return (
    <div className={clsx("container", styles.container)}>
      <ProjectName projectId={params.id} initialName={project.name} />
      <p className={styles.rename}>You can rename your project by pressing the text above</p>
      <div className={styles.tests}>
        {tests.map((test) => (
          <Link href={`/dashboard/project/${params.id}/${test.id}`} className={styles.testRun}>
            <Image
              src={test.failed ? failedIcon : successIcon}
              alt={test.failed ? "Failed" : "Success"}
              className={styles.icon}
            />
            <div className={styles.texts}>
              <p>{test.insertDate.toLocaleString()}</p>
              <p className={styles.total}>
                TOTAL <span className={styles.value}>{test.total}</span>
              </p>
              <p className={styles.success}>
                SUCCESS <span className={styles.value}>{test.success}</span>
              </p>
              <p className={styles.failed}>
                FAILED <span className={styles.value}>{test.failed}</span>
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

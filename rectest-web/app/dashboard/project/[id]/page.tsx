import ProjectRepository from "@/utils/repositories/ProjectRepository";
import TestRunRepository from "@/utils/repositories/TestRunRepository";
import { notFound } from "next/navigation";

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
    <div>
      <h1>{project.name}</h1>
      <div>
        {tests.map((test) => (
          <div>
            <p>{test.insertDate.toLocaleString()}</p>
            <p>Total: {test.total}</p>
            <p>Success: {test.success}</p>
            <p>Failed: {test.failed}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

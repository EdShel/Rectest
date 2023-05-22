import ProjectRepository from "@/utils/repositories/ProjectRepository";
import clsx from "clsx";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectItem from "./components/ProjectItem";
import styles from "./styles.module.css";

export default async function Dashboard() {
  const session = await getServerSession();
  if (!session?.user) {
    return notFound();
  }
  // @ts-ignore
  const userId: string = session.user.id;
  const projects = await ProjectRepository.list(userId);

  return (
    <div>
      <div className={clsx("container", styles.list)}>
        <h1>My projects</h1>
        <Link href="/dashboard/project/new">Create new project</Link>
        {projects.map((p) => (
          <ProjectItem project={p} />
        ))}
      </div>
    </div>
  );
}

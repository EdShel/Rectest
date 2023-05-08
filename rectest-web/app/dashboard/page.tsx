import ProjectRepository from "@/utils/repositories/ProjectRepository";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

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
      <Link href="/dashboard/project/new">Create new project</Link>
      {projects.map((p) => (
        <div>{p.name}</div>
      ))}
    </div>
  );
}

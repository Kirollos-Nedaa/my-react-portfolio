import { getAdminDb } from "@/lib/firebase/admin";
import { Project } from "@/types";
import { ProjectsManager } from "@/components/admin/ProjectsManager";

async function getProjects(): Promise<Project[]> {
  try {
    const snap = await getAdminDb().collection("projects").orderBy("order", "asc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
  } catch { return []; }
}

export default async function AdminProjectsPage() {
  return <ProjectsManager initialProjects={await getProjects()} />;
}

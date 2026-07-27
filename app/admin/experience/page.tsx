import { getAdminDb } from "@/lib/firebase/admin";
import { WorkExperience } from "@/types";
import { ExperienceManager } from "@/components/admin/ExperienceManager";

async function getExperience(): Promise<WorkExperience[]> {
  try {
    const snap = await getAdminDb().collection("workExperience").orderBy("order", "asc").get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkExperience));
  } catch { return []; }
}

export default async function AdminExperiencePage() {
  return <ExperienceManager initialItems={await getExperience()} />;
}

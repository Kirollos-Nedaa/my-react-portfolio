import { adminDb } from "@/lib/firebase/admin";
import { Project, WorkExperience, SiteConfig } from "@/types";

import { FloatingNav } from "@/components/ui/FloatingNavbar";
import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import RecentProjects from "@/components/RecentProjects";
import Clients from "@/components/Clients";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";

// ISR: page is cached and re-generated at most every 60 seconds.
// Content updates in the admin panel go live within a minute — no rebuild needed.
export const revalidate = 60;

const navItems = [
  { name: "About", link: "#about" },
  { name: "Projects", link: "#projects" },
  { name: "Work Experience", link: "#experience" },
  { name: "Contact", link: "#contact" },
];

async function getData() {
  try {
    const db = adminDb;
    const [projectsSnap, experienceSnap, configDoc] = await Promise.all([
      db.collection("projects").orderBy("order", "asc").get(),
      db.collection("workExperience").orderBy("order", "asc").get(),
      db.collection("siteConfig").doc("main").get(),
    ]);

    const projects: Project[] = projectsSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Project, "id">),
    }));

    const workExperience: WorkExperience[] = experienceSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<WorkExperience, "id">),
    }));

    const config: SiteConfig | null = configDoc.exists
      ? ({ id: configDoc.id, ...configDoc.data() } as SiteConfig)
      : null;

    return { projects, workExperience, config };
  } catch (err) {
    console.error("[Page] Failed to fetch data:", err);
    return { projects: [], workExperience: [], config: null };
  }
}

export default async function Home() {
  const { projects, workExperience, config } = await getData();

  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero config={config} />
        <Grid />
        <RecentProjects projects={projects} />
        <Clients />
        <Experience items={workExperience} />
        <Footer config={config} />
      </div>
    </main>
  );
}

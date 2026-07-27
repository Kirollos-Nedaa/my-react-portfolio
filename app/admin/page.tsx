import { adminDb } from "@/lib/firebase/admin";
import Link from "next/link";

async function getStats() {
  try {
    const db = adminDb;
    const [p, e, m] = await Promise.all([
      db.collection("projects").count().get(),
      db.collection("workExperience").count().get(),
      db.collection("media").count().get(),
    ]);
    return { projects: p.data().count, experience: e.data().count, media: m.data().count };
  } catch {
    return { projects: 0, experience: 0, media: 0 };
  }
}

const links = [
  { href: "/admin/projects", label: "Projects", desc: "Add, edit, or remove portfolio projects", icon: "◈" },
  { href: "/admin/experience", label: "Work Experience", desc: "Update your work history", icon: "◉" },
  { href: "/admin/media", label: "Media Library", desc: "Upload and manage images and files", icon: "◫" },
  { href: "/admin/config", label: "Site Settings", desc: "Edit hero text, bio, and contact info", icon: "◧" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <p className="text-purple font-mono text-xs uppercase tracking-widest mb-2">Portfolio CMS</p>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-white-100 mt-1 text-sm">
          Changes go live on the portfolio within 60 seconds — no rebuild needed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: "Projects", value: stats.projects },
          { label: "Experience entries", value: stats.experience },
          { label: "Media assets", value: stats.media },
        ].map((s) => (
          <div key={s.label} className="bg-black-200 border border-black-300 rounded-2xl p-6">
            <div className="text-4xl font-bold text-white font-mono">{s.value}</div>
            <div className="text-sm text-white-100 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-2 gap-4">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group bg-black-200 border border-black-300 rounded-2xl p-6 hover:border-purple/50 transition-all duration-200"
          >
            <div className="text-2xl mb-3 text-purple">{l.icon}</div>
            <div className="font-semibold text-white group-hover:text-purple transition-colors mb-1">{l.label}</div>
            <div className="text-sm text-white-100">{l.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

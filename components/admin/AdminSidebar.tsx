"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const nav = [
  { href: "/admin", label: "Dashboard", icon: "⊡" },
  { href: "/admin/projects", label: "Projects", icon: "◈" },
  { href: "/admin/experience", label: "Experience", icon: "◉" },
  { href: "/admin/media", label: "Media Library", icon: "◫" },
  { href: "/admin/config", label: "Site Settings", icon: "◧" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out.");
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Logout failed.");
    }
  }

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#00010f] border-r border-black-300 flex flex-col z-40">
      <div className="p-6 border-b border-black-300">
        <Link href="/" target="_blank" rel="noopener noreferrer">
          <p className="font-mono text-xs text-purple uppercase tracking-widest">Portfolio CMS</p>
          <p className="text-white font-bold mt-0.5">Kirollos Nedaa</p>
          <p className="text-white-100 text-xs mt-0.5">↗ View live site</p>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                active
                  ? "bg-purple/20 text-purple border border-purple/30"
                  : "text-white-100 hover:text-white hover:bg-black-200"
              )}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-black-300">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white-100 hover:text-red-400 hover:bg-red-400/5 transition-all duration-150"
        >
          <span className="w-5 text-center">→</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}

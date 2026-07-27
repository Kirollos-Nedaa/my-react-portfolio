import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin | Kirollos Nedaa Portfolio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black-100 flex">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

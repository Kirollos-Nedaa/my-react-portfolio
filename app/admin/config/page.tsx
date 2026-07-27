import { adminDb } from "@/lib/firebase/admin";
import { SiteConfig } from "@/types";
import { SiteConfigEditor } from "@/components/admin/SiteConfigEditor";

async function getConfig(): Promise<SiteConfig | null> {
  try {
    const doc = await adminDb.collection("siteConfig").doc("main").get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as SiteConfig;
  } catch { return null; }
}

export default async function AdminConfigPage() {
  return <SiteConfigEditor initialConfig={await getConfig()} />;
}

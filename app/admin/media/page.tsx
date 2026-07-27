import { getAdminDb } from "@/lib/firebase/admin";
import { MediaAsset } from "@/types";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

async function getMedia(): Promise<MediaAsset[]> {
  try {
    const snap = await getAdminDb().collection("media").orderBy("uploadedAt", "desc").limit(500).get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaAsset));
  } catch { return []; }
}

export default async function AdminMediaPage() {
  return <MediaLibrary initialAssets={await getMedia()} />;
}

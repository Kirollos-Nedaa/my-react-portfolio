import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { MediaAsset } from "@/types";

export async function GET() {
  try {
    const snap = await adminDb.collection("media").orderBy("uploadedAt", "desc").limit(500).get();
    const assets: MediaAsset[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaAsset));
    return NextResponse.json({ data: assets });
  } catch (err) {
    console.error("[API] GET media:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

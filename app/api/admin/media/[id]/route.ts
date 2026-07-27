import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { deleteFromBlob } from "@/lib/blob";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getAdminDb();
    const ref = db.collection("media").doc(params.id);
    const doc = await ref.get();
    if (!doc.exists) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { storagePath } = doc.data()!;
    if (storagePath) {
      try {
        await deleteFromBlob(storagePath);
      } catch (e: unknown) {
        if ((e as { code?: number })?.code !== 404) console.error("[API] Storage delete error:", e);
      }
    }

    await ref.delete();
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[API] DELETE media:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

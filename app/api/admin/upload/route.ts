import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { uploadToBlob } from "@/lib/blob";
import { MediaAsset } from "@/types";
import { v4 as uuidv4 } from "uuid";

const ALLOWED = [
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml",
  "application/pdf", "video/mp4", "video/webm",
];
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = ((formData.get("folder") as string) || "uploads")
      .replace(/[^a-z0-9_-]/gi, "_")
      .slice(0, 50);

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: `File type "${file.type}" not allowed` }, { status: 400 });
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 50 MB limit" }, { status: 400 });
    }

    const { url, pathname } = await uploadToBlob(file, folder);

    const id = uuidv4();
    const asset: MediaAsset = {
      id, name: file.name, url, storagePath: pathname,
      mimeType: file.type, sizeBytes: file.size, uploadedAt: Date.now(),
    };

    await getAdminDb().collection("media").doc(id).set(asset);
    return NextResponse.json({ data: asset }, { status: 201 });
  } catch (err) {
    console.error("[API] upload:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

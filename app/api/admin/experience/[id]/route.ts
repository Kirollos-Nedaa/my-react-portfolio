import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1).max(300).optional(),
  desc: z.string().min(1).max(2000).optional(),
  thumbnail: z.string().url().optional(),
  order: z.number().int().min(0).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    const db = getAdminDb();
    const ref = db.collection("workExperience").doc((await params).id);
    if (!(await ref.get()).exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.update({ ...parsed.data, updatedAt: Date.now() });
    const updated = await ref.get();
    return NextResponse.json({ data: { id: updated.id, ...updated.data() } });
  } catch (err) {
    console.error("[API] PUT experience:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = getAdminDb();
    const ref = db.collection("workExperience").doc((await params).id);
    if (!(await ref.get()).exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[API] DELETE experience:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

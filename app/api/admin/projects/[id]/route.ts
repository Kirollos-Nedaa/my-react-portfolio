import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const UpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  des: z.string().min(1).max(1000).optional(),
  img: z.string().url().optional(),
  iconLists: z.array(z.string()).max(10).optional(),
  link: z.string().url().optional().or(z.literal("")),
  repo: z.string().url().optional().or(z.literal("")),
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
    const db = adminDb;
    const ref = db.collection("projects").doc((await params).id);
    if (!(await ref.get()).exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.update({ ...parsed.data, updatedAt: Date.now() });
    const updated = await ref.get();
    return NextResponse.json({ data: { id: updated.id, ...updated.data() } });
  } catch (err) {
    console.error("[API] PUT project:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const db = adminDb;
    const ref = db.collection("projects").doc((await params).id);
    if (!(await ref.get()).exists)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    await ref.delete();
    return NextResponse.json({ data: { deleted: true } });
  } catch (err) {
    console.error("[API] DELETE project:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

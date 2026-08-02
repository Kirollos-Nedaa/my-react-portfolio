import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { z } from "zod";

const toUrl = (v: unknown) => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  if (!t) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`;
};

const UpdateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  des: z.string().trim().min(1).max(1000).optional(),
  img: z.string().trim().min(1).max(2000).optional(),
  iconLists: z.array(z.string()).max(10).optional(),
  link: z.preprocess(toUrl, z.string().url().or(z.literal(""))).optional(),
  repo: z.preprocess(toUrl, z.string().url().or(z.literal(""))).optional(),
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
    const db = getAdminDb();
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

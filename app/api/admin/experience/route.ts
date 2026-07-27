import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { WorkExperience } from "@/types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const Schema = z.object({
  title: z.string().min(1).max(300),
  desc: z.string().min(1).max(2000),
  thumbnail: z.string().url(),
  order: z.number().int().min(0).default(0),
});

export async function GET() {
  try {
    const db = adminDb;
    const snap = await db.collection("workExperience").orderBy("order", "asc").get();
    const items: WorkExperience[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as WorkExperience));
    return NextResponse.json({ data: items });
  } catch (err) {
    console.error("[API] GET experience:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const parsed = Schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const now = Date.now();
    const id = uuidv4();
    const item: WorkExperience = { id, ...parsed.data, createdAt: now, updatedAt: now };
    await adminDb.collection("workExperience").doc(id).set(item);
    return NextResponse.json({ data: item }, { status: 201 });
  } catch (err) {
    console.error("[API] POST experience:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

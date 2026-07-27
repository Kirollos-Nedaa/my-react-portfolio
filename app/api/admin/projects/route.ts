import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { Project } from "@/types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const Schema = z.object({
  title: z.string().min(1).max(200),
  des: z.string().min(1).max(1000),
  img: z.string().url(),
  iconLists: z.array(z.string()).max(10).default([]),
  link: z.string().url().optional().or(z.literal("")),
  repo: z.string().url().optional().or(z.literal("")),
  order: z.number().int().min(0).default(0),
});

export async function GET() {
  try {
    const db = getAdminDb();
    const snap = await db.collection("projects").orderBy("order", "asc").get();
    const projects: Project[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project));
    return NextResponse.json({ data: projects });
  } catch (err) {
    console.error("[API] GET projects:", err);
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
    const project: Project = { id, ...parsed.data, createdAt: now, updatedAt: now };
    await getAdminDb().collection("projects").doc(id).set(project);
    return NextResponse.json({ data: project }, { status: 201 });
  } catch (err) {
    console.error("[API] POST projects:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

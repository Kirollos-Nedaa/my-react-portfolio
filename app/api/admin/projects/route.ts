import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { Project } from "@/types";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

const toUrl = (v: unknown) => {
  if (typeof v !== "string") return v;
  const t = v.trim();
  if (!t) return "";
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(t) ? t : `https://${t}`;
};

const Schema = z.object({
  title: z.string().trim().min(1).max(200),
  des: z.string().trim().min(1).max(1000),
  img: z.string().trim().min(1).max(2000),
  iconLists: z.array(z.string()).max(10).default([]),
  link: z.preprocess(toUrl, z.string().url().or(z.literal(""))).optional(),
  repo: z.preprocess(toUrl, z.string().url().or(z.literal(""))).optional(),
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

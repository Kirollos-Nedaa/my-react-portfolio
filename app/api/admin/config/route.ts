import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase/admin";
import { SiteConfig } from "@/types";
import { z } from "zod";

const Schema = z.object({
  heroName: z.string().min(1).max(100),
  heroTagline: z.string().min(1).max(300),
  heroDescription: z.string().min(1).max(500),
  email: z.string().email(),
  githubUrl: z.string().url(),
  linkedinUrl: z.string().url(),
  whatsappLink: z.string().min(1),
  cvUrl: z.string().url().optional().or(z.literal("")),
});

export async function GET() {
  try {
    const doc = await getAdminDb().collection("siteConfig").doc("main").get();
    if (!doc.exists) return NextResponse.json({ data: null });
    return NextResponse.json({ data: { id: doc.id, ...doc.data() } as SiteConfig });
  } catch (err) {
    console.error("[API] GET config:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const parsed = Schema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const config: SiteConfig = { id: "main", ...parsed.data, updatedAt: Date.now() };
    await getAdminDb().collection("siteConfig").doc("main").set(config, { merge: true });
    return NextResponse.json({ data: config });
  } catch (err) {
    console.error("[API] PUT config:", err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

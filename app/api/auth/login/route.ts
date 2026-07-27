import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { getAuth } from "firebase-admin/auth";
import { adminDb } from "@/lib/firebase/admin";
import { sessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Verify token server-side — cannot be faked by client
    let decoded;
    try {
      decoded = await getAuth().verifyIdToken(idToken, true); // checkRevoked=true
    } catch {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const { uid, email } = decoded;

    // Only pre-approved UIDs in the "admins" Firestore collection can log in
    const db = adminDb;
    const adminDoc = await db.collection("admins").doc(uid).get();
    if (!adminDoc.exists) {
      console.warn(`[AUTH] Rejected login attempt uid=${uid} email=${email}`);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const response = NextResponse.json({ ok: true });
    const session = await getIronSession<SessionData>(
      request,
      response,
      sessionOptions,
    );
    session.isLoggedIn = true;
    session.userId = uid;
    session.email = email ?? "";
    await session.save();

    return response;
  } catch (err) {
    console.error("[AUTH] Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

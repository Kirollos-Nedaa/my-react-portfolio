import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { getAdminAuth, getAdminDb } from "@/lib/firebase/admin";
import { getSessionOptions, SessionData } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken || typeof idToken !== "string") {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Verify token server-side — cannot be faked by client.
    // checkRevoked is intentionally NOT enabled: it makes an extra network
    // call per login that frequently fails in serverless environments and
    // surfaces as a false "Invalid or expired token".
    let decoded;
    try {
      decoded = await getAdminAuth().verifyIdToken(idToken);
    } catch (err) {
      const code = (err as { code?: string }).code;
      console.error("[AUTH] verifyIdToken failed:", code, (err as Error).message);
      if (code === "auth/id-token-expired") {
        return NextResponse.json(
          { error: "Token expired, please sign in again" },
          { status: 401 },
        );
      }
      if (code === "auth/id-token-revoked") {
        return NextResponse.json(
          { error: "Token revoked, please sign in again" },
          { status: 401 },
        );
      }
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const { uid, email } = decoded;

    // Only pre-approved UIDs in the "admins" Firestore collection can log in.
    // Bootstrap: while the collection is empty, the verified user whose email
    // matches ADMIN_EMAIL becomes the first admin automatically.
    const db = getAdminDb();
    const adminsRef = db.collection("admins");
    const adminDoc = await adminsRef.doc(uid).get();
    let isAdmin = adminDoc.exists;

    if (!isAdmin) {
      const allowedEmail = process.env.ADMIN_EMAIL?.toLowerCase();
      if (allowedEmail && email?.toLowerCase() === allowedEmail) {
        const existing = await adminsRef.limit(1).get();
        if (existing.empty) {
          await adminsRef.doc(uid).set({
            uid,
            email,
            role: "super_admin",
            createdAt: new Date(),
          });
          console.info(`[AUTH] Bootstrapped first admin uid=${uid} email=${email}`);
          isAdmin = true;
        }
      }
    }

    if (!isAdmin) {
      console.warn(`[AUTH] Rejected login attempt uid=${uid} email=${email}`);
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const response = NextResponse.json({ ok: true });
    const session = await getIronSession<SessionData>(
      request,
      response,
      getSessionOptions(),
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

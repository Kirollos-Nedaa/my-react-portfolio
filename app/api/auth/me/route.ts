import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export async function GET(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);
  if (!session.isLoggedIn || !session.userId) {
    return NextResponse.json({ user: null }, { status: 401 });
  }
  return NextResponse.json({ user: { userId: session.userId, email: session.email } });
}

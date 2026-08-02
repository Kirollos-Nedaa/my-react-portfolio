import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { getSessionOptions, SessionData } from "@/lib/session";

// In-memory rate limiter (fine for Vercel single-region; swap for Upstash Redis for multi-region)
const rateMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

// Periodically clean up expired entries
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateMap.forEach((v, k) => { if (now > v.resetAt) rateMap.delete(k); });
  }, 60_000);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  // Rate limit auth endpoints: 10 attempts / 15 min per IP
  if (pathname.startsWith("/api/auth")) {
    if (isRateLimited(ip, 10, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Too many requests. Try again in 15 minutes." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }
  }

  // Rate limit admin API: 300 requests / min per IP
  if (pathname.startsWith("/api/admin")) {
    if (isRateLimited(ip, 300, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
  }

  // Protect /admin/* UI pages (except login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(request, res, getSessionOptions());
    if (!session.isLoggedIn || !session.userId) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    return res;
  }

  // Protect /api/admin/* routes
  if (pathname.startsWith("/api/admin")) {
    const res = NextResponse.next();
    const session = await getIronSession<SessionData>(request, res, getSessionOptions());
    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};

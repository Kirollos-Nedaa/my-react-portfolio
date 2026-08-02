import { SessionOptions } from "iron-session";
import { SessionData } from "@/types";

export type { SessionData };

// Lazily validated so importing this module never throws at build time.
// Missing SESSION_SECRET only surfaces when a session is actually created.

export function getSessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET environment variable is required (min 32 chars)",
    );
  }
  return {
    password,
    cookieName: "kn_portfolio_admin",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 hours
    },
  };
}

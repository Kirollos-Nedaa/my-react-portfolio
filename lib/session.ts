import { SessionOptions } from "iron-session";
import { SessionData } from "@/types";

export type { SessionData };

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET environment variable is required (min 32 chars)");
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET,
  cookieName: "kn_portfolio_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
  },
};

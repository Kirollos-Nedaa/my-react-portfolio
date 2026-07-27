"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClientApp } from "@/lib/firebase/client";
import { getAuth, signInWithEmailAndPassword, AuthError } from "firebase/auth";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      // Step 1: Firebase client auth
      const auth = getAuth(getClientApp());
      const credential = await signInWithEmailAndPassword(auth, email, password);

      // Step 2: Get short-lived ID token
      const idToken = await credential.user.getIdToken();

      // Step 3: Exchange for secure httpOnly session cookie via our API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Sign out of Firebase client-side (session is server-managed from here)
      await auth.signOut();

      toast.success("Welcome back, Kirollos.");
      router.push(from);
      router.refresh();
    } catch (err) {
      const code = (err as AuthError).code;
      let msg = "Login failed. Please try again.";
      if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
        msg = "Invalid email or password.";
      } else if (code === "auth/too-many-requests") {
        msg = "Too many attempts. Try again later.";
      } else if ((err as Error).message) {
        msg = (err as Error).message;
      }
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-black-100">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <p className="text-purple font-mono text-xs uppercase tracking-widest mb-2">Portfolio CMS</p>
          <h1 className="text-3xl font-bold text-white">Admin access</h1>
          <p className="text-white-100 mt-1 text-sm">Sign in to manage your portfolio content.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white-100 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg text-sm",
                "bg-black-200 border border-black-300 text-white",
                "placeholder:text-white-200/40",
                "focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
              )}
              placeholder="kirollosnedaa@gmail.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white-100 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg text-sm",
                "bg-black-200 border border-black-300 text-white",
                "placeholder:text-white-200/40",
                "focus:outline-none focus:ring-2 focus:ring-purple focus:border-transparent transition-all"
              )}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full px-4 py-2.5 rounded-lg text-sm font-semibold",
              "bg-purple hover:opacity-90 text-black-100",
              "transition-opacity duration-200",
              "focus:outline-none focus:ring-2 focus:ring-purple focus:ring-offset-2 focus:ring-offset-black-100",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

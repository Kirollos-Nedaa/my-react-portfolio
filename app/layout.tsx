import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kirollos Nedaa | Full-Stack Developer",
  description:
    "Full-Stack Developer based in Egypt. Transforming concepts into seamless user experiences.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kirollos Nedaa | Full-Stack Developer",
    description: "Full-Stack Developer based in Egypt.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{
            style: {
              background: "#000319",
              border: "1px solid rgba(255,255,255,0.125)",
              color: "#BEC1DD",
            },
          }}
        />
      </body>
    </html>
  );
}

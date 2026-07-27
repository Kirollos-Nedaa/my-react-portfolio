// ─── Public Firestore Collection Types ───────────────────────────────────────
// These match the exact shape already in your Firestore collections

export interface Project {
  id: string;
  title: string;
  des: string;            // description field name from your existing Firestore
  img: string;            // image URL (Firebase Storage)
  iconLists: string[];    // array of tech icon URLs
  link?: string;          // live demo URL
  repo?: string;          // GitHub repo URL
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface WorkExperience {
  id: string;
  title: string;          // role + company e.g. "Senior Dev @ Acme"
  desc: string;           // description
  thumbnail: string;      // company logo URL (Firebase Storage)
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface SiteConfig {
  id: string;             // always "main"
  heroName: string;
  heroTagline: string;
  heroDescription: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  whatsappLink: string;
  cvUrl: string;          // Firebase Storage URL for the CV PDF
  updatedAt: number;
}

export interface MediaAsset {
  id: string;
  name: string;
  url: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: number;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  details?: unknown;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface SessionData {
  userId?: string;
  email?: string;
  isLoggedIn: boolean;
}

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

// Lazily initialized so importing this module never throws at build time.
// Missing env vars only surface when the DB/auth is actually used at runtime.

let _adminApp: App | null = null;
let _adminDb: Firestore | null = null;
let _adminAuth: Auth | null = null;

function ensureAdminApp(): App {
  if (_adminApp) return _adminApp;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawPrivateKey) {
    throw new Error(
      "Missing required Firebase Admin environment variables: " +
        "FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.",
    );
  }

  // Format multi-line key properly
  const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

  const existing = getApps();
  _adminApp =
    existing.length > 0
      ? existing[0]
      : initializeApp({
          credential: cert({ projectId, clientEmail, privateKey }),
        });
  return _adminApp;
}

export function getAdminDb(): Firestore {
  if (!_adminDb) _adminDb = getFirestore(ensureAdminApp());
  return _adminDb;
}

export function getAdminAuth(): Auth {
  if (!_adminAuth) _adminAuth = getAuth(ensureAdminApp());
  return _adminAuth;
}

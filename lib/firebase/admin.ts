import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

// Format multi-line key properly
const privateKey = rawPrivateKey
  ? rawPrivateKey.replace(/\\n/g, "\n")
  : undefined;

let adminApp: App;

if (!getApps().length) {
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing required Firebase Admin environment variables.");
  }
  adminApp = initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  adminApp = getApps()[0];
}

export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);

import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// --- CONFIGURATION START ---
// Helper to safely access environment variables
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    // Safely access import.meta.env
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key];
    }
  } catch (e) {
    // Ignore if import.meta is not defined
  }
  return defaultValue;
};

const firebaseConfig = {
  apiKey: getEnvVar("VITE_FIREBASE_API_KEY", "YOUR_API_KEY_HERE"),
  authDomain: getEnvVar("VITE_FIREBASE_AUTH_DOMAIN", "YOUR_PROJECT_ID.firebaseapp.com"),
  projectId: getEnvVar("VITE_FIREBASE_PROJECT_ID", "YOUR_PROJECT_ID"),
  storageBucket: getEnvVar("VITE_FIREBASE_STORAGE_BUCKET", "YOUR_PROJECT_ID.appspot.com"),
  messagingSenderId: getEnvVar("VITE_FIREBASE_MESSAGING_SENDER_ID", "YOUR_MESSAGING_SENDER_ID"),
  appId: getEnvVar("VITE_FIREBASE_APP_ID", "YOUR_APP_ID")
};
// --- CONFIGURATION END ---

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Initialize only if keys are present and valid
const hasKeys = firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

if (hasKeys) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization failed:", error);
  }
} else {
  console.log("⚠️ Firebase keys missing. Running in LOCAL DEMO MODE.");
  console.log("To enable cloud features, update lib/firebase.ts with your config.");
}

export { auth, db, storage };
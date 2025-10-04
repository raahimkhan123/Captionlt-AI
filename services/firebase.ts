// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// TODO: Add your own Firebase configuration from your Firebase console
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

// Only initialize Firebase if the config is not a placeholder
if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
    } catch (error) {
        console.error("Error initializing Firebase:", error);
        // Set to null if initialization fails
        app = null;
        auth = null;
        db = null;
    }
} else {
    console.warn(
        "Firebase configuration is missing or incomplete. Using placeholders. " +
        "The app will run in a limited, offline mode. Please update services/firebase.ts " +
        "with your project credentials to enable authentication and database features."
    );
}

// Initialize and export Firebase services
export { app, auth, db };
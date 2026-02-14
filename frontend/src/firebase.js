import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDcdMzmLfQdR1ehJCuuNiabDQGFqLXg0fY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "anapan-ai-assistant.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "anapan-ai-assistant",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "anapan-ai-assistant.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1052265669071",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1052265669071:web:f6ed2a032cdda953b632ba"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

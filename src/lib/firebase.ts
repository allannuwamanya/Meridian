import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyAsm8WGTm9GYdBrqe1c0ObSbO5TKt4nvnU",
  authDomain: "resume-302c8.firebaseapp.com",
  projectId: "resume-302c8",
  storageBucket: "resume-302c8.firebasestorage.app",
  messagingSenderId: "992868746748",
  appId: "1:992868746748:web:f04e8296d3d8e045c19e79",
  measurementId: "G-LNPSDT1TXC",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Analytics only on client-side
if (typeof window !== "undefined") {
  isSupported().then((yes) => {
    if (yes) getAnalytics(app);
  });
}

// Firebase AI Logic — Gemini via Google AI backend
// Uses the free Google AI (Gemini Developer API) via Firebase
const ai = getAI(app, { backend: new GoogleAIBackend() });

export const geminiFlash = getGenerativeModel(ai, { model: "gemini-2.0-flash" });

export { app };

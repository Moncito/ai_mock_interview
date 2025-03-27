import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyAPOVLJuHXIf57UIWEdixCnH08fqKXjCuE",
authDomain: "saintprep-a9553.firebaseapp.com",
projectId: "saintprep-a9553",
storageBucket: "saintprep-a9553.firebasestorage.app",
messagingSenderId: "785543504540",
appId: "1:785543504540:web:63a20917269b9c48e64359",
measurementId: "G-NPT3Q6CFC7"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);


import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAPdCiZ-s3iZ2C4J5rMUOcf9GKPqyR8oAs",
  authDomain: "studio-7402970125-b13d0.firebaseapp.com",
  projectId: "studio-7402970125-b13d0",
  storageBucket: "studio-7402970125-b13d0.appspot.com",
  messagingSenderId: "171196958362",
  appId: "1:171196958362:web:f95a3bd322b04b5aa74123",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { Shortcut } from "@/types/shortcut";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

export const addShortcut = async (shortcut: Omit<Shortcut, "id">) => {
  try {
    const docRef = await addDoc(collection(db, "shortcuts"), shortcut);
    return docRef.id;
  } catch (error) {
    console.error("Error adding shortcut: ", error);
    throw error;
  }
};

export const getShortcuts = async (): Promise<Shortcut[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "shortcuts"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Shortcut)
    );
  } catch (error) {
    console.error("Error fetching shortcuts: ", error);
    throw error;
  }
};

export { db };

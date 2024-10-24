import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
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
    const docRef = await addDoc(collection(db, "shortcuts"), {
      ...shortcut,
      createdAt: new Date().toISOString(),
      isDeleted: false,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding shortcut:", error);
    throw error;
  }
};

export const getShortcuts = async (): Promise<Shortcut[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "shortcuts"));
    return querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Shortcut))
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ); // ここでソート
  } catch (error) {
    console.error("Error fetching shortcuts: ", error);
    throw error;
  }
};

export const updateShortcut = async (shortcut: Shortcut) => {
  try {
    const shortcutRef = doc(db, "shortcuts", shortcut.id);
    const { id, ...updateData } = shortcut;
    await updateDoc(shortcutRef, updateData);
    return true;
  } catch (error) {
    console.error("Error updating shortcut: ", error);
    throw error;
  }
};

export const softDeleteShortcut = async (shortcutId: string) => {
  const shortcutRef = doc(db, "shortcuts", shortcutId);
  await updateDoc(shortcutRef, { isDeleted: true });
  return true;
};

export const undoDeleteShortcut = async (shortcutId: string) => {
  const shortcutRef = doc(db, "shortcuts", shortcutId);
  await updateDoc(shortcutRef, { isDeleted: false });
  return true;
};

export { db };

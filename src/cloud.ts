import { doc, getDoc, setDoc } from "firebase/firestore";
import { parseBooks, type Books } from "./books";
import { getDb } from "./firebase";

function userDoc(uid: string) {
  const db = getDb();
  if (!db) return null;
  return doc(db, "users", uid);
}

export async function loadUserBooks(uid: string): Promise<Books | null> {
  const ref = userDoc(uid);
  if (!ref) return null;
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return parseBooks(snap.data()?.books);
}

export async function saveUserBooks(uid: string, books: Books): Promise<void> {
  const ref = userDoc(uid);
  if (!ref) return;
  await setDoc(ref, { books, updatedAt: Date.now() });
}

import { useSyncExternalStore } from "react";
import { dummySuppliers, loadBooks, saveBooks, type Books } from "./books";
import { loadUserBooks, saveUserBooks } from "./cloud";

let books = loadBooks();
if (books.suppliers.length === 0) {
  books = { ...books, suppliers: dummySuppliers() };
}
saveBooks(books);

const listeners = new Set<() => void>();
let cloudUid: string | null = null;
let saveTick = 0;

function emit() {
  saveBooks(books);
  listeners.forEach((l) => l());
}

function queueCloudSave(uid: string) {
  const tick = ++saveTick;
  window.setTimeout(() => {
    if (tick !== saveTick || cloudUid !== uid) return;
    void saveUserBooks(uid, books);
  }, 400);
}

export function getBooks(): Books {
  return books;
}

export function setBooks(next: Books) {
  books = next;
  emit();
  if (cloudUid) queueCloudSave(cloudUid);
}

export async function attachCloud(uid: string | null) {
  cloudUid = uid;
  saveTick += 1;
  if (!uid) return;
  try {
    const remote = await loadUserBooks(uid);
    if (cloudUid !== uid) return;
    if (remote) {
      books = remote;
      emit();
      return;
    }
    await saveUserBooks(uid, books);
  } catch {
    /* keep the on-device copy if the cloud is unreachable */
  }
}

export function useBooks(): Books {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => books,
    () => books,
  );
}

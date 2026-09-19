import { useSyncExternalStore } from "react";
import {
  emptyBooks,
  isDummyBooks,
  lastPersistUid,
  loadBooks,
  saveBooks,
  setPersistUid,
  type Books,
} from "./books";
import { loadUserBooks, saveUserBooks } from "./cloud";

setPersistUid(lastPersistUid());
let books = loadBooks();
saveBooks(books);

const listeners = new Set<() => void>();
let cloudUid: string | null = lastPersistUid();
let saveTick = 0;

function emit() {
  saveBooks(books);
  listeners.forEach((l) => l());
}

function queueCloudSave(uid: string) {
  const tick = ++saveTick;
  window.setTimeout(() => {
    if (tick !== saveTick || cloudUid !== uid) return;
    if (isDummyBooks(books)) return;
    void saveUserBooks(uid, books);
  }, 400);
}

export function getBooks(): Books {
  return books;
}

export function setBooks(next: Books) {
  books = { ...next, sample: false };
  emit();
  if (cloudUid) queueCloudSave(cloudUid);
}

export async function attachCloud(uid: string | null) {
  cloudUid = uid;
  saveTick += 1;
  setPersistUid(uid);
  books = loadBooks();
  emit();
  if (!uid) return;
  try {
    const remote = await loadUserBooks(uid);
    if (cloudUid !== uid) return;
    if (remote && !isDummyBooks(remote)) {
      books = remote;
      emit();
      return;
    }
    if (isDummyBooks(books)) books = emptyBooks();
    emit();
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

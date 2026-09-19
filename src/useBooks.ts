import { useSyncExternalStore } from "react";
import { loadBooks, saveBooks, type Books } from "./books";

let books = loadBooks();
const listeners = new Set<() => void>();

function emit() {
  saveBooks(books);
  listeners.forEach((l) => l());
}

export function getBooks(): Books {
  return books;
}

export function setBooks(next: Books) {
  books = next;
  emit();
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

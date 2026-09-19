import { useEffect, useState } from "react";
import {
  postSale,
  restock,
  totals,
  upsertItem,
  type ItemKind,
  type Period,
  type TillMode,
} from "./books";
import { setBooks, useBooks } from "./useBooks";

export function useTill(period: Period) {
  const books = useBooks();
  const [mode, setMode] = useState<TillMode>("sale");
  const [itemId, setItemId] = useState(books.items[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newSell, setNewSell] = useState("");
  const [newKind, setNewKind] = useState<ItemKind>("Accessory");
  const [supplierId, setSupplierId] = useState(books.suppliers[0]?.id ?? "");
  const [restockCost, setRestockCost] = useState("");
  const [error, setError] = useState("");
  const [settled, setSettled] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);

  const selected = books.items.find((i) => i.id === itemId);

  useEffect(() => {
    if (!books.items.some((i) => i.id === itemId)) {
      setItemId(books.items[0]?.id ?? "");
    }
  }, [books.items, itemId]);

  useEffect(() => {
    if (!books.suppliers.some((s) => s.id === supplierId)) {
      setSupplierId(books.suppliers[0]?.id ?? "");
    }
  }, [books.suppliers, supplierId]);

  function bump(keys: string[], shouldFlash: boolean) {
    setSettled(keys);
    setFlash(shouldFlash);
    window.setTimeout(() => {
      setSettled([]);
      setFlash(false);
    }, 720);
  }

  function apply(next: ReturnType<typeof postSale>, keys: string[]) {
    if (typeof next === "string") {
      setError(next);
      return false;
    }
    setError("");
    setBooks(next);
    const after = totals(next, period);
    bump(keys, after.profit < 0);
    return true;
  }

  function switchMode(next: TillMode) {
    setMode(next);
    setError("");
  }

  function onSale() {
    return apply(postSale(books, itemId, qty), ["profit", "cash", "stock"]);
  }

  function onRestock() {
    if (!selected) {
      setError("Pick an item to restock.");
      return;
    }
    const cost = restockCost === "" ? selected.cost : Number(restockCost);
    if (Number.isNaN(cost) || cost < 0) {
      setError("Rate cannot be negative.");
      return;
    }
    apply(restock(books, selected.id, qty, true, supplierId || selected.supplierId, cost), [
      "cash",
      "stock",
      "spend",
    ]);
  }

  function onAddItem() {
    const next = upsertItem(books, {
      name: newName,
      qty: Number(qty) || 0,
      cost: Number(newCost) || 0,
      sell: Number(newSell) || 0,
      lowAt: qty > 2 ? 2 : 1,
      kind: newKind,
      supplierId,
    });
    if (!apply(next, ["stock"])) return false;
    setNewName("");
    setNewCost("");
    setNewSell("");
    return true;
  }

  function onStockIn(target: string) {
    if (target === "__new__") return onAddItem();
    const item = books.items.find((i) => i.id === target);
    if (!item) {
      setError("Pick an item to restock.");
      return false;
    }
    const cost = restockCost === "" ? item.cost : Number(restockCost);
    if (Number.isNaN(cost) || cost < 0) {
      setError("Rate cannot be negative.");
      return false;
    }
    return apply(restock(books, item.id, qty, true, supplierId || item.supplierId, cost), [
      "cash",
      "stock",
      "spend",
    ]);
  }

  function pick(id: string) {
    setItemId(id);
    setQty(1);
    setError("");
    const item = books.items.find((i) => i.id === id);
    if (item) {
      if (item.supplierId) setSupplierId(item.supplierId);
      setRestockCost(String(item.cost));
    }
  }

  return {
    books,
    mode,
    switchMode,
    itemId,
    setItemId,
    qty,
    setQty,
    newName,
    setNewName,
    newCost,
    setNewCost,
    newSell,
    setNewSell,
    newKind,
    setNewKind,
    supplierId,
    setSupplierId,
    restockCost,
    setRestockCost,
    error,
    setError,
    settled,
    flash,
    selected,
    onSale,
    onRestock,
    onAddItem,
    onStockIn,
    pick,
  };
}

export type Till = ReturnType<typeof useTill>;

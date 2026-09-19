import { todayKey, uid } from "./format";

export type Period = "today" | "all";
export type TillMode = "sale" | "expense" | "stock";

export type Item = {
  id: string;
  name: string;
  qty: number;
  cost: number;
  sell: number;
  lowAt: number;
};

export type Sale = {
  id: string;
  at: string;
  itemId: string;
  itemName: string;
  qty: number;
  unitSell: number;
  unitCost: number;
};

export type Expense = {
  id: string;
  at: string;
  category: string;
  amount: number;
  note: string;
};

export type Books = {
  openingCash: number;
  items: Item[];
  sales: Sale[];
  expenses: Expense[];
  sample: boolean;
};

export const EXPENSE_CATEGORIES = [
  "K-Electric",
  "Rent",
  "Internet",
  "Courier",
  "Stock in",
  "Shop",
  "Other",
] as const;

export type Totals = {
  revenue: number;
  cogs: number;
  spend: number;
  profit: number;
  cash: number;
  stockQty: number;
  stockValue: number;
};

const KEY = "counter-books.v1";

export function sampleBooks(): Books {
  const items: Item[] = [
    { id: "hp-15s", name: "HP 15s i5 8/512", qty: 2, cost: 128000, sell: 142000, lowAt: 2 },
    { id: "dell-vostro", name: "Dell Vostro 15", qty: 1, cost: 155000, sell: 172000, lowAt: 1 },
    { id: "kingston-512", name: "Kingston A400 512GB", qty: 12, cost: 7200, sell: 8400, lowAt: 4 },
    { id: "kingston-1tb", name: "Kingston NV2 1TB", qty: 6, cost: 14500, sell: 16800, lowAt: 3 },
    { id: "m185", name: "Logitech M185", qty: 7, cost: 2100, sell: 2800, lowAt: 4 },
    { id: "ddr4-8", name: "DDR4 8GB", qty: 3, cost: 4200, sell: 5200, lowAt: 4 },
    { id: "archer-c6", name: "TP-Link Archer C6", qty: 4, cost: 7800, sell: 9500, lowAt: 2 },
    { id: "hdmi-2m", name: "HDMI 2m", qty: 18, cost: 280, sell: 450, lowAt: 6 },
    { id: "mouse-pad", name: "Mouse pad", qty: 15, cost: 120, sell: 250, lowAt: 6 },
    { id: "wd-1tb", name: "WD 1TB HDD", qty: 5, cost: 9200, sell: 10800, lowAt: 2 },
  ];

  const now = new Date();
  const at = (hoursAgo: number, minutes: number) => {
    const d = new Date(now);
    d.setHours(d.getHours() - hoursAgo, minutes, 0, 0);
    return d.toISOString();
  };
  const daysAgo = (days: number, hour: number, minute: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const sales: Sale[] = [
    {
      id: uid(),
      at: at(2, 2),
      itemId: "hp-15s",
      itemName: "HP 15s i5 8/512",
      qty: 1,
      unitSell: 142000,
      unitCost: 128000,
    },
    {
      id: uid(),
      at: at(3, 41),
      itemId: "kingston-512",
      itemName: "Kingston A400 512GB",
      qty: 1,
      unitSell: 8400,
      unitCost: 7200,
    },
    {
      id: uid(),
      at: at(4, 18),
      itemId: "m185",
      itemName: "Logitech M185",
      qty: 1,
      unitSell: 2800,
      unitCost: 2100,
    },
  ];

  const expenses: Expense[] = [
    { id: uid(), at: daysAgo(4, 11, 10), category: "K-Electric", amount: 18600, note: "August bill" },
    { id: uid(), at: daysAgo(6, 10, 0), category: "Rent", amount: 12000, note: "Shop" },
    { id: uid(), at: at(1, 55), category: "Courier", amount: 2550, note: "Lahore parts" },
  ];

  return {
    openingCash: 50000,
    items,
    sales,
    expenses,
    sample: true,
  };
}

export function emptyBooks(openingCash = 0): Books {
  return {
    openingCash,
    items: [],
    sales: [],
    expenses: [],
    sample: false,
  };
}

export function loadBooks(): Books {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return sampleBooks();
    const parsed = JSON.parse(raw) as Books;
    if (!parsed || !Array.isArray(parsed.items)) return sampleBooks();
    return parsed;
  } catch {
    return sampleBooks();
  }
}

export function saveBooks(books: Books): void {
  localStorage.setItem(KEY, JSON.stringify(books));
}

function inPeriod(iso: string, period: Period): boolean {
  if (period === "all") return true;
  return iso.slice(0, 10) === todayKey();
}

export function totals(books: Books, period: Period): Totals {
  const sales = books.sales.filter((s) => inPeriod(s.at, period));
  const expenses = books.expenses.filter((e) => inPeriod(e.at, period));
  const revenue = sales.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const cogs = sales.reduce((n, s) => n + s.qty * s.unitCost, 0);
  const spend = expenses.reduce((n, e) => n + e.amount, 0);
  const cashSales = books.sales.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const cashSpend = books.expenses.reduce((n, e) => n + e.amount, 0);
  const stockQty = books.items.reduce((n, i) => n + i.qty, 0);
  const stockValue = books.items.reduce((n, i) => n + i.qty * i.cost, 0);
  return {
    revenue,
    cogs,
    spend,
    profit: revenue - cogs - spend,
    cash: books.openingCash + cashSales - cashSpend,
    stockQty,
    stockValue,
  };
}

export function periodSales(books: Books, period: Period): Sale[] {
  return books.sales
    .filter((s) => inPeriod(s.at, period))
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function periodExpenses(books: Books, period: Period): Expense[] {
  return books.expenses
    .filter((e) => inPeriod(e.at, period))
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function feed(books: Books, period: Period): Array<{ at: string; text: string }> {
  const rows: Array<{ at: string; text: string }> = [
    ...periodSales(books, period).map((s) => ({
      at: s.at,
      text: `SALE ${s.itemName} ${s.qty}x Rs ${Math.round(s.qty * s.unitSell).toLocaleString("en-US")}`,
    })),
    ...periodExpenses(books, period).map((e) => ({
      at: e.at,
      text: `EXPENSE ${e.category} Rs ${Math.round(e.amount).toLocaleString("en-US")}`,
    })),
  ];
  return rows.sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function lowItems(books: Books): Item[] {
  return books.items.filter((i) => i.qty <= i.lowAt);
}

export function postSale(books: Books, itemId: string, qty: number): Books | string {
  const item = books.items.find((i) => i.id === itemId);
  if (!item) return "Pick an item from the bins.";
  if (qty < 1) return "Quantity must be at least 1.";
  if (qty > item.qty) return `Only ${item.qty} on the shelf.`;
  const sale: Sale = {
    id: uid(),
    at: new Date().toISOString(),
    itemId: item.id,
    itemName: item.name,
    qty,
    unitSell: item.sell,
    unitCost: item.cost,
  };
  return {
    ...books,
    sample: false,
    items: books.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty - qty } : i)),
    sales: [sale, ...books.sales],
  };
}

export function postExpense(
  books: Books,
  category: string,
  amount: number,
  note: string,
): Books | string {
  if (!category) return "Pick a category.";
  if (!(amount > 0)) return "Amount must be greater than 0.";
  const expense: Expense = {
    id: uid(),
    at: new Date().toISOString(),
    category,
    amount,
    note: note.trim(),
  };
  return {
    ...books,
    sample: false,
    expenses: [expense, ...books.expenses],
  };
}

export function upsertItem(
  books: Books,
  draft: { id?: string; name: string; qty: number; cost: number; sell: number; lowAt: number },
): Books | string {
  const name = draft.name.trim();
  if (!name) return "Item needs a name.";
  if (draft.qty < 0 || draft.cost < 0 || draft.sell < 0) return "Numbers cannot be negative.";
  if (draft.id) {
    return {
      ...books,
      sample: false,
      items: books.items.map((i) =>
        i.id === draft.id
          ? { ...i, name, qty: draft.qty, cost: draft.cost, sell: draft.sell, lowAt: draft.lowAt }
          : i,
      ),
    };
  }
  const item: Item = {
    id: uid(),
    name,
    qty: draft.qty,
    cost: draft.cost,
    sell: draft.sell,
    lowAt: draft.lowAt || 2,
  };
  return { ...books, sample: false, items: [...books.items, item] };
}

export function restock(
  books: Books,
  itemId: string,
  qty: number,
  payFromCash: boolean,
): Books | string {
  const item = books.items.find((i) => i.id === itemId);
  if (!item) return "Pick an item to restock.";
  if (qty < 1) return "Quantity must be at least 1.";
  let next: Books = {
    ...books,
    sample: false,
    items: books.items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i)),
  };
  if (payFromCash) {
    const posted = postExpense(next, "Stock in", qty * item.cost, `Restock ${item.name} x${qty}`);
    if (typeof posted === "string") return posted;
    next = posted;
  }
  return next;
}

export function removeItem(books: Books, itemId: string): Books {
  return {
    ...books,
    sample: false,
    items: books.items.filter((i) => i.id !== itemId),
  };
}

import { hourLabel, startOfMonth, startOfWeek, todayKey, uid } from "./format";

export type Period = "today" | "week" | "month";
export type TillMode = "sale" | "stock";
export type Page = "home" | "stock";

export const PERIODS: { id: Period; label: string }[] = [
  { id: "today", label: "Today" },
  { id: "week", label: "Week" },
  { id: "month", label: "Month" },
];

export type ItemKind = "Laptop" | "Storage" | "Network" | "Accessory";

export const ITEM_KINDS: ItemKind[] = ["Laptop", "Storage", "Network", "Accessory"];

export type Item = {
  id: string;
  name: string;
  qty: number;
  cost: number;
  sell: number;
  lowAt: number;
  kind?: ItemKind;
  supplierId?: string;
  addedAt?: string;
};

export type Supplier = {
  id: string;
  name: string;
  phone: string;
  city: string;
  note: string;
};

export type StockIn = {
  id: string;
  at: string;
  itemId: string;
  qty: number;
  unitCost: number;
  supplierId: string;
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
  suppliers: Supplier[];
  stockIns: StockIn[];
  sample: boolean;
};

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
const UID_KEY = "counter-books.uid";
let persistKey = KEY;

export function setPersistUid(uid: string | null) {
  persistKey = uid ? `${KEY}.${uid}` : KEY;
  if (uid) localStorage.setItem(UID_KEY, uid);
  else localStorage.removeItem(UID_KEY);
}

export function lastPersistUid(): string | null {
  return localStorage.getItem(UID_KEY);
}

export const DUMMY_SUPPLIERS: Supplier[] = [
  {
    id: "hall-road",
    name: "Hall Road Traders",
    phone: "0300 441 2288",
    city: "Lahore",
    note: "Laptops and branded PCs",
  },
  {
    id: "hafeez",
    name: "Hafeez Center",
    phone: "0321 555 0190",
    city: "Lahore",
    note: "SSDs, RAM, and drives",
  },
  {
    id: "saddar",
    name: "Saddar Parts",
    phone: "021 3567 4411",
    city: "Karachi",
    note: "Cables, mice, and networking",
  },
  {
    id: "blue-area",
    name: "Blue Area Computers",
    phone: "051 111 2288",
    city: "Islamabad",
    note: "Adapters, chargers, and docks",
  },
  {
    id: "raja-bazaar",
    name: "Raja Bazaar Tech",
    phone: "0333 550 0199",
    city: "Rawalpindi",
    note: "Used laptops and parts",
  },
  {
    id: "uni-road",
    name: "University Road IT",
    phone: "091 570 4410",
    city: "Peshawar",
    note: "Routers and Wi-Fi kits",
  },
  {
    id: "clock-tower",
    name: "Clock Tower Supplies",
    phone: "041 261 1188",
    city: "Faisalabad",
    note: "Mice, pads, and cables",
  },
  {
    id: "tariq-road",
    name: "Tariq Road Electronics",
    phone: "021 3455 0090",
    city: "Karachi",
    note: "UPS, power, and accessories",
  },
];

export function dummySuppliers(): Supplier[] {
  return DUMMY_SUPPLIERS.map((s) => ({ ...s }));
}

export function sampleBooks(): Books {
  const suppliers = dummySuppliers();

  const items: Item[] = [
    { id: "hp-15s", name: "HP Laptop", qty: 2, cost: 128000, sell: 142000, lowAt: 2, kind: "Laptop", supplierId: "hall-road", addedAt: "" },
    { id: "dell-vostro", name: "Dell Laptop", qty: 1, cost: 155000, sell: 172000, lowAt: 1, kind: "Laptop", supplierId: "hall-road", addedAt: "" },
    { id: "kingston-512", name: "SSD 512GB", qty: 12, cost: 7200, sell: 8400, lowAt: 4, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "kingston-1tb", name: "SSD 1TB", qty: 6, cost: 14500, sell: 16800, lowAt: 3, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "ssd-256", name: "SSD 256GB", qty: 8, cost: 4800, sell: 5800, lowAt: 3, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "wd-1tb", name: "Hard Drive", qty: 5, cost: 9200, sell: 10800, lowAt: 2, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "ddr4-8", name: "RAM 8GB", qty: 3, cost: 4200, sell: 5200, lowAt: 4, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "ram-16", name: "RAM 16GB", qty: 4, cost: 7800, sell: 9500, lowAt: 2, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "m185", name: "Mouse", qty: 7, cost: 2100, sell: 2800, lowAt: 4, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "keyboard", name: "Keyboard", qty: 9, cost: 850, sell: 1200, lowAt: 4, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "mouse-pad", name: "Mouse Pad", qty: 15, cost: 120, sell: 250, lowAt: 6, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "hdmi-2m", name: "HDMI Cable", qty: 18, cost: 280, sell: 450, lowAt: 6, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "usb-cable", name: "USB Cable", qty: 22, cost: 80, sell: 180, lowAt: 8, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "lan-cable", name: "LAN Cable", qty: 16, cost: 90, sell: 180, lowAt: 6, kind: "Network", supplierId: "saddar", addedAt: "" },
    { id: "usb-hub", name: "USB Hub", qty: 8, cost: 650, sell: 950, lowAt: 3, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "flash", name: "Flash Drive", qty: 20, cost: 450, sell: 700, lowAt: 6, kind: "Storage", supplierId: "hafeez", addedAt: "" },
    { id: "archer-c6", name: "Wi-Fi Router", qty: 4, cost: 7800, sell: 9500, lowAt: 2, kind: "Network", supplierId: "uni-road", addedAt: "" },
    { id: "webcam", name: "Webcam", qty: 4, cost: 3200, sell: 4200, lowAt: 2, kind: "Accessory", supplierId: "clock-tower", addedAt: "" },
    { id: "speaker", name: "Speaker", qty: 5, cost: 2400, sell: 3200, lowAt: 2, kind: "Accessory", supplierId: "clock-tower", addedAt: "" },
    { id: "headset", name: "Headset", qty: 7, cost: 1500, sell: 2200, lowAt: 3, kind: "Accessory", supplierId: "clock-tower", addedAt: "" },
    { id: "charger", name: "Laptop Charger", qty: 6, cost: 1800, sell: 2600, lowAt: 3, kind: "Accessory", supplierId: "blue-area", addedAt: "" },
    { id: "adapter", name: "Power Adapter", qty: 5, cost: 900, sell: 1400, lowAt: 2, kind: "Accessory", supplierId: "blue-area", addedAt: "" },
    { id: "cooling", name: "Cooling Pad", qty: 6, cost: 700, sell: 1100, lowAt: 3, kind: "Accessory", supplierId: "saddar", addedAt: "" },
    { id: "ups", name: "UPS", qty: 3, cost: 8500, sell: 10500, lowAt: 1, kind: "Accessory", supplierId: "tariq-road", addedAt: "" },
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
    { id: uid(), at: at(2, 2), itemId: "hp-15s", itemName: "HP Laptop", qty: 1, unitSell: 142000, unitCost: 128000 },
    { id: uid(), at: at(3, 41), itemId: "kingston-512", itemName: "SSD 512GB", qty: 1, unitSell: 8400, unitCost: 7200 },
    { id: uid(), at: at(4, 18), itemId: "m185", itemName: "Mouse", qty: 1, unitSell: 2800, unitCost: 2100 },
    { id: uid(), at: at(1, 12), itemId: "keyboard", itemName: "Keyboard", qty: 1, unitSell: 1200, unitCost: 850 },
    { id: uid(), at: at(5, 8), itemId: "flash", itemName: "Flash Drive", qty: 2, unitSell: 700, unitCost: 450 },
    { id: uid(), at: daysAgo(2, 15, 20), itemId: "kingston-512", itemName: "SSD 512GB", qty: 2, unitSell: 8400, unitCost: 7200 },
    { id: uid(), at: daysAgo(3, 11, 40), itemId: "charger", itemName: "Laptop Charger", qty: 1, unitSell: 2600, unitCost: 1800 },
    { id: uid(), at: daysAgo(10, 12, 5), itemId: "hdmi-2m", itemName: "HDMI Cable", qty: 3, unitSell: 450, unitCost: 280 },
  ];

  const expenses: Expense[] = [];

  const added: Record<string, string> = {
    "hp-15s": daysAgo(20, 10, 15),
    "dell-vostro": daysAgo(18, 11, 40),
    "kingston-512": daysAgo(25, 16, 5),
    "kingston-1tb": daysAgo(14, 12, 20),
    "ssd-256": daysAgo(11, 10, 20),
    "wd-1tb": daysAgo(9, 15, 30),
    "ddr4-8": daysAgo(12, 14, 10),
    "ram-16": daysAgo(8, 13, 15),
    m185: daysAgo(22, 9, 50),
    keyboard: daysAgo(19, 10, 5),
    "mouse-pad": daysAgo(30, 11, 5),
    "hdmi-2m": daysAgo(30, 11, 0),
    "usb-cable": daysAgo(21, 12, 0),
    "lan-cable": daysAgo(17, 11, 30),
    "usb-hub": daysAgo(13, 16, 10),
    flash: daysAgo(15, 9, 40),
    "archer-c6": daysAgo(16, 13, 25),
    webcam: daysAgo(7, 14, 20),
    speaker: daysAgo(6, 12, 45),
    headset: daysAgo(10, 15, 10),
    charger: daysAgo(14, 11, 0),
    adapter: daysAgo(12, 10, 30),
    cooling: daysAgo(5, 16, 5),
    ups: daysAgo(4, 9, 20),
  };

  for (const item of items) {
    item.addedAt = added[item.id] ?? daysAgo(15, 10, 0);
  }

  const stockIns: StockIn[] = items.map((item) => ({
    id: uid(),
    at: item.addedAt ?? daysAgo(20, 10, 0),
    itemId: item.id,
    qty: item.qty,
    unitCost: item.cost,
    supplierId: item.supplierId ?? "",
  }));

  for (const item of items) {
    const sold = sales.filter((s) => s.itemId === item.id).reduce((n, s) => n + s.qty, 0);
    item.qty = Math.max(0, item.qty - sold);
  }

  return {
    openingCash: 50000,
    items,
    sales,
    expenses,
    suppliers,
    stockIns,
    sample: true,
  };
}

export function emptyBooks(openingCash = 0): Books {
  return {
    openingCash,
    items: [],
    sales: [],
    expenses: [],
    suppliers: [],
    stockIns: [],
    sample: false,
  };
}

const SAMPLE_ITEM_IDS = new Set([
  "hp-15s",
  "dell-vostro",
  "kingston-512",
  "kingston-1tb",
  "ssd-256",
  "wd-1tb",
  "ddr4-8",
  "ram-16",
  "m185",
  "keyboard",
  "mouse-pad",
  "hdmi-2m",
  "usb-cable",
  "lan-cable",
  "usb-hub",
  "flash",
  "archer-c6",
  "webcam",
  "speaker",
  "headset",
  "charger",
  "adapter",
  "cooling",
  "ups",
]);

export function isDummyBooks(books: Books): boolean {
  if (books.sample) return true;
  if (books.items.length === 0) return false;
  return books.items.every((item) => SAMPLE_ITEM_IDS.has(item.id));
}

export function inboundQty(books: Books, itemId: string): number {
  return (books.stockIns ?? []).filter((s) => s.itemId === itemId).reduce((n, s) => n + s.qty, 0);
}

export function outboundQty(books: Books, itemId: string): number {
  return books.sales.filter((s) => s.itemId === itemId).reduce((n, s) => n + s.qty, 0);
}

export function onHand(books: Books, item: Item): number {
  const inbound = inboundQty(books, item.id);
  const outbound = outboundQty(books, item.id);
  if (inbound === 0) return Math.max(0, item.qty);
  return Math.max(0, inbound - outbound);
}

function normalize(books: Books): Books {
  const suppliers = Array.isArray(books.suppliers) ? books.suppliers : [];
  const stockIns = Array.isArray(books.stockIns) ? books.stockIns : [];
  const expenses = (Array.isArray(books.expenses) ? books.expenses : []).filter(
    (e) => e.category === "Stock in",
  );
  const next = { ...books, suppliers, stockIns, expenses };
  const items = books.items.map((item) => ({
    ...item,
    supplierId: item.supplierId ?? "",
    addedAt: item.addedAt || stockIns.find((s) => s.itemId === item.id)?.at || new Date().toISOString(),
    qty: onHand(next, item),
  }));
  return { ...next, items };
}

export function parseBooks(raw: unknown): Books | null {
  if (!raw || typeof raw !== "object") return null;
  const parsed = raw as Books;
  if (!Array.isArray(parsed.items)) return null;
  try {
    return normalize(parsed);
  } catch {
    return null;
  }
}

export function loadBooks(): Books {
  try {
    const raw = localStorage.getItem(persistKey);
    if (!raw) return emptyBooks();
    const parsed = JSON.parse(raw) as unknown;
    const books = parseBooks(parsed);
    if (!books || isDummyBooks(books)) return emptyBooks();
    return books;
  } catch {
    return emptyBooks();
  }
}

export function saveBooks(books: Books): void {
  localStorage.setItem(persistKey, JSON.stringify(books));
}

function inPeriod(iso: string, period: Period): boolean {
  const day = todayKey(new Date(iso));
  if (period === "today") return day === todayKey();
  if (period === "week") return day >= todayKey(startOfWeek());
  return day >= todayKey(startOfMonth());
}

function stockInSpend(books: Books, period?: Period): number {
  return books.expenses
    .filter((e) => e.category === "Stock in" && (!period || inPeriod(e.at, period)))
    .reduce((n, e) => n + e.amount, 0);
}

export function totals(books: Books, period: Period): Totals {
  const sales = books.sales.filter((s) => inPeriod(s.at, period));
  const revenue = sales.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const cogs = sales.reduce((n, s) => n + s.qty * s.unitCost, 0);
  const spend = stockInSpend(books, period);
  const cashSales = books.sales.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const cashSpend = stockInSpend(books);
  const stockQty = books.items.reduce((n, i) => n + onHand(books, i), 0);
  const stockValue = books.items.reduce((n, i) => n + onHand(books, i) * i.cost, 0);
  return {
    revenue,
    cogs,
    spend,
    profit: revenue - cogs,
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

export function feed(books: Books, period: Period): Array<{ at: string; text: string }> {
  return periodSales(books, period)
    .map((s) => ({
      at: s.at,
      text: `SALE ${s.itemName} ${s.qty}x Rs ${Math.round(s.qty * s.unitSell).toLocaleString("en-US")}`,
    }))
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function lowItems(books: Books): Item[] {
  return books.items.filter((i) => onHand(books, i) <= i.lowAt);
}

export type TrendPoint = { key: string; label: string; revenue: number; cogs: number; profit: number };

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

function saleTotals(sales: Sale[]) {
  const revenue = sales.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const cogs = sales.reduce((n, s) => n + s.qty * s.unitCost, 0);
  return { revenue, cogs, profit: revenue - cogs };
}

export function trend(books: Books, period: Period): TrendPoint[] {
  const sales = periodSales(books, period);

  if (period === "today") {
    const startH = 9;
    const endH = Math.max(startH, Math.min(21, new Date().getHours()));
    const hours = Array.from({ length: endH - startH + 1 }, (_, i) => {
      const hour = startH + i;
      const slice = sales.filter((s) => new Date(s.at).getHours() === hour);
      return { key: String(hour), label: hourLabel(hour), ...saleTotals(slice) };
    });
    return trimTrend(hours);
  }

  const start = period === "week" ? startOfWeek() : startOfMonth();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(0, 0, 0, 0);
  const days: TrendPoint[] = [];
  for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
    const key = todayKey(d);
    const slice = sales.filter((s) => todayKey(new Date(s.at)) === key);
    const label =
      period === "week"
        ? d.toLocaleDateString("en-GB", { weekday: "short" })
        : String(d.getDate());
    days.push({ key, label, ...saleTotals(slice) });
  }
  return trimTrend(days);
}

function trimTrend(points: TrendPoint[]): TrendPoint[] {
  const first = points.findIndex((p) => p.revenue > 0 || p.cogs > 0);
  if (first <= 0) return points;
  return points.slice(first);
}

export function topSellers(
  books: Books,
  period: Period,
): Array<{ itemId: string; name: string; qty: number; revenue: number }> {
  const map = new Map<string, { itemId: string; name: string; qty: number; revenue: number }>();
  for (const sale of periodSales(books, period)) {
    const row = map.get(sale.itemId) ?? { itemId: sale.itemId, name: sale.itemName, qty: 0, revenue: 0 };
    row.qty += sale.qty;
    row.revenue += sale.qty * sale.unitSell;
    row.name = sale.itemName;
    map.set(sale.itemId, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 4);
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

export function renameItem(books: Books, itemId: string, name: string): Books | string {
  const next = name.trim();
  if (!next) return "Item needs a name.";
  const item = books.items.find((i) => i.id === itemId);
  if (!item) return "Item not found.";
  if (item.name === next) return books;
  return {
    ...books,
    sample: false,
    items: books.items.map((i) => (i.id === itemId ? { ...i, name: next } : i)),
  };
}

function withOnHand(books: Books, itemId: string): Books {
  const item = books.items.find((i) => i.id === itemId);
  if (!item) return books;
  const qty = onHand(books, item);
  if (item.qty === qty) return books;
  return {
    ...books,
    items: books.items.map((i) => (i.id === itemId ? { ...i, qty } : i)),
  };
}

function findLotExpense(books: Books, lot: StockIn, itemName: string): Expense | undefined {
  const spend = lot.qty * lot.unitCost;
  const lotTime = Date.parse(lot.at);
  const close = books.expenses.filter((e) => {
    if (e.category !== "Stock in" || e.amount !== spend) return false;
    const t = Date.parse(e.at);
    if (Number.isNaN(t) || Number.isNaN(lotTime)) return false;
    return Math.abs(t - lotTime) <= 8000;
  });
  if (close.length === 0) return undefined;
  const named = close.filter((e) => e.note.includes(itemName) || e.note.includes(`x${lot.qty}`));
  const pool = named.length ? named : close;
  return pool.slice().sort((a, b) => Math.abs(Date.parse(a.at) - lotTime) - Math.abs(Date.parse(b.at) - lotTime))[0];
}

export function updateStockIn(
  books: Books,
  lotId: string,
  patch: { qty?: number; unitCost?: number; supplierId?: string },
): Books | string {
  const lot = (books.stockIns ?? []).find((s) => s.id === lotId);
  if (!lot) return "Stock lot not found.";
  const item = books.items.find((i) => i.id === lot.itemId);
  if (!item) return "Item not found.";
  const qty = patch.qty ?? lot.qty;
  const unitCost = patch.unitCost ?? lot.unitCost;
  const supplierId = patch.supplierId !== undefined ? patch.supplierId : lot.supplierId;
  if (!Number.isInteger(qty) || qty < 1) return "Quantity must be at least 1.";
  if (!Number.isFinite(unitCost) || unitCost < 0) return "Rate cannot be negative.";
  if (supplierId && !books.suppliers.some((s) => s.id === supplierId)) return "Supplier not found.";
  const outbound = outboundQty(books, item.id);
  const inboundWithout = inboundQty(books, item.id) - lot.qty;
  if (inboundWithout + qty < outbound) {
    return `Need at least ${outbound - inboundWithout} in to cover sales.`;
  }
  if (lot.qty === qty && lot.unitCost === unitCost && lot.supplierId === supplierId) return books;

  const latest = stockInsForItem(books, item.id)[0];
  const isLatest = latest?.id === lot.id;
  let next: Books = {
    ...books,
    sample: false,
    stockIns: (books.stockIns ?? []).map((s) =>
      s.id === lotId ? { ...s, qty, unitCost, supplierId } : s,
    ),
    items: books.items.map((i) =>
      i.id === item.id
        ? {
            ...i,
            cost: isLatest ? unitCost : i.cost,
            supplierId: isLatest ? supplierId || i.supplierId : i.supplierId,
          }
        : i,
    ),
  };
  next = withOnHand(next, item.id);

  const spend = qty * unitCost;
  const expense = findLotExpense(books, lot, item.name);
  if (expense) {
    if (!(spend > 0)) {
      next = { ...next, expenses: next.expenses.filter((e) => e.id !== expense.id) };
    } else {
      const who = supplierName(next, supplierId);
      const prefix = expense.note.startsWith("Restock") ? "Restock" : "Stock";
      next = {
        ...next,
        expenses: next.expenses.map((e) =>
          e.id === expense.id
            ? {
                ...e,
                amount: spend,
                note: `${prefix} ${item.name} x${qty}${who ? ` · ${who}` : ""}`,
              }
            : e,
        ),
      };
    }
  }
  return next;
}

export function updateSale(
  books: Books,
  saleId: string,
  patch: { qty?: number },
): Books | string {
  const sale = books.sales.find((s) => s.id === saleId);
  if (!sale) return "Sale not found.";
  const item = books.items.find((i) => i.id === sale.itemId);
  if (!item) return "Item not found.";
  const qty = patch.qty ?? sale.qty;
  if (!Number.isInteger(qty) || qty < 1) return "Quantity must be at least 1.";
  const available = onHand(books, item) + sale.qty;
  if (qty > available) return `Only ${available} on the shelf.`;
  if (sale.qty === qty) return books;
  return withOnHand(
    {
      ...books,
      sample: false,
      sales: books.sales.map((s) => (s.id === saleId ? { ...s, qty } : s)),
    },
    item.id,
  );
}

export function upsertItem(
  books: Books,
  draft: {
    id?: string;
    name: string;
    qty: number;
    cost: number;
    sell: number;
    lowAt: number;
    kind?: ItemKind;
    supplierId?: string;
  },
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
          ? {
              ...i,
              name,
              qty: draft.qty,
              cost: draft.cost,
              sell: draft.sell,
              lowAt: draft.lowAt,
              kind: draft.kind ?? i.kind,
              supplierId: draft.supplierId ?? i.supplierId,
            }
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
    kind: draft.kind,
    supplierId: draft.supplierId ?? "",
    addedAt: new Date().toISOString(),
  };
  const stockIns = [...(books.stockIns ?? [])];
  if (draft.qty > 0) {
    stockIns.unshift({
      id: uid(),
      at: item.addedAt ?? new Date().toISOString(),
      itemId: item.id,
      qty: draft.qty,
      unitCost: draft.cost,
      supplierId: item.supplierId ?? "",
    });
  }
  let next: Books = { ...books, sample: false, items: [...books.items, item], stockIns };
  const spend = draft.qty * draft.cost;
  if (spend > 0) {
    const who = supplierName(next, item.supplierId);
    const posted = postExpense(
      next,
      "Stock in",
      spend,
      `Stock ${item.name} x${draft.qty}${who ? ` · ${who}` : ""}`,
    );
    if (typeof posted === "string") return posted;
    next = posted;
  }
  return next;
}

export function restock(
  books: Books,
  itemId: string,
  qty: number,
  payFromCash: boolean,
  supplierId?: string,
  unitCost?: number,
): Books | string {
  const item = books.items.find((i) => i.id === itemId);
  if (!item) return "Pick an item to restock.";
  if (qty < 1) return "Quantity must be at least 1.";
  const cost = unitCost != null && unitCost >= 0 ? unitCost : item.cost;
  const from = supplierId ?? item.supplierId ?? "";
  const at = new Date().toISOString();
  let next: Books = {
    ...books,
    sample: false,
    items: books.items.map((i) =>
      i.id === item.id
        ? { ...i, qty: i.qty + qty, cost, supplierId: from || i.supplierId }
        : i,
    ),
    stockIns: [
      { id: uid(), at, itemId: item.id, qty, unitCost: cost, supplierId: from },
      ...(books.stockIns ?? []),
    ],
  };
  if (payFromCash) {
    const spend = qty * cost;
    if (spend > 0) {
      const who = supplierName(next, from);
      const posted = postExpense(
        next,
        "Stock in",
        spend,
        `Restock ${item.name} x${qty}${who ? ` · ${who}` : ""}`,
      );
      if (typeof posted === "string") return posted;
      next = posted;
    }
  }
  return next;
}

export function removeItem(books: Books, itemId: string): Books {
  return {
    ...books,
    sample: false,
    items: books.items.filter((i) => i.id !== itemId),
    stockIns: (books.stockIns ?? []).filter((s) => s.itemId !== itemId),
  };
}

export function supplierName(books: Books, id?: string): string {
  if (!id) return "";
  return books.suppliers.find((s) => s.id === id)?.name ?? "";
}

export function itemsForSupplier(books: Books, supplierId: string): Item[] {
  return books.items.filter((i) => i.supplierId === supplierId);
}

export function stockInsForItem(books: Books, itemId: string): StockIn[] {
  return (books.stockIns ?? [])
    .filter((s) => s.itemId === itemId)
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function salesForItem(books: Books, itemId: string): Sale[] {
  return books.sales
    .filter((s) => s.itemId === itemId)
    .slice()
    .sort((a, b) => (a.at < b.at ? 1 : -1));
}

export function upsertSupplier(
  books: Books,
  draft: { id?: string; name: string; phone: string; city: string; note: string },
): Books | string {
  const name = draft.name.trim();
  if (!name) return "Supplier needs a name.";
  if (draft.id) {
    return {
      ...books,
      sample: false,
      suppliers: books.suppliers.map((s) =>
        s.id === draft.id
          ? { ...s, name, phone: draft.phone.trim(), city: draft.city.trim(), note: draft.note.trim() }
          : s,
      ),
    };
  }
  const supplier: Supplier = {
    id: uid(),
    name,
    phone: draft.phone.trim(),
    city: draft.city.trim(),
    note: draft.note.trim(),
  };
  return { ...books, sample: false, suppliers: [...books.suppliers, supplier] };
}

export function removeSupplier(books: Books, supplierId: string): Books | string {
  if (books.items.some((i) => i.supplierId === supplierId)) {
    return "This supplier still has items on the shelf.";
  }
  return {
    ...books,
    sample: false,
    suppliers: books.suppliers.filter((s) => s.id !== supplierId),
  };
}

export function pkr(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}Rs ${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
}

export function pkrPlain(n: number): string {
  const sign = n < 0 ? "-" : "";
  return `${sign}${Math.abs(Math.round(n)).toLocaleString("en-US")}`;
}

export function todayKey(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function clock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function hourLabel(hour: number): string {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d.toLocaleTimeString("en-US", { hour: "numeric" });
}

export function startOfWeek(d = new Date()): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  const day = x.getDay();
  const diff = day === 0 ? 6 : day - 1;
  x.setDate(x.getDate() - diff);
  return x;
}

export function startOfMonth(d = new Date()): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function dateLabel(iso: string): string {
  const key = todayKey(new Date(iso));
  if (key === todayKey()) return "Today";
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (key === todayKey(yest)) return "Yesterday";
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function when(iso: string): string {
  const time = clock(iso);
  if (todayKey(new Date(iso)) === todayKey()) return time;
  return `${dateLabel(iso)} · ${time}`;
}

export function stamp(iso: string): string {
  return `${sheetDate(iso)} · ${clock(iso)}`;
}

export function sheetDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function periodRangeLabel(period: "today" | "week" | "month"): string {
  if (period === "today") {
    return new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  }
  if (period === "week") {
    const a = startOfWeek();
    const b = new Date();
    const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${fmt(a)} – ${fmt(b)}`;
  }
  return new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function groupByDay<T extends { at: string }>(
  rows: T[],
): Array<{ key: string; label: string; rows: T[] }> {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    const key = todayKey(new Date(row.at));
    const list = map.get(key) ?? [];
    list.push(row);
    map.set(key, list);
  }
  return [...map.entries()].map(([key, group]) => ({
    key,
    label: dateLabel(group[0].at),
    rows: group,
  }));
}

export function uid(): string {
  return crypto.randomUUID();
}

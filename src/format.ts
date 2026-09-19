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
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

export function uid(): string {
  return crypto.randomUUID();
}

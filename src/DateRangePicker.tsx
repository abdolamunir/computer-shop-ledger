import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CaretLeft, CaretRight, CalendarBlank } from "@phosphor-icons/react";
import type { DateSpan } from "./books";
import { todayKey } from "./format";

const WEEKDAYS = [
  { short: "M", name: "Monday" },
  { short: "T", name: "Tuesday" },
  { short: "W", name: "Wednesday" },
  { short: "T", name: "Thursday" },
  { short: "F", name: "Friday" },
  { short: "S", name: "Saturday" },
  { short: "S", name: "Sunday" },
];

function fromKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function monthLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function prettyDay(key: string): string {
  return fromKey(key).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

function dayName(key: string): string {
  return fromKey(key).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function shiftMonth(year: number, month: number, delta: number) {
  const next = new Date(year, month + delta, 1);
  return { year: next.getFullYear(), month: next.getMonth() };
}

function monthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - startPad);
  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return {
      key: todayKey(date),
      day: date.getDate(),
      inMonth: date.getMonth() === month,
      col: i % 7,
    };
  });
  while (cells.length > 35 && cells.slice(-7).every((cell) => !cell.inMonth)) {
    cells.splice(-7, 7);
  }
  return cells;
}

type Props = {
  active: boolean;
  span: DateSpan;
  onActivate: () => void;
  onChange: (span: DateSpan) => void;
};

export function DateRangePicker({ active, span, onActivate, onChange }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const max = todayKey();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"from" | "to">("from");
  const [hover, setHover] = useState<string | null>(null);
  const [sheet, setSheet] = useState(() => window.matchMedia("(max-width: 700px)").matches);
  const [anchor, setAnchor] = useState({ top: 0, right: 16 });
  const [view, setView] = useState(() => {
    const start = fromKey(span.from || max);
    return { year: start.getFullYear(), month: start.getMonth() };
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => setSheet(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!active) setOpen(false);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    const start = fromKey(span.from || max);
    setView({ year: start.getFullYear(), month: start.getMonth() });
    setStep("from");
    setHover(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function place() {
      const el = wrap.current;
      if (!el) return;
      const box = el.getBoundingClientRect();
      setAnchor({ top: box.bottom + 8, right: Math.max(12, window.innerWidth - box.right) });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      const target = e.target as Node;
      if (wrap.current?.contains(target) || panel.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const cells = useMemo(() => monthCells(view.year, view.month), [view.year, view.month]);
  const previewTo = step === "to" && hover && hover <= max ? hover : span.to;
  const from = span.from <= previewTo ? span.from : previewTo;
  const to = span.from <= previewTo ? previewTo : span.from;
  const now = fromKey(max);
  const nextMonth = shiftMonth(view.year, view.month, 1);
  const canNext = nextMonth.year < now.getFullYear() || (nextMonth.year === now.getFullYear() && nextMonth.month <= now.getMonth());

  function pickDay(key: string) {
    if (key > max) return;
    if (step === "from") {
      onChange({ from: key, to: key });
      setStep("to");
      return;
    }
    if (key < span.from) onChange({ from: key, to: span.from });
    else onChange({ from: span.from, to: key });
    setStep("from");
    setHover(null);
    setOpen(false);
  }

  const picker = open
    ? createPortal(
        <>
          <button className="date-picker-scrim" type="button" aria-label="Close calendar" onClick={() => setOpen(false)} />
          <div
            ref={panel}
            className="date-picker"
            role="dialog"
            aria-label="Choose a date range"
            style={sheet ? undefined : { top: anchor.top, right: anchor.right }}
          >
            <div className="date-picker-range">
              <button
                type="button"
                className={step === "from" ? "on" : undefined}
                onClick={() => setStep("from")}
              >
                <span>From</span>
                <strong>{prettyDay(span.from)}</strong>
              </button>
              <span className="date-picker-dash" aria-hidden>
                –
              </span>
              <button type="button" className={step === "to" ? "on" : undefined} onClick={() => setStep("to")}>
                <span>To</span>
                <strong>{prettyDay(span.to)}</strong>
              </button>
            </div>
            <div className="date-picker-nav">
              <button
                type="button"
                aria-label="Previous month"
                onClick={() => setView((cur) => shiftMonth(cur.year, cur.month, -1))}
              >
                <CaretLeft size={16} weight="bold" aria-hidden />
              </button>
              <p>{monthLabel(view.year, view.month)}</p>
              <button
                type="button"
                aria-label="Next month"
                disabled={!canNext}
                onClick={() => setView((cur) => shiftMonth(cur.year, cur.month, 1))}
              >
                <CaretRight size={16} weight="bold" aria-hidden />
              </button>
            </div>
            <div className="date-picker-week" aria-hidden>
              {WEEKDAYS.map((d, i) => (
                <span key={`${d.name}-${i}`}>{d.short}</span>
              ))}
            </div>
            <div className="date-picker-grid">
              {cells.map((cell) => {
                const disabled = cell.key > max;
                const isFrom = cell.key === from;
                const isTo = cell.key === to;
                const inRange = cell.key > from && cell.key < to;
                const isToday = cell.key === max;
                return (
                  <button
                    key={cell.key}
                    type="button"
                    disabled={disabled}
                    aria-label={dayName(cell.key)}
                    aria-pressed={isFrom || isTo}
                    aria-current={isToday ? "date" : undefined}
                    className={[
                      "date-picker-day",
                      cell.inMonth ? "" : "is-out",
                      isFrom ? "is-from" : "",
                      isTo ? "is-to" : "",
                      inRange ? "is-in" : "",
                      isToday ? "is-today" : "",
                      cell.col === 0 ? "is-week-start" : "",
                      cell.col === 6 ? "is-week-end" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => pickDay(cell.key)}
                    onPointerEnter={() => setHover(cell.key)}
                    onPointerLeave={() => setHover((cur) => (cur === cell.key ? null : cur))}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>
            <div className="date-picker-foot">
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  onChange({ from: max, to: max });
                  setStep("from");
                  setView({ year: now.getFullYear(), month: now.getMonth() });
                }}
              >
                Today
              </button>
              <button type="button" className="key primary round date-picker-done" onClick={() => setOpen(false)}>
                Done
              </button>
            </div>
          </div>
        </>,
        document.body,
      )
    : null;

  return (
    <div className="period-custom" ref={wrap}>
      <button
        type="button"
        aria-pressed={active}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => {
          onActivate();
          setOpen((was) => (active ? !was : true));
        }}
      >
        <CalendarBlank size={14} weight="bold" aria-hidden />
        Custom
      </button>
      {picker}
    </div>
  );
}

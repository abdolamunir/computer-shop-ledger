import type { KeyboardEvent, ReactNode } from "react";

export type SheetCol = {
  key: string;
  label: string;
  align?: "left" | "right" | "center";
  width?: string;
};

export function Sheet({
  columns,
  empty,
  children,
  compact,
  className,
}: {
  columns: SheetCol[];
  empty?: string;
  children?: ReactNode;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={["sheet", compact ? "compact" : "", className].filter(Boolean).join(" ")}>
      <table>
        <thead>
          <tr>
            <th className="sheet-idx" scope="col">
              #
            </th>
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className={c.align === "right" ? "num" : c.align === "center" ? "ctr" : undefined}
                style={c.width ? { width: c.width } : undefined}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {empty ? (
            <tr className="sheet-empty">
              <td colSpan={columns.length + 1}>{empty}</td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  );
}

export function SheetRow({
  index,
  selected,
  onSelect,
  tone,
  children,
}: {
  index: number;
  selected?: boolean;
  onSelect?: () => void;
  tone?: "low" | "spend";
  children: ReactNode;
}) {
  const interactive = Boolean(onSelect);
  function onKey(e: KeyboardEvent<HTMLTableRowElement>) {
    if (!onSelect) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  }
  return (
    <tr
      className={[selected ? "on" : "", tone ?? "", interactive ? "hit" : ""].filter(Boolean).join(" ")}
      aria-selected={selected}
      tabIndex={interactive ? 0 : undefined}
      onClick={onSelect}
      onKeyDown={onKey}
    >
      <th scope="row" className="sheet-idx">
        {index}
      </th>
      {children}
    </tr>
  );
}

export function Cell({
  children,
  align,
  title,
}: {
  children?: ReactNode;
  align?: "right" | "center";
  title?: string;
}) {
  return (
    <td className={align === "right" ? "num" : align === "center" ? "ctr" : undefined} title={title}>
      {children}
    </td>
  );
}

export function PropSheet({ rows }: { rows: Array<{ label: string; value: ReactNode }> }) {
  return (
    <div className="sheet compact props">
      <table>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row">{row.label}</th>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

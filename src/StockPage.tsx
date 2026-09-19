import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CaretLeft, PencilSimple } from "@phosphor-icons/react";
import {
  inboundQty,
  onHand,
  outboundQty,
  renameItem,
  salesForItem,
  stockInsForItem,
  updateSale,
  updateStockIn,
  type Books,
} from "./books";
import { productPhoto } from "./catalog";
import { pkr, pkrPlain, stamp } from "./format";
import { go } from "./nav";
import { Cell, Sheet, SheetRow } from "./Sheet";
import { setBooks } from "./useBooks";
import type { Till } from "./useTill";

export function StockRecord({
  till,
  recordId,
  actions,
}: {
  till: Till;
  recordId: string;
  actions?: ReactNode;
}) {
  const { books, pick } = till;
  const item = books.items.find((i) => i.id === recordId);
  const [name, setName] = useState(item?.name ?? "");
  const [nameError, setNameError] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    pick(recordId);
  }, [recordId]);

  useEffect(() => {
    setName(item?.name ?? "");
    setNameError("");
    setEditError("");
  }, [item?.id, item?.name]);

  function commitName(raw: string) {
    if (!item) return;
    const next = renameItem(books, item.id, raw);
    if (typeof next === "string") {
      setNameError(next);
      setName(item.name);
      return;
    }
    setNameError("");
    setName(next.items.find((i) => i.id === item.id)?.name ?? raw.trim());
    if (next !== books) setBooks(next);
  }

  function applyEdit(next: Books | string) {
    if (typeof next === "string") {
      setEditError(next);
      return false;
    }
    setEditError("");
    if (next !== books) setBooks(next);
    return true;
  }
  if (!item) {
    return (
      <div className="record">
        <button className="text-link" type="button" onClick={() => go("home")}>
          <CaretLeft size={14} weight="bold" aria-hidden />
          Back to dashboard
        </button>
        <p className="empty">This item is not on the shelf.</p>
      </div>
    );
  }

  const supplier = books.suppliers.find((s) => s.id === item.supplierId);
  const ins = stockInsForItem(books, item.id);
  const sold = salesForItem(books, item.id);
  const soldQty = outboundQty(books, item.id);
  const soldRs = sold.reduce((n, s) => n + s.qty * s.unitSell, 0);
  const stockInQty = inboundQty(books, item.id);
  const stock = onHand(books, item);
  const unitProfit = item.sell - item.cost;
  const photo = productPhoto(item);

  const facts = [
    { label: "In", value: `${stockInQty} pcs` },
    { label: "Out", value: `${soldQty} pcs · ${pkr(soldRs)}` },
    { label: "Stock", value: `${stock} pcs${stock <= item.lowAt ? " · low" : ""}` },
    { label: "Balance amount", value: pkr(stock * item.cost) },
    { label: "Unit Price", value: pkr(item.cost) },
    { label: "Sell", value: pkr(item.sell) },
    { label: "Profit", value: pkr(unitProfit) },
    { label: "Low at", value: `${item.lowAt} pcs` },
    { label: "Supplier", value: supplier?.name || "None" },
    { label: "Added", value: item.addedAt ? stamp(item.addedAt) : "—" },
  ];

  return (
    <div className="record">
      <div className="record-top">
        <button className="text-link" type="button" onClick={() => go("home")}>
          <CaretLeft size={14} weight="bold" aria-hidden />
          Back to dashboard
        </button>
      </div>
      <div className="item-hero">
        <span className="item-hero-photo">
          {photo ? <img src={photo} alt="" /> : <span>{item.name.slice(0, 1)}</span>}
        </span>
        <div className="item-hero-name">
          <label className="product-name-wrap">
            <input
              className="product-name-edit"
              value={name}
              aria-label="Product name"
              onChange={(e) => {
                setName(e.target.value);
                setNameError("");
              }}
              onBlur={(e) => commitName(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitName(e.currentTarget.value);
                  e.currentTarget.blur();
                }
                if (e.key === "Escape") {
                  e.preventDefault();
                  e.currentTarget.value = item.name;
                  setName(item.name);
                  setNameError("");
                  e.currentTarget.blur();
                }
              }}
            />
            <PencilSimple className="product-name-pen" size={14} weight="bold" aria-hidden />
          </label>
          {nameError ? <p className="err">{nameError}</p> : <p className="sub">{item.kind ?? "Item"}</p>}
        </div>
      </div>
      <dl className="facts">
        {facts.map((fact) => (
          <div key={fact.label} className="fact">
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>
      {actions}
      {editError ? <p className="err">{editError}</p> : null}
      <div className="fact-block">
        <h3>Stock</h3>
        <Sheet
          columns={[
            { key: "qty", label: "Qty", align: "right" },
            { key: "rate", label: "Rate Rs", align: "right" },
            { key: "supplier", label: "Supplier" },
            { key: "when", label: "When" },
            { key: "total", label: "Total Rs", align: "right" },
          ]}
          empty={ins.length === 0 ? "No incoming lots yet." : undefined}
        >
          {ins.map((lot, i) => (
            <SheetRow key={lot.id} index={i + 1}>
              <Cell align="right">
                <EditValue
                  value={String(lot.qty)}
                  ariaLabel="Qty"
                  align="right"
                  onCommit={(raw) => applyEdit(updateStockIn(books, lot.id, { qty: Number(raw) }))}
                />
              </Cell>
              <Cell align="right">
                <EditValue
                  value={String(lot.unitCost)}
                  ariaLabel="Rate Rs"
                  align="right"
                  onCommit={(raw) =>
                    applyEdit(updateStockIn(books, lot.id, { unitCost: Number(raw.replace(/,/g, "")) }))
                  }
                />
              </Cell>
              <Cell>
                <select
                  className="cell-edit"
                  aria-label="Supplier"
                  value={lot.supplierId}
                  onChange={(e) => applyEdit(updateStockIn(books, lot.id, { supplierId: e.target.value }))}
                >
                  <option value="">No supplier</option>
                  {books.suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </Cell>
              <Cell>{stamp(lot.at)}</Cell>
              <Cell align="right">{pkrPlain(lot.qty * lot.unitCost)}</Cell>
            </SheetRow>
          ))}
        </Sheet>
      </div>
      <div className="fact-block">
        <h3>Sales</h3>
        <Sheet
          columns={[
            { key: "qty", label: "Qty", align: "right" },
            { key: "rate", label: "Rate Rs", align: "right" },
            { key: "cost", label: "Unit Price", align: "right" },
            { key: "profit", label: "Profit Rs", align: "right" },
            { key: "when", label: "When" },
            { key: "total", label: "Total Rs", align: "right" },
          ]}
          empty={sold.length === 0 ? "No sales of this item yet." : undefined}
        >
          {sold.map((s, i) => {
            const profit = s.qty * (s.unitSell - s.unitCost);
            return (
              <SheetRow key={s.id} index={i + 1} tone={profit < 0 ? "spend" : undefined}>
                <Cell align="right">
                  <EditValue
                    value={String(s.qty)}
                    ariaLabel="Qty"
                    align="right"
                    onCommit={(raw) => applyEdit(updateSale(books, s.id, { qty: Number(raw) }))}
                  />
                </Cell>
                <Cell align="right">{pkrPlain(s.unitSell)}</Cell>
                <Cell align="right">{pkrPlain(s.unitCost)}</Cell>
                <Cell align="right">{pkrPlain(profit)}</Cell>
                <Cell>{stamp(s.at)}</Cell>
                <Cell align="right">{pkrPlain(s.qty * s.unitSell)}</Cell>
              </SheetRow>
            );
          })}
        </Sheet>
      </div>
    </div>
  );
}

function EditValue({
  value,
  ariaLabel,
  align,
  onCommit,
}: {
  value: string;
  ariaLabel: string;
  align?: "right";
  onCommit: (raw: string) => boolean;
}) {
  const valueRef = useRef(value);
  const commitRef = useRef(onCommit);
  valueRef.current = value;
  commitRef.current = onCommit;

  return (
    <input
      key={value}
      className={["cell-edit", align === "right" ? "is-num" : ""].filter(Boolean).join(" ")}
      aria-label={ariaLabel}
      defaultValue={value}
      ref={(el) => {
        if (!el) return;
        const node = el;
        function onBlur() {
          const text = node.value;
          if (text === valueRef.current) return;
          if (!commitRef.current(text)) node.value = valueRef.current;
        }
        node.addEventListener("blur", onBlur);
        return () => node.removeEventListener("blur", onBlur);
      }}
      onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          e.currentTarget.value = valueRef.current;
          e.currentTarget.blur();
        }
      }}
    />
  );
}

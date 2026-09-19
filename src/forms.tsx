import { useEffect, useState } from "react";
import { ITEM_KINDS, onHand } from "./books";
import { pkr } from "./format";
import type { Till } from "./useTill";

export function SaleForm({ till, onDone }: { till: Till; onDone?: () => void }) {
  const { books, itemId, setItemId, qty, setQty, selected, error, onSale } = till;
  return (
    <div className="form">
      <div className="field">
        <label htmlFor="item">Item</label>
        <select id="item" value={itemId} onChange={(e) => setItemId(e.target.value)}>
          {books.items.length === 0 ? <option value="">No stock yet</option> : null}
          {books.items.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name} ({onHand(books, i)})
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="qty">Qty</label>
        <input
          id="qty"
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>
      {selected ? (
        <p className="check">
          {pkr(selected.sell)} each · cost {pkr(selected.cost)}
        </p>
      ) : null}
      {error ? <p className="err">{error}</p> : null}
      <button
        className="key primary"
        type="button"
        onClick={() => {
          if (onSale()) onDone?.();
        }}
        disabled={!selected}
      >
        Record sale
      </button>
    </div>
  );
}

export function StockInForm({
  till,
  lockedId,
  onDone,
}: {
  till: Till;
  lockedId?: string;
  onDone?: () => void;
}) {
  const {
    books,
    itemId,
    qty,
    setQty,
    selected,
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
    onStockIn,
  } = till;
  const [target, setTarget] = useState(lockedId ?? itemId ?? books.items[0]?.id ?? "__new__");

  useEffect(() => {
    if (lockedId) setTarget(lockedId);
  }, [lockedId]);
  const isNew = !lockedId && target === "__new__";
  const item = lockedId
    ? books.items.find((i) => i.id === lockedId)
    : isNew
      ? undefined
      : books.items.find((i) => i.id === target) ?? selected;

  useEffect(() => {
    if (!item || restockCost !== "") return;
    setRestockCost(String(item.cost));
  }, [item?.id]);

  function choose(id: string) {
    setTarget(id);
    if (id === "__new__") return;
    const next = books.items.find((i) => i.id === id);
    if (!next) return;
    if (next.supplierId) setSupplierId(next.supplierId);
    setRestockCost(String(next.cost));
  }

  return (
    <div className="form">
      {lockedId ? null : (
        <div className="field">
          <label htmlFor="stock-item">Item</label>
          <select id="stock-item" value={target} onChange={(e) => choose(e.target.value)}>
            <option value="__new__">New item</option>
            {books.items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name} ({onHand(books, i)})
              </option>
            ))}
          </select>
        </div>
      )}
      {isNew ? (
        <>
          <div className="field">
            <label htmlFor="new-name">Name</label>
            <input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="new-kind">Type</label>
            <select
              id="new-kind"
              value={newKind}
              onChange={(e) => setNewKind(e.target.value as (typeof ITEM_KINDS)[number])}
            >
              {ITEM_KINDS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : item ? (
        <p className="check">
          {item.name} · cost {pkr(item.cost)} · sell {pkr(item.sell)}
        </p>
      ) : null}
      <div className="field">
        <label htmlFor="stock-qty">{isNew ? "Starting qty" : "Qty"}</label>
        <input
          id="stock-qty"
          type="number"
          min={isNew ? 0 : 1}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
        />
      </div>
      <div className="field">
        <label htmlFor="stock-supplier">Supplier</label>
        <select id="stock-supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
          <option value="">No supplier</option>
          {books.suppliers.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      {isNew ? (
        <>
          <div className="field">
            <label htmlFor="new-cost">Unit Price (Rs)</label>
            <input
              id="new-cost"
              inputMode="numeric"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="new-sell">Sell (Rs)</label>
            <input
              id="new-sell"
              inputMode="numeric"
              value={newSell}
              onChange={(e) => setNewSell(e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="field">
          <label htmlFor="stock-rate">Rate (Rs)</label>
          <input
            id="stock-rate"
            inputMode="numeric"
            value={restockCost}
            onChange={(e) => setRestockCost(e.target.value)}
            placeholder={item ? String(item.cost) : ""}
          />
        </div>
      )}
      {error ? <p className="err">{error}</p> : null}
      <button
        className="key primary"
        type="button"
        onClick={() => {
          if (onStockIn(lockedId ?? target)) onDone?.();
        }}
        disabled={!isNew && !item}
      >
        Add stock
      </button>
    </div>
  );
}

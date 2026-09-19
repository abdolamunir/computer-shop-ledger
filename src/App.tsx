import { useEffect, useMemo, useState } from "react";
import {
  EXPENSE_CATEGORIES,
  emptyBooks,
  feed,
  lowItems,
  periodExpenses,
  periodSales,
  postExpense,
  postSale,
  restock,
  sampleBooks,
  totals,
  upsertItem,
  type Item,
  type Period,
} from "./books";
import { clock, pkr, pkrPlain } from "./format";
import { setBooks, useBooks } from "./useBooks";
import keySale from "./assets/key-sale.png";
import keyExpense from "./assets/key-expense.png";
import packingTag from "./assets/packing-tag.png";

export function App() {
  const books = useBooks();
  const [period, setPeriod] = useState<Period>("today");
  const [itemId, setItemId] = useState(books.items[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState<string>("Shop");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");
  const [newSell, setNewSell] = useState("");
  const [error, setError] = useState("");
  const [opening, setOpening] = useState(String(books.openingCash || 0));
  const [settled, setSettled] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);

  const t = useMemo(() => totals(books, period), [books, period]);
  const sales = useMemo(() => periodSales(books, period), [books, period]);
  const expenses = useMemo(() => periodExpenses(books, period), [books, period]);
  const ticks = useMemo(() => feed(books, period), [books, period]);
  const lows = useMemo(() => lowItems(books), [books]);
  const selected = books.items.find((i) => i.id === itemId);

  useEffect(() => {
    if (!itemId && books.items[0]) setItemId(books.items[0].id);
  }, [books.items, itemId]);

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
      return;
    }
    setError("");
    setBooks(next);
    const after = totals(next, period);
    bump(keys, after.profit < 0 || lowItems(next).length > lows.length);
  }

  function onSale() {
    apply(postSale(books, itemId, qty), ["profit", "cash", "stock"]);
  }

  function onExpense() {
    apply(postExpense(books, category, Number(amount), note), ["profit", "cash", "spend"]);
    setAmount("");
    setNote("");
  }

  function onStock() {
    if (selected && !newName) {
      apply(restock(books, selected.id, qty, true), ["cash", "stock", "spend"]);
      return;
    }
    apply(
      upsertItem(books, {
        name: newName,
        qty: Number(qty) || 0,
        cost: Number(newCost) || 0,
        sell: Number(newSell) || 0,
        lowAt: 2,
      }),
      ["stock"],
    );
    setNewName("");
    setNewCost("");
    setNewSell("");
  }

  function pick(item: Item) {
    setItemId(item.id);
    setQty(1);
  }

  const tickerText =
    ticks.length === 0
      ? ["No postings in this window"]
      : ticks.map((row) => row.text);

  return (
    <main className="board">
      <header className="namebar">
        <h1 className="mark">Counter Books</h1>
        {books.sample ? (
          <div className="sample">
            Sample books
            <button type="button" onClick={() => setBooks(emptyBooks(0))}>
              Start mine
            </button>
            <button type="button" onClick={() => setBooks(sampleBooks())}>
              Reload sample
            </button>
          </div>
        ) : (
          <div className="sample">
            <button type="button" onClick={() => setBooks(sampleBooks())}>
              Load sample
            </button>
          </div>
        )}
        <div className="period" role="group" aria-label="Reporting window">
          <button type="button" aria-pressed={period === "today"} onClick={() => setPeriod("today")}>
            Today
          </button>
          <button type="button" aria-pressed={period === "all"} onClick={() => setPeriod("all")}>
            All
          </button>
        </div>
      </header>

      <section className="fascia" aria-label="Day totals">
        <article
          className={`module${settled.includes("profit") ? " settled" : ""}${flash && t.profit < 0 ? " flash" : ""}`}
        >
          <h2>Profit</h2>
          <p className="figure">{pkr(t.profit)}</p>
          <p className="hint">Sales minus cost minus spend</p>
        </article>
        <article className={`module${settled.includes("cash") ? " settled" : ""}`}>
          <h2>Cash</h2>
          <p className="figure">{pkr(t.cash)}</p>
          <p className="hint">On hand, all time</p>
        </article>
        <article className={`module spend${settled.includes("spend") ? " settled" : ""}`}>
          <h2>Spend</h2>
          <p className="figure">{pkr(t.spend)}</p>
          <p className="hint">{period === "today" ? "Posted today" : "All posted expenses"}</p>
        </article>
        <article
          className={`module${settled.includes("stock") ? " settled" : ""}${flash && lows.length ? " flash" : ""}`}
        >
          <h2>Stock</h2>
          <p className="figure">{t.stockQty} pcs</p>
          <p className="hint">Shelf value {pkr(t.stockValue)}</p>
          {lows.length > 0 ? (
            <span className="tag">
              <img src={packingTag} alt="" />
              <span className="tag-copy">{lows[0].name} low</span>
            </span>
          ) : null}
        </article>
      </section>

      <div className="ticker" aria-label="Recent postings">
        <div className="ticker-track">
          {[...tickerText, ...tickerText].map((line, i) => (
            <span key={`${line}-${i}`}>{line}</span>
          ))}
        </div>
      </div>

      <section className="members" aria-label="Sales against expenses">
        <div className="col">
          <h2>Sales</h2>
          {sales.length === 0 ? (
            <p className="empty">No sales in this window. Record one on the till.</p>
          ) : (
            sales.map((s) => (
              <div className="row" key={s.id}>
                <time dateTime={s.at}>{clock(s.at)}</time>
                <span className="who">
                  {s.qty} x {s.itemName}
                </span>
                <span className="amt">{pkr(s.qty * s.unitSell)}</span>
              </div>
            ))
          )}
          <div className="foot">
            <span>Revenue</span>
            <span>{pkr(t.revenue)}</span>
          </div>
        </div>
        <div className="col expenses">
          <h2>Expenses</h2>
          {expenses.length === 0 ? (
            <p className="empty">No expenses in this window.</p>
          ) : (
            expenses.map((ex) => (
              <div className="row" key={ex.id}>
                <time dateTime={ex.at}>{clock(ex.at)}</time>
                <span className="who">
                  {ex.category}
                  {ex.note ? ` ${ex.note}` : ""}
                </span>
                <span className="amt">{pkr(ex.amount)}</span>
              </div>
            ))
          )}
          <div className="foot">
            <span>Spend</span>
            <span>{pkr(t.spend)}</span>
          </div>
        </div>
        <p className="net">
          <span>Sales pulling against expenses</span>
          <span>{pkr(t.profit)}</span>
        </p>
      </section>

      <div className="till">
        <h2>Till</h2>
        <div className="keys">
          <button className="key-plate" type="button" onClick={onSale} disabled={!selected}>
            <img src={keySale} alt="" />
            <span className="sr-only">Record sale</span>
          </button>
          <button className="key-plate" type="button" onClick={onExpense}>
            <img src={keyExpense} alt="" />
            <span className="sr-only">Record expense</span>
          </button>
        </div>
        <div className="opening">
          <div className="field">
            <label htmlFor="item">Item</label>
            <select id="item" value={itemId} onChange={(e) => setItemId(e.target.value)}>
              {books.items.length === 0 ? <option value="">No stock yet</option> : null}
              {books.items.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name} ({i.qty})
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
        </div>
        {selected ? (
          <p className="check">
            {pkr(selected.sell)} each · cost {pkr(selected.cost)}
          </p>
        ) : null}
        <div className="field">
          <span id="cat-label">Expense category</span>
          <div className="cats" role="group" aria-labelledby="cat-label">
            {EXPENSE_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="opening">
          <div className="field">
            <label htmlFor="amount">Amount (Rs)</label>
            <input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="note">Note</label>
            <input id="note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        {error ? <p className="err">{error}</p> : null}
        <div className="opening">
          <div className="field">
            <label htmlFor="opening">Opening cash (Rs)</label>
            <input
              id="opening"
              inputMode="numeric"
              value={opening}
              onChange={(e) => setOpening(e.target.value)}
            />
          </div>
          <button
            className="key"
            type="button"
            onClick={() => {
              const n = Number(opening);
              if (Number.isNaN(n) || n < 0) {
                setError("Opening cash cannot be negative.");
                return;
              }
              setBooks({ ...books, openingCash: n, sample: false });
              bump(["cash"], false);
            }}
          >
            Set
          </button>
        </div>
        <div className="opening">
          <div className="field">
            <label htmlFor="new-name">New item</label>
            <input id="new-name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="new-cost">Cost</label>
            <input
              id="new-cost"
              inputMode="numeric"
              value={newCost}
              onChange={(e) => setNewCost(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="new-sell">Sell</label>
            <input
              id="new-sell"
              inputMode="numeric"
              value={newSell}
              onChange={(e) => setNewSell(e.target.value)}
            />
          </div>
        </div>
        <button className="key" type="button" onClick={onStock}>
          Add or restock
        </button>
      </div>

      <section className="bins" aria-label="Inventory">
        {books.items.length === 0 ? (
          <p className="empty">Bins are empty. Add stock on the till.</p>
        ) : (
          books.items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`bin${item.qty <= item.lowAt ? " low" : ""}`}
              aria-pressed={item.id === itemId}
              onClick={() => pick(item)}
            >
              {item.qty <= item.lowAt ? (
                <span className="tag">
                  <img src={packingTag} alt="" />
                  <span className="tag-copy">{item.name} low</span>
                </span>
              ) : null}
              <div className="n">{item.name}</div>
              <div className="q">
                qty {item.qty} · {pkrPlain(item.sell)}
              </div>
            </button>
          ))
        )}
      </section>
    </main>
  );
}

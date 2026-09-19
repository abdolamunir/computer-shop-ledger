import { lowItems, onHand, outboundQty, inboundQty, stockInsForItem, supplierName, totals } from "./books";
import { productPhoto } from "./catalog";
import { pkr, pkrPlain, sheetDate } from "./format";
import { go } from "./nav";
import { Cell, Sheet, SheetRow } from "./Sheet";
import type { Till } from "./useTill";

const STOCK_COLS = [
  { key: "item", label: "Item" },
  { key: "date", label: "Date" },
  { key: "supplier", label: "Supplier" },
  { key: "stockIn", label: "In", align: "right" as const },
  { key: "sold", label: "Out", align: "right" as const },
  { key: "qty", label: "Stock Balance", align: "right" as const },
  { key: "cost", label: "Unit Price", align: "right" as const },
  { key: "sell", label: "Selling Price", align: "right" as const },
  { key: "profit", label: "Profit", align: "right" as const },
];

export function StockBoard({ till }: { till: Till }) {
  const { books, pick } = till;
  const t = totals(books, "month");
  const soldAll = books.sales.reduce((n, s) => n + s.qty, 0);
  const stockInAll = (books.stockIns ?? []).reduce((n, s) => n + s.qty, 0);
  const lows = lowItems(books);
  const items = [...books.items].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <article className="panel stock-panel">
      <header className="page-head">
        <h3>Stock</h3>
        <p className="page-meta">
          {stockInAll} in · {soldAll} out · {t.stockQty} stock · {pkr(t.stockValue)}
          {lows.length ? ` · ${lows.length} low` : ""}
        </p>
      </header>
      <Sheet
        columns={STOCK_COLS}
        empty={items.length === 0 ? "No stock yet. Use Add stock." : undefined}
      >
        {items.map((item, i) => {
          const photo = productPhoto(item);
          const sold = outboundQty(books, item.id);
          const stockIn = inboundQty(books, item.id);
          const stock = onHand(books, item);
          const low = stock <= item.lowAt;
          const profit = sold * (item.sell - item.cost);
          const at = item.addedAt || stockInsForItem(books, item.id)[0]?.at;
          return (
            <SheetRow
              key={item.id}
              index={i + 1}
              tone={low ? "low" : profit < 0 ? "spend" : undefined}
              onSelect={() => {
                pick(item.id);
                go("stock", item.id);
              }}
            >
              <Cell>
                <span className="sheet-item">
                  {photo ? <img src={photo} alt="" /> : <span>{item.name.slice(0, 1)}</span>}
                  {item.name}
                </span>
              </Cell>
              <Cell>{at ? sheetDate(at) : "—"}</Cell>
              <Cell>{supplierName(books, item.supplierId) || "—"}</Cell>
              <Cell align="right">{stockIn}</Cell>
              <Cell align="right">{sold}</Cell>
              <Cell align="right">{stock}</Cell>
              <Cell align="right">{pkrPlain(item.cost)}</Cell>
              <Cell align="right">{pkrPlain(item.sell)}</Cell>
              <Cell align="right">{pkrPlain(profit)}</Cell>
            </SheetRow>
          );
        })}
      </Sheet>
    </article>
  );
}
